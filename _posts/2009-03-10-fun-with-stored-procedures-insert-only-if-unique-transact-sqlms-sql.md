---
layout: post
title: Fun with stored procedures, insert only if unique. (Transact-SQL/MS SQL)
date: 2009-03-10 19:01
author: admin
comments: true
categories:
---
As I’ve said in my previous post stored procedures are allot more powerful than I thought. And really have their own scripting (compiled scripts that is) access to the database.

Stored procedures are often used to enhance the speed of queries that are performed very often, however modern database systems nowadays track queries and store/compile queries that are performed allot of times. So what are the modern day uses for stored procedures?

Stored procedures:

-Save roundtrips  <em>(if you want to do a query based on the result of another query, you can compact those two queries in one).</em>

-Can batch work <em>(if you always do 2 queries at the same time you can call them in only one trip to the database).</em>

-Are Save <em>(in most modern database systems stored procedures are called using parameterized queries or special objects that already wrap/escape dangerous user input).</em>

<em>-</em>Can put extra constrains on data <em>(first check if some other value in the database is not interfering with the soon to be executed query)</em>

<em>-</em>Can synchronize across multiple applications <em>(stored procedures can lock fields/rows/columns/tables for a short amount of time for better concurrency support)</em>

Today I’m going to show a very simple stored procedure written in <a href="http://en.wikipedia.org/wiki/T-SQL" target="_blank">Transact SQL</a> Microsoft and Sybase’s proprietary SQL dialect, and C# that hopefully demonstrates all except for the last of the previous points.

First I’ve created a small class that represents a user. The class has the following standard props:

{% highlight csharp %}
public String UserName { get; set; }
public String FirstName { get; set; }
public String LastName { get; set; }
public String Email { get; set; }
{% endhighlight %}

And a special prop that handles password hashing (never save a password as plain text in a database, always save a hash) (note: be sure to add a using directive for System.Security.Cryptography;)

{% highlight csharp %}
public String Password
{
	get
 	{
 		return passwordHashed;
 	}
 	set
 	{
 		UTF8Encoding encoder = new UTF8Encoding();
 		MD5CryptoServiceProvider hasher = new MD5CryptoServiceProvider();
 		passwordHashed = encoder.GetString(hasher.ComputeHash(encoder.GetBytes(value)));
 	}
}
private string passwordHashed = "";
{% endhighlight %}

Now start up SQL Server Management Studio (Express/Basic) and navigate to your database, then select the folder programmability->stored procedures and right click to insert a new stored procedure. (Also make a user table if you haven’t got a table yet where you want to try this out on, I’m using a simple table with all the values as nvarchar(50)’s and the id as an int.)

Normally before you insert a user you first verify that the input is legit (a valid email address, strong enough passwords and a username exceeding some minimal length). That can all be handled client and server side using <a href="http://www.devhood.com/Tutorials/tutorial_details.aspx?tutorial_id=46" target="_blank">.Net’s validation controls</a>.  Once you’ve done that you would query the database if the username and email address already exist. If not you would run another query (insert) to input the actual data.  Because when inserting a user you will always have to do the ‘check if exists’ query first, and inserting users might be a common task, there is room for improvement here.

I’ve done that using the following stored procedure:

<em>Note: when multiple pages/threads call this sp it might suffer from race conditions, for more information about race conditions see the comments section. (Especially the first comment by Alister).</em>

{% highlight sql %}
CREATE PROCEDURE InsertUniqueUser
@Username nvarchar(50),
@Password nvarchar(50),
@LastName nvarchar(50),
@FirstName nvarchar(50),
@Email nvarchar(50),
@UserID int OUTPUT
AS
IF NOT EXISTS(SELECT Username FROM Users WHERE Username=@Username OR Email=@Email)
 BEGIN
 INSERT INTO Users
 (Username, Password, LastName, FirstName, Email)
 VALUES (@Username, @Password, @LastName, @FirstName, @Email)
 SET @UserID = @@IDENTITY
 END
ELSE
 BEGIN
 SET @UserID = -1
 END

{% endhighlight %}

Be sure to execute this procedure to insert and compile the actual stored procedure.

As you can see this stored procedure has 5 inputs (Username etc..)  and one output: the UserID.  The syntax is pretty simple. First an internal (thus fast) query is performed to check if there exists a record that either has a username same as the input username or an email address same as the input email address. If this is not the case the actual work begins and we do a normal insert query. At the end of the query the UserID output value is set to either the identifier of the inserted record or –1 if there was no record inserted.

This procedure saves a round trip to the database, batches work, put’s extra constrains (and validation) on the data in the database and is safe (as we will see shortly after)

To use this fine stored procedure we will have to create a special form of a parameterized query in C# that looks like this:

{% highlight csharp %}
int newID;
SqlConnection connection = new SqlConnection(connectionString);
SqlCommand command = new SqlCommand("InsertUniqueUser", connection);
command.CommandType = System.Data.CommandType.StoredProcedure;
command.Parameters.Add(new SqlParameter("@Username", System.Data.SqlDbType.NVarChar, 50));
command.Parameters["@Username"].Value = user.UserName;
command.Parameters.Add(new SqlParameter("@Password", System.Data.SqlDbType.NVarChar, 50));
command.Parameters["@Password"].Value = user.Password;
command.Parameters.Add(new SqlParameter("@LastName", System.Data.SqlDbType.NVarChar, 50));
command.Parameters["@LastName"].Value = user.LastName;
command.Parameters.Add(new SqlParameter("@FirstName", System.Data.SqlDbType.NVarChar, 50));
command.Parameters["@FirstName"].Value = user.FirstName;
command.Parameters.Add(new SqlParameter("@Email", System.Data.SqlDbType.NVarChar, 50));
command.Parameters["@Email"].Value = user.Email;
command.Parameters.Add(new SqlParameter("@UserID", System.Data.SqlDbType.Int, 4));
command.Parameters["@UserID"].Direction = System.Data.ParameterDirection.Output;

try
{
	connection.Open();
 	command.ExecuteNonQuery();
 	newID = (int)command.Parameters["@UserID"].Value;
}
catch (Exception ex)
{
	//trace error
 	string log = ex.Message;
}
finally
{
	connection.Close();
}
return newID;

{% endhighlight %}

As you can see we are building a pritty normal stored procedure. be sure to System.Data.SqlDbType values for the SqlParameters. Also note that in the last line before the try we set the Direction of the "@UserID” parameter to Output. This way the stored procedure can store data in UserID.

If you build a small webpage/winforms app around this you will see that the newID returned is the ID value of the the newly inserted record in the database if there where no duplicates, or that the newID was –1 and that there haven’t been made new records.
