---
layout: post
title: Sending objects via high speed asynchronous sockets in C# (Serialization + Socket programming)
date: 2009-05-31 14:16
author: admin
comments: true
categories:
---
<strong>DISCLAIMER</strong>

Some users at stackoverflow found bugs in this implementation, see the rightful complaints <a title="Bugs bugs bugs" href="http://stackoverflow.com/questions/12335542/why-im-forced-to-close-c-sharp-asynchronous-client-socket-after-every-transa/12336829">here</a>. As it stands now this code will not handle sending data that is larger than 1 packet correctly. You will have to implement some sort of protocol to handle this to replace the wrong check that there is now that just keeps reading if a full packet was received. It also doesn't close the client-socket properly when everything is done. Leaving that to the client which can be forgotten. I would like to thank the stackoverflow user Polity for posting here to bring the bugs to my attention!

You can find a new updated version <a title="Updated version" href="http://roy-t.nl/index.php/2012/09/09/c-asynchronous-sockets-revisited/">here</a> that fixes all these problem, has been brought up-to-date and includes the source code. I'll keep this old article here for reference, but please use the new article when you're actually building something!

<strong>END DISCLAIMER</strong>

Well a while has past since my last useful post here, but here I am at it again a post filled with useful source code to use in your everyday C# programs.

I was very curious how games work with async sockets to keep everyone communicating smoothly so I set up a simple test app to test async sockets in C#, however this seemed quite a bit harder than I thought and after some help at the Dutch website <a href="http://www.tweakers.net">tweakers.net</a> I finally had everything working. (I finally figured out that I shouldn't be using the beginsendpacket but the beginsend methods). Anyway let's get straight to business.

I first made a small object that we want to send over the network, let's call it Status, below is the source code for that object, let's make a couple of stuff clear.

{% highlight csharp %}
[Serializable]
    public class Status
    {
        [NonSerialized]
        public Socket Socket;
        [NonSerialized]
        public List<byte> TransmissionBuffer = new List<byte>();
        [NonSerialized]
        public byte[] buffer = new byte[1024];

        public string msg;     //the only thing we really send.

//Usually you shouldn't but these 2 methods in your class because they don't operate specifically on this object
//and we would get allot of duplicate code if we would put those 2 methods in each class we would like to
//be able to send but to not wind up having to write a couple of utility classes (where these should reside)
// I let them reside here for now.
        public byte[] Serialize()
        {
            BinaryFormatter bin = new BinaryFormatter();
            MemoryStream mem = new MemoryStream();
            bin.Serialize(mem, this);
            return mem.GetBuffer();
        }

        public Status DeSerialize()
        {
            byte[] dataBuffer = TransmissionBuffer.ToArray();
            BinaryFormatter bin = new BinaryFormatter();
            MemoryStream mem = new MemoryStream();
            mem.Write(dataBuffer,0, dataBuffer.Length);
            mem.Seek(0, 0);
            return (Status)bin.Deserialize(mem);
        }
    }
{% endhighlight %}

