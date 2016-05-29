---
layout: post
title: Collision avoidance, path finding and smooth following, 3D snippet (C#/XNA)
date: 2010-01-13 18:59
author: admin
comments: true
categories:
---
Today I converted my <em>"Swarm Like collision avoidance, path finding and smooth following"</em>- project (what a mouth full) to work with 3D coordinates, if you understood the code, you would know this wasn't much of a problem. Anyway I did it for you today :). (original article <a href="http://roy-t.nl/index.php/2009/12/29/swarm-like-collision-avoidance-path-finding-and-smooth-following/">here</a>).

{% highlight csharp %}
public static void Attract(GameTime gameTime, Object3D ship, Object3D[] obstacles, Object3D target)
        {
            float pullDistance = Vector3.Distance(target.Position, ship.Position);

            //Only do something if we are not already there
            if (pullDistance > ((ship.Radius + target.Radius) * 1.5f))
            {
                Vector3 pull = (target.Position - ship.Position) * (1 / pullDistance); //the target tries to 'pull us in'
                Vector3 totalPush = Vector3.Zero;

                int contenders = 0;
                for (int i = 0; i < obstacles.Length; ++i)
                {

                    //draw a vector from the obstacle to the ship, that 'pushes the ship away'
                    Vector3 push = ship.Position - obstacles[i].Position;

                    //calculate how much we are pushed away from this obstacle, the closer, the more push
                    float distance = (Vector3.Distance(ship.Position, obstacles[i].Position) - obstacles[i].Radius) - ship.Radius;
                    //only use push force if this object is close enough such that an effect is needed
                    if (distance < ship.Radius * 3)
                    {
                        ++contenders; //count that this object is actively pushing

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
                ship.Position += (pull * ship.Speed) * (float)gameTime.ElapsedGameTime.TotalSeconds;
            }
        }
{% endhighlight %}
