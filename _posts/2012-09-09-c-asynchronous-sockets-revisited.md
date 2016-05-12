---
layout: post
title: C# Asynchronous sockets revisited 
date: 2012-09-09 13:37
author: admin
comments: true
categories:
---
<a title="Old tutorial" href="http://roy-t.nl/index.php/2009/05/31/sending-objects-via-high-speed-asynchronous-sockets-in-c-serialization-socket-programming/">Three years ago</a> I wrote a quick code snippet explaining asynchronous sockets. Recently someone found a rather large <a title="Bugs everywhere!" href="http://stackoverflow.com/questions/12335542/why-im-forced-to-close-c-sharp-asynchronous-client-socket-after-every-transa/12336829">bug</a> in that code so I decided to rewrite the tutorial (it's one of my more popular articles and people have long been asking for the source code, which I lost a few years ago. So this way I kill a bug and give people the source code all at once).

I would like to thank stackoverflow user Polity for notifying me of the problems.
<h1>The client</h1>
Let's first start with the client. For this example I created a small console application. It reads lines from the console until it sees an empty line. The text is then converted to a byte[] using the UTF8-Encoding schema.  Meanwhile I create a socket and call the BeginConnect method to start the process of creating an asynchronous connection. Asynchronous in this regards means that the entire program can keep crushing while a separate thread setups up the connection and sends the data. To guide the setup and the sending of the data while the program is running several callbacks are used. One to finish the connection setup and one to send the actual data. Before the actual message is sent I first send 4 bytes to tell how long the message is going to be. (Not doing this caused a subtle bug in the previous version which assumed a message was done once the receive buffer of the server was not entirely filled).
<h1>The server</h1>
The server is also simple. There is one socket continuously accepting new connections. So in contrary to the previous version this version accepts multiple concurrent connections. Once a connection has been made a separate thread is spawned, implicitly, by using the asynchronous BeginAccept method. In a callback the connecting is accepted using a new socket so the server can keep listing for more connections on the old socket. For each connection a small state object is kept to do the bookkeeping. It stores the active socket, the buffer, and fields  with information about the amount of data we expect to receive and how much data we have indeed received. In the read callback the first 4 bytes are extracted so that we know how much data to accept. After that we keep using BeginReceive until all data has made it's way to the server. Only then we reconstruct the message.

Note that I use the TCP protocol for the sockets so I know that the data will be complete and in-order.
<h1>The source code</h1>
I've created a Visual Studio 2012 solution with the above two projects in them. Everything is compiled using the .NET 4.5 framework. The example will probably also compile in .NET3.5 but I noticed some methods that I previously used were deprecated  in .NET4.5, so I've used alternatives that might no be available in .NET3.5 (should be trivial to fix).

You can find the source code <a href="http://roy-t.nl/files/AsynchronousSockets.zip">here</a>
<h1></h1>