As you can see the class is marked serializable with [Serializable] this signals the compiler that we should be able to serialize this object. (Get it from memory, place it in a byte array and send it anywhere (harddrive/network/etc..). Stuff that shouldn't be send with it like external classes that we would like to send later should be marked [NonSerialized] (the Java equivalent for transient). This way we can cut of some dependencies and keep the overhead low. (For example no matter what the TransmissionBuffer referenced to, because it's nonserialized it's reference will not be send aswell and it will appear on the other side as "null".

As you can see the only real data this object hold is a small string called msg the other objects are for administrative purposes as we will see soon.

Now there are allot of examples out there that show how to send a string, you can easily get the bytearray from a string and send it anywhere, for an object that is slightly harder, as you can see in the serialize() method we have to create a binarrayformatter, this binarray formatter is then fed a direct stream to the memory where our object resides and a reference to our memorystream, the object is serialized in our memorystream's buffer as a bytearray and then we can do anything we want with it. This method just returns the buffer so we can set it over a network. The deserialize method does exactly the same but then the other way arround except for the mem.Seek(0,0); we see right before return, this seek sets the pointer of the stream at the start of the stream so the binarrayFormatter can start reading and deserializing from the start of the stream. (Forgetting this would give an error telling that the end of the stream was found before deserialzing was completed, which makes sence if you think about it).

Anyway before we get to the real workhorse of the code let's take a look at the client.

{% highlight csharp %}
public class Client
{
ManualResetEvent allDone = new ManualResetEvent(false);

///
/// Starts the client and attempts to send an object to the server
///
public void Start()
{
	while (true)
	{
		Console.Out.WriteLine("Waiting for connection...");
		allDone.Reset();
		Socket sender = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
		sender.BeginConnect(new IPEndPoint(IPAddress.Loopback, 1440), Connect, sender);
		allDone.WaitOne(); //halts this thread until the connection is accepted
	}
}

///
/// Starts when the connection was accepted by the remote hosts and prepares to send data
///
public void Connect(IAsyncResult result)
{
	Status status = new Status();
	status.Socket = (Socket)result.AsyncState;
	status.Socket.EndConnect(result);
	status.msg = "Hello webs";
	byte[] buffer = status.Serialize(); //fills the buffer with data
	status.Socket.BeginSend(buffer, 0, buffer.Length, SocketFlags.None, Send, status);
}

///
/// Ends sending the data, waits for a readline until the thread quits
///
public void Send(IAsyncResult result)
{
	Status status = (Status)result.AsyncState;
	int size = status.Socket.EndSend(result);
	Console.Out.WriteLine("Send data: " + size + " bytes.");
	Console.ReadLine();
	allDone.Set(); //signals thread to continue so it sends another message
}
{% endhighlight %}

Don't mind the manualreset events to much, they're there so the application doesn't go to fast so we can see what happens instead of 2 console windows just printing text like mad :). (Remember that they will send as fast as possible because they are asynchronous and don't have to wait for the first send to complete so yeah some pause points are quite handy for now, in a real client you wouldn't use while(true) but something more sophisticated like an update interval or when something changed.

As you can see the start method creates a socket and tries to send some data nothing super special here except for that the beginconnect method references the connect method. When the server is ready for a connection the connect method is executed, we create a new status object and place the socket we get returned from the endAccept method in there for bookkeeping (we need it later to send data else we don't know which socket we where using, this is also why the socket is [unserialized] we don't need to send it the other way). We also fill the msg of the object and then serialize it to a byte array, we place that bytearray in the beginsend method.

When the server is ready for receiving data the Send method is called. This method uses the socket in the packet to call endsend and read how many bytes where send.

And now, the server!

{% highlight csharp %}
public class Server
{
	ManualResetEvent allDone = new ManualResetEvent(false);

	///
	/// Starts a server that listens to connections
	///
	public void Start()
	{
		Socket listener = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
		listener.Bind(new IPEndPoint(IPAddress.Loopback, 1440));
		while (true)
		{
			Console.Out.WriteLine("Waiting for connection...");
			allDone.Reset();
			listener.Listen(100);
			listener.BeginAccept(Accept, listener);
			allDone.WaitOne(); //halts this thread
		}	
	}
}

	///
	/// Starts when an incomming connection was requested
	///
	public void Accept(IAsyncResult result)
	{
		Console.Out.WriteLine("Connection received");
		Status status = new Status();
		status.Socket = ((Socket)result.AsyncState).EndAccept(result);
		status.Socket.BeginReceive(status.buffer, 0, status.buffer.Length, SocketFlags.None, Receive, status);
	}

	///
	/// Receives the data, puts it in a buffer and checks if we need to receive again.
	///
	public void Receive(IAsyncResult result)
	{
		Status status = (Status)result.AsyncState;
		int read = status.Socket.EndReceive(result);
		if (read &amp;gt; 0)
		{
			for (int i = 0; i &amp;lt; read; i++)
			{
				status.TransmissionBuffer.Add(status.buffer[i]);
			}
			//we need to read again if this is true
			if (read == status.buffer.Length)
			{
				status.Socket.BeginReceive(status.buffer, 0, status.buffer.Length, SocketFlags.None, Receive, status);
				Console.Out.WriteLine("Past niet!");
			}
			else
			{
				Done(status);
			}
		}
		else
		{
			Done(status);
		}
	}

	///
	/// Deserializes and outputs the received object
	///
	public void Done(Status status)
	{
		Console.Out.WriteLine("Received: " + status.msg);
		Status send = status.DeSerialize();
		Console.WriteLine(send.msg);
		allDone.Set(); //signals thread to continue
		//So it jumps back to the first while loop and starts waiting for a connection again.
	}
}
{% endhighlight %}

Well start and accept basically do the same as the client but then the other way around, the only big difference we have is the receive method which endreceives() the data, but it's not done yet, first it has to check if all the bytes where received if not we have to put the object in a listening state again to get the rest of the bytes from the networkcard. Then when all the bytes are safely inside our Transmissionbuffer we deserialize our object and print the msg we place in it.

Allot of work to just send a string accros, but this code will work any object and make your server nonblocking which could make it much faster, just instead of putting "string msg" in your status object put "TheObjectYouWant obj" in your status object and you are free todo as you please.

Feel free to ask questions and comments, the full sourcecode is available here: <a href="http://cid-64e785655f2eee72.skydrive.live.com/self.aspx/.Public/Async%20Sockets/AsyncSocketServer+Client.rar">AsyncSocketServer+Client.rar</a>
