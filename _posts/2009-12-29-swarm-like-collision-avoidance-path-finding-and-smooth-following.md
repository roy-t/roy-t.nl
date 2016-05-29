---
layout: post
title: Swarm Like collision avoidance, path finding and smooth following
date: 2009-12-29 19:07
author: admin
comments: true
categories:
---
<h2>Intro</h2>
There are many different algorithms for finding paths, for avoiding collision and for smoothly following a path.  A normal approach in game would be the following:
<ul>
	<li>Use a path finding algorithm like A* to construct a path.
<ul>
	<li>(see my tutorial here: <a href="http://roy-t.nl/index.php/2009/07/07/new-version-a-pathfinding-in-3d/">http://roy-t.nl/index.php/2009/07/07/new-version-a-pathfinding-in-3d/</a> )</li>
</ul>
</li>
</ul>
<ul>
	<li>Construct an algorithm that follows the path exact enough not to collide with the predetermined ‘not empty tiles’ but loose enough so that it looks natural.
<ul>
	<li>(In XNA you could use the curve class to help: <a href="http://msdn.microsoft.com/en-us/library/microsoft.xna.framework.curve.aspx">http://msdn.microsoft.com/en-us/library/microsoft.xna.framework.curve.aspx</a> )</li>
</ul>
</li>
</ul>
<ul>
	<li>Construct an algorithm that detects objects that are on our path and calculates new routes around them.
<ul>
	<li>(Maybe some ‘look ahead’ and A* again, question: do you calculate from the
obstruction to the finish, or to the next free tile, or both?)</li>
</ul>
</li>
</ul>
Although this looks like a lot of work, most of these algorithms are freely available, how to implement them is well know, and most of these algorithms are reasonably fast.  So for a little bit of work we get a solid, well known, always working, pretty fast algorithm that in a pretty constant world finds nice paths.
<h2>Problem</h2>
For my current project I’m trying to emulate a galaxy (no small taskJ) ships move from planet to planet, but these planets are not static, they are moving in ellipses around a sun. Calculating the paths ships have to take would be troublesome, because paths close the planets would constantly change, and even more important, once we get to the finish line the planet already moved a bit further. We could update our path every <em>x-</em>amount of time, but this would give our pour CPU too much to do, and would give us a strange and jerky path.
<h2>Solution</h2>
After a bit of whining on #XNA (see the links section) someone (I wish I remembered who, so I could give credit where it’s due) suggested taking a look at swarming algorithms. (Here computer models try to simulate how swarms of birds or fish interact with each other so that they don’t collide and keep following their leaders). Although I didn’t directly see a connection, I was interested in how these models kept birds from colliding with each other. Apparently when a bird ‘senses’ that another bird comes too close it tries to move in a direction so that the minimum space between them is restored, however it also tries to keep follow his targets, the result is a new direction vector  where the evasion and the following are calculated and weighted in. When a collision is imminent the weight of the evasion grows and when there is no danger at all the weight of evasion drops.

Another way to look at it is like a set of magnets. The bird is a little iron ball, the obstacles are negatively charged and try to push the ball away, while the finish is positively charged and tries to reel the ball in. Can you see it in your head now?

After I realized this it was pretty simple to create some code that produced the following video:

<iframe width="420" height="315" src="https://www.youtube.com/embed/SxMwL5oXq2o" frameborder="0" allowfullscreen></iframe>

And now with moving obstacles:

<iframe width="420" height="315" src="https://www.youtube.com/embed/Wx5Mnbxv6hY" frameborder="0" allowfullscreen></iframe>

As you can see the path is fairly smooth, nothing is hit, and we reach our end goal. All I had to do was write these 50 lines of code (including comments and white space)

{% highlight csharp %}
 //Simple class that represents 2D objects
public class Object2D
{
    public Vector2 Position;
    public float Radius;
    public Color Color;
    public float MetersPerSecond;
}
{% endhighlight %}

{% highlight csharp %}
        //All we need is this static method, here generically called update.
        public static void Update(GameTime gameTime, Object2D ship, Object2D[] obstacles, Object2D target)
        {
            float pullDistance = Vector2.Distance(target.Position, ship.Position);

            //Only do something if we are not already there
            if (pullDistance > 1)
            {
                Vector2 pull = (target.Position - ship.Position) * (1 /  pullDistance); //the target tries to 'pull us in'
                Vector2 totalPush = Vector2.Zero;

                int contenders = 0;
                for (int i = 0; i < obstacles.Length; ++i)
                {

                    //draw a vector from the obstacle to the ship, that 'pushes the ship away'
                    Vector2 push = ship.Position - obstacles[i].Position;

                    //calculate how much we are pushed away from this obstacle, the closer, the more push
                    float distance = (Vector2.Distance(ship.Position, obstacles[i].Position) - obstacles[i].Radius) - ship.Radius ;
                    //only use push force if this object is close enough such that an effect is needed
                    if (distance < ship.Radius * 3)
                    {
                        ++contenders; //note that this object is actively pushing

                        if (distance < 0.0001f) //prevent division by zero errors and extreme pushes
                        {
                            distance = 0.0001f;
                        }
                        float weight = 1 / distance;

                        totalPush += push * weight;
                    }
                }

                pull *= Math.Max(1, 4 * contenders); //4 * contenders gives the pull enough force to pull stuff trough (tweak this setting for your game!)
                pull += totalPush;

                //Normalize the vector so that we get a vector that points in a certain direction, which we van multiply by our desired speed
                pull.Normalize();
                //Set the ships new position;
                ship.Position += (pull * ship.MetersPerSecond) * (float)gameTime.ElapsedGameTime.TotalSeconds;
            }
        }
{% endhighlight %}

As you can see that is very little and simple code for path finding, collision avoidance and smooth following. However there are some drawbacks.
<h2>Take a note</h2>
Of course there is a good reason why not everyone is using this. The path finding is not optimal (with many objects the path is not always the shortest), there is a chance to get stuck if the finish is hard to reach and this code would fail horribly in mazes. However in space there are not many objects to avoid, it’s hard to get stuck and the paths might not be optimal, but after dodging a planet or two we can go to our target in a pretty much straight line. Other scenarios where it might be interesting to try this out is in racing game AI’s (where the target is for example a dot moving across the ideal line, a meter ahead of the car) where I think this would make a very interesting algorithm. (Of course you need a braking algorithm as well, maybe adjust throttle/braking on the change in direction compared to the current speed?)  Another genre might be surfing games, strategy games with little obstacles, or other ‘stupid’ AIs, like a pet AI for cute pets like in world of warcraft.
<h2>Conclusion</h2>
We made a simple and fun algorithm with much potential, when used wisely this algorithm can make your games code a lot easier. Take note of the drawbacks though, A* is not perfect in all situations (else we would’ve used A*) and this algorithm should only be used when it is appropriate. (If you have trouble deciding this please post a comment, I’ll try to help out, however sometimes it’s just a matter of experimenting).

Oh btw, after some browsing I found some fun alikeness  with steering behavior, although that does work a bit differently the same concept lays at the basics. You can find out more about steering behavior here: <a href="http://www.red3d.com/cwr/steer/">http://www.red3d.com/cwr/steer/</a>
