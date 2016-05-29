---
layout: post
title: More A* improvements
date: 2010-06-27 14:27
author: admin
comments: true
categories:
---
As you might know I've written <a href="http://roy-t.nl/index.php/2009/07/07/new-version-a-pathfinding-in-3d/">quite</a> <a href="http://roy-t.nl/index.php/2009/07/07/a-3d-update/">a</a> <a href="http://roy-t.nl/index.php/2009/06/29/3d-and-2d-a-pathfinding-in-cxna-new-and-cleaner-code/">lot</a> <a href="http://roy-t.nl/index.php/2009/06/29/upcomming-a-pathfinding-in-2d-and-3d-code-updated/">of</a> <a href="http://roy-t.nl/index.php/2009/02/24/implementing-a-path-finding-in-c-and-xna-source-code-can-we-cut-the-corner/">articles</a> <a href="http://roy-t.nl/index.php/2009/02/22/implementing-a-into-xna/">on</a> the A* algorithm.

This week I was contacted by Roman Kazakov (fourfor[AT]hotmail.com). He had a look at my previous A* articles and came up with a number of ways to speed up my latest version even more! Unfortunately he doesn't have a blog, so he asked me to publish his enhancements here, so that everyone can use them. So I'll forego the rest of this introduction and let the man speak.

<em>(Note: the following quote is the last unedited part of an e-mail of Roman Kazakov).</em>
<blockquote>Hi Roy, my name is Roman Kazakov and I am Russian guy, but live in Latin America. My Spanish is perfect, but my English is "so so", I hope you understand me. :) I am not a professional programmer. This is just my hobby from university. And as "free lancer" I work with VS 2008 C# + DevXpress + SQL Server 2008.
I would like to present you my optimization for you program AStar. Oh, by the way, my game is 2D, and this example is in 2D dimension, but this version will by work and 3D too and more faster.
Here is code of FindPathReversed:

{% highlight csharp %}
 private static BreadCrumb3 FindPathReversed5Final(bool[,] worldBlocked, Point2D start, Point2D end)
        {
            // Here we dont use the class Poin2D. It is bad idea use Class just for two int values (X Y)
            List<BreadCrumb3> openList2 = new List<BreadCrumb3>(256);
            BreadCrumb3[,] brWorld = new BreadCrumb3[worldBlocked.GetLength(0), worldBlocked.GetLength(1)];
            BreadCrumb3 node;
            int t1, t2;
            int tmpX, tmpY;
            int cost;
            int diff;
            t1 = worldBlocked.GetLength(0);
            t2 = worldBlocked.GetLength(1);
            BreadCrumb3 current = new BreadCrumb3(start.X, start.Y);
            current.cost = 0;

            BreadCrumb3 finish = new BreadCrumb3(end.X, end.Y);
            brWorld[current.X, current.Y] = current;
            openList2.Add(current);

            while (openList2.Count > 0)
            {
                //Find best item and switch it to the 'closedList'
                current = openList2[0];
                openList2.RemoveAt(0);
                int position = 0;
                cost = openList2.Count;
                do
                {
                    int left = ((position << 1) + 1);
                    int right = left + 1;
                    int minPosition;

                    if (left < cost &amp;&amp; openList2[left].cost < openList2[position].cost)
                    {
                        minPosition = left;
                    }
                    else
                    {
                        minPosition = position;
                    }

                    if (right < cost &amp;&amp; openList2[right].cost < openList2[minPosition].cost)
                    {
                        minPosition = right;
                    }

                    if (minPosition != position)
                    {
                        node = openList2[position];
                        openList2[position] = openList2[minPosition];
                        openList2[minPosition] = node;
                        position = minPosition;
                    }
                    else
                    {
                        break;
                    }

                } while (true);

                current.onClosedList = true;

                //Find neighbours
                for (int i = 0; i < 8; i++)
                {
                    tmpX = current.X + surrounding2[i, 0];
                    tmpY = current.Y + surrounding2[i, 1];
                 //   tmp = current.position + surrounding[i]; //This is is a really slow!!!
                    /*if (tmp.X >= 0 &amp;&amp; tmp.X < t1 &amp;&amp;
                tmp.Y >= 0 &amp;&amp; tmp.Y < t2 &amp;&amp;
                !worldBlocked[tmp.X, tmp.Y])*/
                    if (tmpX >= 0 &amp;&amp; tmpX < t1 &amp;&amp;
             tmpY >= 0 &amp;&amp; tmpY < t2 &amp;&amp;
             !worldBlocked[tmpX, tmpY])
                    {
                        //Check if we've already examined a neighbour, if not create a new node for it.
                        if (brWorld[tmpX, tmpY] == null)
                        {
                          //  node = new BreadCrumb3(tmpX,tmpY);
                           // brWorld[tmpX, tmpY] = node;
                            brWorld[tmpX, tmpY] = node = new BreadCrumb3(tmpX, tmpY); // This is more fast!
                        }
                        else
                        {
                            node = brWorld[tmpX, tmpY];
                        }

                        //If the node is not on the 'closedList' check it's new score, keep the best
                        if (!node.onClosedList)
                        {
                            diff = 0;
                            if (current.X != node.X)
                            {
                                diff += 1;
                            }
                            if (current.Y != node.Y)
                            {
                                diff += 1;
                            }
                            cost = current.cost + diff + ((node.X - end.X) * (node.X - end.X)) + ((node.Y - end.Y) * (node.Y - end.Y));//node.position.GetDistanceSquared(end);

                            if (cost < node.cost)
                            {
                                node.cost = cost;
                                node.next = current;
                            }

                            //If the node wasn't on the openList yet, add it
                            if (!node.onOpenList)
                            {
                                //Check to see if we're done
                               // if (node.Equals(finish)) // This is slow too!!!
                                if (node.X == finish.X &amp;&amp; node.Y == finish.Y)
                                {
                                    node.next = current;
                                    return node;
                                }
                                node.onOpenList = true;
                                openList2.Add(node);

                                int position2 = openList2.Count - 1;

                                int parentPosition = ((position2 - 1) >> 1);

                                while (position2 > 0 &amp;&amp; openList2[parentPosition].cost > openList2[position2].cost)
                                {
                                    node = openList2[position2];
                                    openList2[position2] = openList2[parentPosition];
                                    openList2[parentPosition] = node;
                                    position2 = parentPosition;
                                    parentPosition = ((position2 - 1) >> 1);
                                }

                            }
                        }
                    }
                }
            }
            return null; //no path found
        }
{% endhighlight %}

Comments:
Look in my screenshots which i made it for you. For looking performance I used ANTS Performance Profiler 5.2. This is a great "stuff"!
Also you can use your benchmark. Check the file zip attached. There is all source and information for compiled.
Comments about code:
The general "thing" in programming in C# is do not use Obj Class and etc. where really dont need to use that! The best performance is just "Value type" and List<>
Array, maybe Struct.
In my optimized code I deleting class MinHeap where T : IComparable. Why?! Because is really slow, and I dont know why. Also use class Point2D just for 2(3) types X and Y( and Z),  it was a bad idea. And many thing more. Looked my code and you understand which changes I made it. I hope this is help you. And please put this optimization on you wonderful web page http://roy-t.nl, as New Optimized Version A*.
When we made the games, we looking for more faster algorithm and code. This article will be help a many people as us.
We made the games of our dreams...</blockquote>