---
layout: post
title: Implementing A* into XNA
date: 2009-02-22 21:55
author: admin
comments: true
categories: 
---
<h3>Update: my latest and greatest implementation of A* can be found <a href="http://127.0.0.1:4000/2011/09/24/another-faster-version-of-a-2d3d-in-c.html">here</a></h3>

Most of the day I’ve been toying around with the implementation details of A*.  A* is both easy and hard at the same time, small errors in the function that calculates the cost of each node can really break the algorithm (and especially an ‘<’ instead of an ‘>’ and a faulty initialisation can break it, of which I’m, after a good old debugger session, am now painfully aware.

I’m not ready to post my code yet (it still has a nasty quirk, diagonal tiles are somehow very rarely considered even if you try to go from 0,0 to 5,5 without obstacles where a diagonal path (1,1  2,2 3,3 4,4) would be the fastest.  I think I’ve found the piece of code where it goes wrong though)  But I’ll soon do once I eliminated all the bugs and optimized/refactored the code.

Meanwhile have a look at <a href="http://www.policyalmanac.org/games/aStarTutorial.htm">http://www.policyalmanac.org/games/aStarTutorial.htm</a> it’s a very good beginners tutorial (not tailored to any language) be sure to read it front-to-end before implementing it .
