---
layout: post
title: SpaceAce, planetary gravity  and solar system simmulation
date: 2009-12-06 12:02
author: admin
comments: true
categories:
---
Well, this is the first time I'll be showing off some things of SpaceAce. 

The first video shows my simulation of our solar system, each of the eight planets is recreated accurately by putting all the data from wikipedia about these planets in the constructors and working from there. The relative sizes, speeds and rotations, inclinations and ellipsiness of the orbits around the sun are all accurate. The simulation shows 1day as 1 minute (that's why the earth rotates so hard, it has to rotate 365 times a minute, and in one minute orbit the sun).  About that sun, I don't have it visible yet :).

Oh the position between the planets is relatively correct, but it uses a different metric than planet size, else it would be almost impossible to be able to show more planet than one. (Those other planets are really far far away).

When I zoom out, and planets become smaller than their assigned icon, the planets stop being drawn and an icon appears in their place. 

I'd really like to show the constructor of my planet class with you to show the complexity:

{% highlight csharp %}
public Planet(GraphicsDevice device, SpriteBatch spriteBatch, ICamera camera, Effect effect, string technique, Texture2D texture, Model model,
            float equatorialDiamater, float orbitalRadius, float eccentricity, Vector3 focalPoint, float inclination, float rotationsPerMinute, float orbitsPerMinute, string name, Texture2D icon)
            : base(device, camera, effect, technique, icon)
{% endhighlight %}

And the video (sorry about the silly textures, their for debugging, btw best to watch it fullscreen in hq because youtube really made it hard to see).

<iframe width="420" height="315" src="https://www.youtube.com/embed/5Nbiw7mKhWo" frameborder="0" allowfullscreen></iframe>

An other video I created is to show off planetary gravity, (not implemented in the first video). It's kinda fake, but this will allow the player to construct space stations and satellites that realistically orbit the planet. Satellites keep facing the planet as they orbit it. And the further away, the slower the orbit around the planet.

Oh well I think this video speaks for its self:

<iframe width="420" height="315" src="https://www.youtube.com/embed/Wc7M9kKqtQM" frameborder="0" allowfullscreen></iframe>

If anyone is interested I will make an article to show how I've done it. However the basics are storing a relative position (vector3) and updating the rotation from 0,0,0. Then setting the actual position to planet.position + relative.position :).

Edit: after watching the videos on youtube I see there is another old game called SpaceAce, although SpaceAce for me is a working title I just wanted to tell you and make sure that my game has nothing to do with that old Atari game :).
