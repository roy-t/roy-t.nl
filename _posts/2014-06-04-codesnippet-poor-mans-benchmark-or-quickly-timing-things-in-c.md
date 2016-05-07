---
layout: post
title: Codesnippet, Poor man's benchmark, or quickly timing things in C#
date: 2014-06-04 14:50
author: admin
comments: true
categories:
---
For a project I'm working on I had to do some quick timing. Now manually working with DateTimes and TimeSpans isn't hard but I had to do a lot (e.g. more than 3) timings inside a bigger process and I wanted to know both the time the entire process took as the time parts of the process ate up. For this I created a handy StopWatch class which uses a stack to store different date times so you can easily do nested timing with very little code. This is nothing revolutionary but I thought I'd share it anyway. Its those little things that save some time that are the nicest!

{% highlight csharp %}
/// <summary>
/// Always accesible timing apparatus
/// </summary>
public static class StopWatch
{
	private static Stack<DateTime> timers;

	static StopWatch()
	{
		timers = new Stack<DateTime>(0);
	}


	/// <summary>
	/// Pushes the current DateTime onto the stack of timers
	/// </summary>
	public static void Push()
	{
		timers.Push(DateTime.Now);
	}

	/// <summary>
	/// Pops the top DateTime from the stack of timers,
	/// returns the TimeSpan between when the last Push and now
	/// </summary>        
	public static TimeSpan Pop()
	{
		if(timers.Count > 0)
		{
			DateTime start = timers.Pop();
			return DateTime.Now - start;
		}
		else
		{
			throw new Exception(&quot;Trying to pop while the stack is empty&quot;);
		}
	} 

	/// <summary>
	/// Calls Pop(), then prints the text &quot;StopWatch: {totalSeconds} \n&quot;
	/// directly to console.
	/// </summary>
	public static void PopAndPrint()
	{            
		Console.Out.WriteLine(&quot;StopWatch: &quot; + Pop().TotalSeconds);
	}
	
	/// <summary>
	/// Returns the TimeSpan between the last Push and now
	/// without popping the TimeSpan from the stack of timers
	/// </summary>        
	public static TimeSpan Peek()
	{
		if(timers.Count > 0)
		{
			DateTime start = timers.Peek();
			return DateTime.Now - start;
		}
		else
		{
			throw new Exception(&quot;Trying to peek while the stack is empty&quot;);
		}
	}
{% endhighlight %}


Usage
{% highlight csharp %}
static void Main(string[] args)
{
	// Measure the entire process
	StopWatch.Push();
	{
		// Measure subtask            
		StopWatch.Push();
		
		// Subtask took:
		StopWatch.PopAndPrint();
	}
	// Entire process took:
	StopWatch.PopAndPrint();
}
{% endhighlight %}

Output
{% highlight csharp %}
[sourcecode]
StopWatch: 0.0010001
StopWatch: 0.0020001
{% endhighlight %}
