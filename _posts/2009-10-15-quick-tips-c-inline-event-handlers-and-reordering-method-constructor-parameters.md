---
layout: post
title: Quick Tips, C# inline event handlers and Reordering method / constructor parameters
date: 2009-10-15 12:03
author: admin
comments: true
categories:
---
I always hate having to write an extra method to deal with event handlers and today it irritated me more than ever. The extra event handlers all consisted of just one line of code, it's also harder to read what is going on if you have to scroll down all the time to check what that event handler is doing.

So today I finally typed in "C# inline event handlers" in Google. And the first website I <a title="Code Magazine" href="http://www.code-magazine.com/Article.aspx?quickid=0303072" target="_blank">clicked</a> already gave me what I was looking for. Apparently this was added in C# 2.0 and it basically boils down to this:

{% highlight csharp %}
this.button1.Click +=
delegate(object sender, EventArgs e)
{    MessageBox.Show(&amp;amp;quot;Test&amp;amp;quot;);   };
{% endhighlight %}

Quick easy and very handy!
(note: crashovrd noted correctly that these are not 'inline event handlers' but are called anonymous methods, thanks crashovrd!)

Another thing that I found out recently is that you can easily reorder method and constructor parameters using Visual Studio 2008's built in refactoring tools. All you have to do is right click the method/constructor and select Reorder parameters. Very easy and very handy. Just the kind of trick you have to know that is there to be able to use it.

<img class="alignnone size-full wp-image-210" title="Reorder context" src="http://royalexander.files.wordpress.com/2009/10/reorderparams.png" alt="Reorder context" width="423" height="166" />

You'll get a nice form which allows you to reorder your parameters, Visual Studio will automatically update all callers.

<img class="alignnone" title="Refactoring paramaters" src="http://i.msdn.microsoft.com/ms379618.vs2005_refactoring-fig10(en-US,VS.80).gif" alt="" width="450" height="372" />

Of course these are all tips that are simple and are well documented on the internet, if you look for them,  but maybe I'll make a few of you guys happy with these.
