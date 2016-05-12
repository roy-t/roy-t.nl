---
layout: post
title: Another faster version of A* (2D+3D) in C#
date: 2011-09-24 21:08
author: admin
comments: true
categories:
---
As you might know I once wrote an A* sample for C# more than 2 years ago. The first version worked but was very slow because of a bug. The second version was faster, and a third version (made by one of the readers of this blog) was even faster.

Btw did you know that the excellent game <a href="http://www.garethpw.co.uk/2009/06/dysnomia.html">Dysomnia</a> shipped with (a modified) version of my C#/A* code? Ok it's just a few lines to get people started but it's really cool to see how people use this little start for their cool projects!

Anyway, back on topic: during my internship at Nixxes an interested co-worker (thanks Marcel!) tweaked the heuristic, removed some unnecessary checks, and added a faster way to check if a tile was processed yet.

There is not much else to say, it's still A*, it supports 2D and 3D, it uses a MinHeap and is faster than ever! (Note: this is a pure C# solution, so it doesn't require XNA, but it will work nicely with XNA even on WP7 and the Xbox360).

<a title="Version 2011-09-24" href="http://roy-t.nl/files/AStar3D-2011-09-24.zip">Download the latest version here</a>

Older relevant blog posts about A*  (from older to newer)

<a href="http://roy-t.nl/index.php/2009/02/24/implementing-a-path-finding-in-c-and-xna-source-code-can-we-cut-the-corner/">http://roy-t.nl/index.php/2009/02/24/implementing-a-path-finding-in-c-and-xna-source-code-can-we-cut-the-corner/</a>

<a href="http://roy-t.nl/index.php/2009/07/07/new-version-a-pathfinding-in-3d/">http://roy-t.nl/index.php/2009/07/07/new-version-a-pathfinding-in-3d/</a>

<a href="http://roy-t.nl/index.php/2010/06/27/more-a-improvements/">http://roy-t.nl/index.php/2010/06/27/more-a-improvements/</a>
