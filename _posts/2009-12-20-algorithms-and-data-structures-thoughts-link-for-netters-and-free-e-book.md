---
layout: post
title: Algorithms and Data Structures (thoughts, link for .Netters, and free e-book)
date: 2009-12-20 20:57
author: admin
comments: true
categories:
---
<em>(Since this has become quite a long article, I would like to point out that the link and free e-book are found at the bottom of this article).</em>

Algorithms and data structures are one of the most important (and sometimes hard) things in computer science. As I've recently came to see just how important having an efficient algorithm. Take for example my A* example, the first iteration of version 2 was incredibly slow because the .Net list data structure is geared toward iterating and adding items and less toward finding items.

First I did not see this problem. I benchmarked the A* code and came to the conclusion that it was too slow to be usable. Finding a path took about 3000ms. Without looking at the data structures and algorithms I began micro-optimizing the code. A tedious task which often makes the code less readable, however I was ‘successful’ finding a path now only took about 1000ms, making the algorithm 3 times as fast. A remarkable improvement, but still not enough to make A* usable in games. And I knew from previous experience and literature that A* is often used in games and rather fast.

After a while I asked for help on a couple of forums and people started to point out the slowness was caused because I had to look up if a tile was contained in a list or not. This happened a couple of times every iteration. The .Net list data type requires to look through the entire list from a till z (until it finds the item) to determine if it’s in there. This way every iteration became quite complex although not much needed to be done in each iteration I still had to check the entire list multiple times.

The solution was simple. Use a Boolean flag on the tile to put it in a list. This way I can just ask the tile if it is ‘in a list’ or not. This proved to make the code several orders of magnitude larger, now I could find a path in 10ms. Which made the code 100x faster, al because of using a different data structure.

<strong>Big O</strong>

To explain why this is possible I will first have to tell you something about “Big O”.  The .Net data structure for lists is not at all a poor or slow type. Adding something to the list is very fast (Usualy O(1) which means that no matter how much items are in the list, inserting another item will always be ‘constant time’ fast. No matter how much items are already in there).  Searching for an item however is a bit less fast.  To show how fast I will give a small code example:

{% highlight csharp %}
for(int i = 0; i &amp;lt; list.Count; ++i)
{
        if(list[i] == searched){returen true;}
}
{% endhighlight %}

return false;

This is roughly how the contains method is implemented. As you can see we have to traverse the entire list until we find that list[i] == searched is true. If the item is not in the list we have to wait till the last item and then we can tell that it was not there.  This type of solution is considered O(n)  here n means that the time it takes to execute this algorithm is dependent on n, the number of items.

There are multiple ways for an algorithm to be dependent on n. Here I list the most common dependencies (with examples where to find them).
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td width="307" valign="top">Complexity</td>
<td width="307" valign="top">Real life example</td>
</tr>
<tr>
<td width="307" valign="top">O(1)</td>
<td width="307" valign="top">Boolean flags, searching   in a hashtable</td>
</tr>
<tr>
<td width="307" valign="top">O(log n)</td>
<td width="307" valign="top">Binary search (only   possible on sorted items)</td>
</tr>
<tr>
<td width="307" valign="top">O(n)</td>
<td width="307" valign="top">Iterative search (always   possible)</td>
</tr>
<tr>
<td width="307" valign="top">O(n^2)</td>
<td width="307" valign="top">Sorting by using a loop in   a loop</td>
</tr>
</tbody>
</table>
Usualy O(n^x) is considered inefficient but for some very specific problems involving primes it’s the fastest we can go. There are also problems that we can’t do efficiently yet, these involve all the problems in the class P ( <a href="http://en.wikipedia.org/wiki/Sharp-P">http://en.wikipedia.org/wiki/Sharp-P</a> )

Of course some problems are not exactly O(n). For example in the sample we could say we would have to do multiple things for each n. We have to check if ‘i’ is not bigger than the count, we have to check if we found our item, etc.. So let’s say that this problem is O(3n). This would be correct however we never write it down like that because constants don’t affect the complexity. Something that is O(n) depentend on n, will always be faster then something that is O(n^2) dependent on n.

<strong>Academically versus real world</strong>

Well academically it’s simple. No matter how inefficient your O(n) code. If another piece of code takes O(n^2) times <em>(or anything else dependent on n)</em> there is an n big enough which makes the algorithm dependent on n slower than the not dependent algorithm. Given this example O(1000n) versus O(n^2) we can see that for a number as small as 32 the ‘slow’ O(n) is slower than the ‘quick’ O(n^2). Since 32^2 = 1024 < 32000.

However what if we have a container with 1000 items. We now see that 1000^2 = 1000*1000. And what for an n even greater than 1000, say 1002? We now see that 1002^2 = 1004004 > 1002000. As we see 1000 is the breakeven point for O(1000n) and O(n^2). For an n greater than 1000 our O(n) algorithm is faster, as it should be.

Academically we are done, but in the real world we have to make a consideration? What is the chance that there will be more than 1000 items in our data structure? If the question is very unlikely it might be smart to go with the O(n^2) algorithm although for large numbers this is always slower. (And remember that for every n bigger than 1000 this functions takes ^2 more time, not a n-constant factor).

Always analyze what functions are used most on your data structures. (Is your data structure insert, find, or delete heavy? And does it ‘indexing’ access?) There is no data structure that can do everything fast, so be sure to search for a data structure that is as close to O(1) as possible for you.

For example a linked list has faster deletion (<em>O(1)</em> <em>once the item is found)</em> , and equally fast insertion as a normal list, however using linkedlist[550] is slow O(n) on a linked list while this is O(1) on a normal list. If you want to delete a lot you want to use a linked list, but if you want to index a lot you want to use a normal list.

Sometimes you can use two data structures in conjunction as to make all algorithms fast. Or cheat by doing a trick. Need to check if something is contained in a list? Try instead of using a list using a hash table which can do a ‘contains’ check in O(log n) or faster.  Or try using Boolean flags on the object it’s self.

<strong>Helpful link and an e-book</strong>

After randomly browsing the web I came along an interesting link on <a title="Sgt. Conker's" href="http://www.sgtconker.com/" target="_blank">Sgt. Conker's</a> website.

Without further delay I present you: <a title="MSDN" href="http://msdn.microsoft.com/en-us/vcsharp/aa336800.aspx" target="_blank">the link</a>.

It's a relatively old page on MSDN about Algorithms and Data structures for .Net, however I still think this is a must read for every .Net developer.

For a more general approach to efficient algorithms and data structures I can recommend this free e-book: <a href="http://www.jjj.de/fxt/#fxtbook">http://www.jjj.de/fxt/#fxtbook</a> (for most people the .pdf file link is what you are looking for), which in no less than 1000 pages explains everything there is to know about algorithms and data structures.
