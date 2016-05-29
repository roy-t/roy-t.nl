---
layout: post
title: Implementing A* path finding in C# (and XNA), source-code (can we cut the corner?)
date: 2009-02-24 12:34
author: admin
comments: true
categories:
---

<h3>Update: my latest and greatest implementation of A* can be found <a href="http://127.0.0.1:4000/2011/09/24/another-faster-version-of-a-2d3d-in-c.html">here</a> and is completely superior to this version</h3>

I’ve said I’ve been working on an A* path finding algorithm in C# for one of my XNA projects. I’ve cleaned up the garbage and refactored the algorithm into one nice .cs file (2classes)

Today I will give a short explanation of the A* path finding algorithm and my implementation of it, specifically the extra point about cutting corners. You can download the source code at the end of this article. The source-code can be used in any C# project, and doesn’t use specific XNA classes. (All it really uses are Point’s, generic Lists and a couple of ints and bools).

Note: For more in depth information check out the following links

- <a title="http://www.policyalmanac.org/games/aStarTutorial.htm" href="http://www.policyalmanac.org/games/aStarTutorial.htm">http://www.policyalmanac.org/games/aStarTutorial.htm</a>

- <a title="http://en.wikipedia.org/wiki/A*_search_algorithm" href="http://en.wikipedia.org/wiki/A*_search_algorithm">http://en.wikipedia.org/wiki/A*_search_algorithm</a>

- <a title="http://en.wikipedia.org/wiki/Dijkstra's_algorithm" href="http://en.wikipedia.org/wiki/Dijkstra's_algorithm">http://en.wikipedia.org/wiki/Dijkstra's_algorithm</a> (A* is an extension on Dijkstra’s algorithm. (You could view Dijkstra’s algorithm as A* where H is always 0, more about H later))

Note 2: I will use the terms square and node interchangeable in this article because in my A* implementation my nodes are square, however you can use A* for any kind of shapes for the node, and my code is easily adjustable to accommodate that.

<em>A* generally works the following way  (source: Patrick Lester from policyalmanac.org )

</em>

1) Add the starting square (or node) to the open list.

2) Repeat the following:
<blockquote>a) Look for the lowest F cost square on the open list. We refer to this as the current square.</blockquote>
<blockquote>b) Switch it to the closed list.</blockquote>
<blockquote>c) For each of the 8 squares adjacent to this current square …</blockquote>
<blockquote>- If it is not walkable or if it is on the closed list, ignore it. Otherwise do the following.</blockquote>
<blockquote>- If it isn’t on the open list, add it to the open list. Make the current square the parent of this square. Record the F, G, and H costs of the square.</blockquote>
<blockquote>- If it is on the open list already, check to see if this path to that square is better, using G cost as the measure. A lower G cost means that this is a better path. If so, change the parent of the square to the current square, and recalculate the G and F scores of the square. If you are keeping your open list sorted by F score, you may need to resort the list to account for the change.</blockquote>
d) Stop when you:

Add the target square to the closed list, in which case the path has been found (see note below), or

Fail to find the target square, and the open list is empty. In this case, there is no path.

3) Save the path. Working backwards from the target square, go from each square to its parent square until you reach the starting square. That is your path.

The costs F which is  G+H might not be evident at first. But is calculated the following way:

G is the movement cost from the start point to that square, and H is the estimated cost from there to the end square.

G is calculated as  TargetSquare.G =  parent.G + 10  or + 14 if the square is diagonal from the parent. (That’s because the square root of 2 is 1.4 and we try to keep the numbers integers here)

H is calculated (in my implementation) as the Manhattan distance from the target to the end.  Which is something like (Math.Abs(G.x – H.x) + Math.Abs(G.y – H.y) ) * 10.

The algorithm keeps checking of squares that are on the open list can be reached cheaper from the current square.

<em>Corner Cutting.</em>

Now about the corner cutting: my implementation adds one new situation before the first point of 2.C.
<blockquote>-If the node is diagonal from the current node check if we can cut the corners of the 2 others nodes we will cross. If so this square is walkable, else it isn’t.</blockquote>
A picture might explain better why this is important:

<a href="http://royalexander.files.wordpress.com/2009/02/art.jpg"><img style="display:inline;border-width:0;margin:5px 10px 5px 0;" title="Art" src="http://royalexander.files.wordpress.com/2009/02/art-thumb.jpg" border="0" alt="Art" width="196" height="196" align="left" /></a>

square A is our current square and we are considering if we can walk 2 square B. Square B’s walkable attribute is set to true, so we might think that we can continue to (now point 2) in c, adding it to the open list etc… However if the object that is going to walk the path is going to get to B, a part of it will be at with red indicated areas of squares C and D.  Imagine square D represents a house, that exactly fills the square, this way our object is going to traverse trough a house! However if squares C and D represents a well, centred in a square filled with grass, we can easily cut the corner to get to B.

The rest of my algorithm isn’t any different than general A*. The code is well commented and all the pitfalls are avoided as much as possible. However why the code works might not be evident if you haven’t studied A* first. I suggest you check the link to policyalmanac.org at the top of this article for a very detailed explanation of A*

<em>Speed.</em>

A* is a very fast algorithm, I’ve tested it on a grid with 64 nodes and the general search time was under 1ms.

<em>Download.</em>

You can download the source code via this link: <a href="http://cid-64e785655f2eee72.skydrive.live.com/self.aspx/.Public/XNA3/A-Star-Pathfinding.cs?ccr=480" target="_blank">(My Skydrive)</a>

Don’t be afraid to post your optimizations, notes, questions or other comments here!