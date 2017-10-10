---
layout: post
title: New Version A* pathfinding in 3D
date: 2009-07-07 16:01
author: admin
comments: true
categories:
---

## Update: A newer, superior, version available as Nuget package can be found [here](http://roy-t.nl/2017/08/01/A-Star-Pathfinding-nuget-package.html)

<h3>Intro and thanks.</h3>
Ok so let's quickly forget the debacle around the first release of this code sample, I wan't to delete the entire post about that one but I would'nt  have know that I made an error (until much later on) if it wasn't for some people spotting it instantly! So I would first like to thank some of my visitors who spotted the errors:

- Oscar for spotting possible performance problems.
- Ryan for suggesting possible HashSet's (altough I didn't use them in the end, see below why).

I would also like to thank posters from www.tweakers.net  who helped me get this version of A* so fast, especially (on post order):

- Phyxion & Mammon for their one line version of Equals()
- Nick The Heazk for spotting that I totally forgot the Heuristic part for scoring (doh, I swear I had it in my draft)
- pedorus & jip_86 for suggesting to use a Binary(Min)Heap
- Marcj & NotPingu for pointing out a 3D version of Pythagoras
- Soultaker for letting me think more about efficiency of containers (O(?) of add, extract and contains))
- .oisyn & pedorus for suggesting to combine a binary heap and a HashSet (altough I didn't use it in the end, see why below)
- PrisonerOfPain for suggesting to use binary flags instead of extra HashSet's (that's why I didn't use them).

<h3>Why is this version faster?</h3>
A lot was changed from the previous version, let's start with the openList, checking if an item is in the openList costs O(n) iterations and checking which item has the lowest score costs O(n) and removing an item costs O(log(n)). So I've replaced the openList with a BinaryHeap for checking the lowest score and removing/adding. These operations cost O(1), O(log(n)). That's allot faster already.

As for checking if an item is in an openList (or closedList) all I did was add a boolean flag to the BreadCrumb class (onOpenList and onClosedList).  Checking this flagg is O(1) so that really makes checks allot faster.

Also all I needed the closedList for was checking if items where already in there, so with the boolean flag I could completely remove the closedList.

Another new feature is that we immediatly return from the FindPath function when we find the finish, this also saves some operations.

I also made sure that I don't  create to much new objects but re-use them after they where first indexed (this was  also the cause for a small 'score' bug) and I've re-aranged some ifs.

For the algorithm itself I now use DistanceSquared for the (forgotten) Heuristic part of the scoring which is allot better than ManHattan distance which is slightly biased. I've also changed the cost (G) to move from the current node to the next node to incorporate these squared cost  (so instead of 1,  1.4 and 1.7 I can now use 1,2,3 for these scores. I also don't have to multiply all these numbers by 10 since 1, 2 and 3 are integers.

A final additon is the class Point3D which allows us to use only Integers instead of floats (which are slower for a cpu).

All in all this made this code about 200x faster (yes really!). But that is not completely fair since the first code was broken. If you count from after I fixed the heuristic part of the code the code is 'only' about 30x faster.
<h3>Benchmark results.</h3>
And before we get to the exciting part (the code!).  Let's first show some benchmarks.

Situation:

World: 10x10x10

Start: 0,0,0

End: 9,5,8

Nodes blocked: 300

Time:

Total (100 iterations) : 134ms

Average:  1.34ms

Lowest:   < 1ms

Highest:  17ms

Note: as you can see because we did this test 100 times there is quite allot off difference between the lowest and highest time we needed to calculate this route, that's because sometimes the cpu stops executing this program, and starts handleing an irq or doing something else, that's why it's important to always take a big number of benches to be representative. We can see from the average that this code is extremely fast.

Efficiency:

A* is an extremely efficient algorithm, consider we would've liked to brute-force this problem instead of using A*. That would've cost us 10^10^10 = 1,e+100 iterations. However with an (this) A* implementation we only needed 119 iterations (in which we checked 3094 nodes).

So, on to the code!
<h3>The code.</h3>
Well since I've divided every thing in much neater classes it's a bit of a problem adding showing off all these as code-listings as I usually do. So I will only show the most important method here, the rest of the classes, and an example  you can download at the bottom of this article or by clicking <a title="Download A* 3D" href="http://cid-64e785655f2eee72.skydrive.live.com/self.aspx/.Public/XNA3/AStar3DUpdated.zip" target="_blank">here</a>

{% highlight csharp %}
        /// <summary>
        /// Method that switfly finds the best path from start to end. Doesn't reverse outcome
        /// </summary>
        /// <returns>The end breadcrump where each .next is a step back)</returns>
        private static BreadCrumb FindPathReversed(World world, Point3D start, Point3D end)
        {
            MinHeap<breadCrumb> openList = new MinHeap<breadCrumb>(256);
            BreadCrumb[, ,] brWorld = new BreadCrumb[world.Right, world.Top, world.Back];
            BreadCrumb node;
            Point3D tmp;
            int cost;
            int diff;

            BreadCrumb current = new BreadCrumb(start);
            current.cost = 0;

            BreadCrumb finish = new BreadCrumb(end);
            brWorld[current.position.X, current.position.Y, current.position.Z] = current;
            openList.Add(current);

            while (openList.Count > 0)
            {
                //Find best item and switch it to the 'closedList'
                current = openList.ExtractFirst();
                current.onClosedList = true;

                //Find neighbours
                for (int i = 0; i < surrounding.Length; i++)
                {
                    tmp = current.position + surrounding[i];
                    if (world.PositionIsFree(tmp))
                    {
                        //Check if we've already examined a neighbour, if not create a new node for it.
                        if (brWorld[tmp.X, tmp.Y, tmp.Z] == null)
                        {
                            node = new BreadCrumb(tmp);
                            brWorld[tmp.X, tmp.Y, tmp.Z] = node;
                        }
                        else
                        {
                            node = brWorld[tmp.X, tmp.Y, tmp.Z];
                        }

                        //If the node is not on the 'closedList' check it's new score, keep the best
                        if (!node.onClosedList)
                        {
                            diff = 0;
                            if (current.position.X != node.position.X)
                            {
                                diff += 1;
                            }
                            if (current.position.Y != node.position.Y)
                            {
                                diff += 1;
                            }
                            if (current.position.Z != node.position.Z)
                            {
                                diff += 1;
                            }
                            cost = current.cost + diff + node.position.GetDistanceSquared(end);

                            if (cost < node.cost)
                            {
                                node.cost = cost;
                                node.next = current;
                            }

                            //If the node wasn't on the openList yet, add it
                            if (!node.onOpenList)
                            {
                                //Check to see if we're done
                                if (node.Equals(finish))
                                {
                                    node.next = current;
                                    return node;
                                }
                                node.onOpenList = true;
                                openList.Add(node);
                            }
                        }
                    }
                }
            }
            return null; //no path found
        }
{% endhighlight %}

(note the class also has a normal FindPath() method that switches start and end for you).
<h3>Download.</h3>
In case you missed the download link in the middle of the text, download the entire example: <a title="Download A*3D" href="http://cid-64e785655f2eee72.skydrive.live.com/self.aspx/.Public/XNA3/AStar3DUpdated.zip" target="_blank"> here </a>