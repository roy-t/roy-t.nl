---
layout: post
title: An example of the ref keyword in C# (for structs and classes)
date: 2011-01-22 12:10
author: admin
comments: true
categories:
---
There is a lot of confusion about the <strong>ref</strong> keyword in C#. Many claim that it shouldn't be used for classes, only for the very different <a href="http://www.jaggersoft.com/pubs/StructsVsClasses.htm">structs</a>. But the reference keyword can actually be very handy for both classes and structs!

The reference keyword signals .NET to pass the address of the reference to the correct memory instead of the reference itself. 

I'll first explain the scenario without using the <strong>ref</strong> keyword:
{% highlight csharp %}
Object obj = new Object();
Change(obj);

public void Change(Object o)
{
    o = new Object();
}
{% endhighlight %}

First we create a new object. In our diagram this first creates the data "Reference1" in a fresh piece of memory. This reference is like an address book and points toward a location in memory (for C people, points as in pointer). In the fresh piece of memory where "Reference1" points we place the data for our new object. Now we pass our object to the method change. On a low level this means that a fresh piece of memory is found, the data in "Reference1" is  copied there (For the well computer versed, when a method is called, all the arguments for that method are copied and put on the stack). Let's call this new pointer "Reference2". This "Reference2" at first still points at "MemoryLocation1". However in the Change method we now create a new Object using the <strong>new</strong> keyword. This creates a new object in a fresh location in our memory. Let's call this "MemoryLocation2". To reflect these changes the address where "Reference2" is pointing at is also changed, this way we keep referencing the correct object. As you can see the address in "Reference1" is not changed, so "Reference1" still points at "MemoryLocation1" and "Reference2" points at "MemoryLocation2".

Now let's consider what happens when we do use the reference keyword.

{% highlight csharp %}
Object obj = new Object();
Change(ref obj);

public void Change(ref Object o)
{
    o = new Object();
}
{% endhighlight %}

At first we again have "Reference1" pointing at "MemoryLocation1". But when we pass our new object to the Change method something different happens. Instead of copying "Reference1" the memory location of "Reference1" is copied and put on the stack, in our diagram this is "ReferenceAddress". When new object is created it's again put in a fresh memory location (say "MemoryLocation3"). However since we are working with the address of "Reference1", instead of a new reference, "Reference1" is updated to point to "MemoryLocation3".  So the instance <strong>o</strong> inside the method change and the instance <strong>obj</strong> are now the same.

If this is still a bit fuzzy to you, here is a piece of code that should make it totally clear :). Note that structs and classes act in the same fashion this way:
{% highlight csharp %}

public class MyClass //public struct MyStruct looks exactly the same, but is a struct
{
    public int MyData;
    public MyClass(int data)
    {
        this.MyData = data;
    }
}
class Program
    {
        static void Main(string[] args)
        {
            MyStruct struct1 = new MyStruct(1);
            Modify(struct1);

            MyStruct struct2 = new MyStruct(2);
            ModifyRef(ref struct2);
            Console.Out.WriteLine(String.Format("struct1: {0}, struct2: {1}", struct1.MyData, struct2.MyData));
//outputs "struct1: 1, struct2: 21"

            MyClass class1 = new MyClass(1);
            Modify(class1);

            MyClass class2 = new MyClass(2);
            ModifyRef(ref class2);

            Console.Out.WriteLine(String.Format("class1: {0}, class2: {1}", class1.MyData, class2.MyData));
//outputs "class1: 1, class2: 21"
            Console.ReadLine();
        }

        static void Modify(MyStruct s)
        {
            s = new MyStruct(11);
        }
        static void Modify(MyClass c)
        {
            c = new MyClass(11);
        }
        static void ModifyRef(ref MyStruct s)
        {
            s = new MyStruct(21);
        }
        static void ModifyRef(ref MyClass c)
        {
            c = new MyClass(21);
        }
    }
{% endhighlight %}
