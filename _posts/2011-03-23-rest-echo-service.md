---
layout: post
title: REST Echo Service
date: 2011-03-23 09:40
author: admin
comments: true
categories:
---
Today I was working on a JAVA program that had to send GET requests to a RESTFul webservice. For debugging purposes I wanted to make sure that my program send the key-value pairs in such a way that PHP (and other web scripts) would understand it. Of course I could c/p the output URL and check it by hand, but errors can creep up easily that way.

The script (really 3 lines of PHP and a few lines of HTML) echos all the GET key-value pairs so that you can easily check if everything is alright (for example check if the URLEncoding worked) .

To use the scrip just navigate your program to <a title="REST Echo Service" href="http://roy-t.nl/services/RESTEcho.php" target="_blank">http://roy-t.nl/services/RESTEcho.php</a>.

In your application you should see output like this:

{% highlight html %}
﻿<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
                      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
 <title>REST GET echo service</title>
</head>
<body>
<p>
This simple PHP script will output all the get variables which where sent in the last HTTP request.
</p>
<p>
GET variables received: <br/>
</p>
Array
(
    [MyKey] => MyValue
)
</body>
</html>
{% endhighlight %}

Of course you can also try it from your browser.

Anyway, have fun with it, it's just tiny debugging tool that saves you the 5 minute trouble of firing up your own host and typing three lines of PHP.
