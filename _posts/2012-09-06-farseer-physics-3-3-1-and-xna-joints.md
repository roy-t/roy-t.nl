---
layout: post
title: Farseer physics 3.3.1 and XNA, Joints
date: 2012-09-06 10:11
author: admin
comments: true
categories:
---
In the previous tutorial, which you can find <a title="Previous tutorial" href="http://roy-t.nl/index.php/2012/08/19/farseer-physics-3-3-1-and-xna/">here</a>, we created static and dynamic bodies. In this second tutorial we are going to take a look at joints. Simply said a joint is used to make a connection between two bodies or a body and the background.  The place where a joint is attached is called the anchor. Usually a joint has two anchors. One placed on the first body and one placed on a second body or on the world itself. Farseer uses the following naming convention for this. If a joint is ‘fixed’ it provides a joint between a body and the background/world. If a joint is not fixed it is used to connect two separate bodies to each other. So a RevoluteJoint connects two bodies and a FixedRevoluteJoint connects a body and the background/world.
<h1>Overview of joints</h1>
There are quite a few types of joints in Farseer:
<h2>Standard joints</h2>
<h3>Angle joints</h3>
Keeps a body at a fixed angle from another body or the world.
<h3>Distance joints</h3>
Keeps a body at a fixed distance from another body or from an anchor in the world.
<h3>Friction joints</h3>
Applies translational and angular friction to a body.
<h3>Line joints</h3>
A line joint can best be seen as a spring. It linearly connects to bodies (or a body and the background) together and tries to keep them at a fixed distance. It does not limit relative rotations but it does limit translation over one axis. They can be a bit tricky to place since the mass of the bodies themselves already affects the distance between the two bodies so setting the ‘at rest’ state is a bit of trial and error. Note that Line Joints are a new addition to Farseer and are not available in Box2D.
<h3>Prismatic joints</h3>
Enforces that two bodies can only slide in a linear motion (one degree of freedom) with respect to each other. See <a href="http://en.wikipedia.org/wiki/Prismatic_joint">http://en.wikipedia.org/wiki/Prismatic_joint</a>
<h3>Revolute joints</h3>
The most standard joints. Allows a body to rotate around an implicit axis coming from the screen (Z-Axis). Can be used to connect a body to the background or to another body.  Can be motorized.
<h3>Slider joints</h3>
A sort of prismatic joint that doesn’t limit the bodies to just linear motion. Best described as a combination of a revolute joint and a prismatic joint. Note that Slider Joints are also not available in Box2D.
<h3>Weld joints</h3>
Connects two bodies together disallowing any form of relative rotation/translation.
<h2>More complex joints</h2>
<h3>Gear joints</h3>
Connects two revolute joints or a revolute joint and a prismatic joint. Simulates that they are connected by gears so if the body on the first revolute joint rotates the body on the second revolute joint will rotate in the opposite direction.
<h3>Pulley joints</h3>
Used to create a pulley system. (Two bodies both connected to a rope that runs over a pulley). Can be used to create sophisticated elevators.

If you would like to know more about the joints Farseer offers you can check the Box2D documentation <a title="Box2D documentation" href="http://box2d.org/manual.html#_Toc258082974">here</a> (Farseer is a C# implementation of Box2D, and although it’s growing slowly to become more than that the best place for documentation is still the Box2D website).
<h1>Refactoring last week's example</h1>
After doing some coding I found that I need access to the world-to-screen and screen-to-world conversion methods for the joints and they are currently members of the DrawablePhysicsObject class. So before we start creating or own joints we must first refactor last week's example.

Create this new helper class:

{% highlight csharp %}
    public static class CoordinateHelper
    {
        // Because Farseer uses 1 unit = 1 meter we need to convert
        // between pixel coordinates and physics coordinates.
        // I've chosen to use the rule that 100 pixels is one meter.
        // We have to take care to convert between these two
        // coordinate-sets wherever we mix them!

        public const float unitToPixel = 100.0f;
        public const float pixelToUnit = 1 / unitToPixel;

        public static Vector2 ToScreen(Vector2 worldCoordinates)
        {
            return worldCoordinates * unitToPixel;
        }

        public static Vector2 ToWorld(Vector2 screenCoordinates)
        {
            return screenCoordinates * pixelToUnit;
        }
    }
{% endhighlight %}

And then update the DrawablePhysicsObject class to use the helper class.
<h1>Some setup</h1>
Last week we added a list to store all the boxes that we randomly spawn. This week we’re going to create ‘paddles’ connected by joints. To store the paddles we're going to need another list. So open Game1.cs and add the following field:

{% highlight csharp %}
List paddles;
{% endhighlight %}

Then add the following three lines to draw the paddles:

{% highlight csharp %}
foreach (DrawablePhysicsObject paddle in paddles)
{
    paddle.Draw(spriteBatch);
}
{% endhighlight %}

I've also added another image to the content project called ‘Paddle.png’.
<h1>Adding some bodies and joints</h1>
Now to demonstrate how to use joints I'm going to create three paddles. The first paddle will just be a simple body connected with revolute joint to the background. This means that it can spin freely. The second paddle is almost the same, but it will be motorized, adding some interaction to the scene. Finally we combine two line joints to create a trampoline. After this you should have a basic understanding on how joints work in Farseer.
<h2>A simple revolute joint</h2>
Add the end of the LoadContent method initialize the list we use to store the paddles. Then after that add the following code to create the first paddle:

{% highlight csharp %}
// Create a simple paddle which center is anchored
// in the background. It can rotate freely
DrawablePhysicsObject simplePaddle = new DrawablePhysicsObject
(
    world,
    Content.Load(&quot;Paddle&quot;),
    new Vector2(128, 16),
    10
);

JointFactory.CreateFixedRevoluteJoint
(
    world,
    simplePaddle.body,
    CoordinateHelper.ToWorld(new Vector2(0, 0)),
    CoordinateHelper.ToWorld(new Vector2(GraphicsDevice.Viewport.Width / 2.0f - 150,
                                         GraphicsDevice.Viewport.Height - 300))
);

paddles.Add(simplePaddle);
{% endhighlight %}

As you can see we first create a simple body, just as in the previous tutorial. The body is 128 pixels wide and 16 pixels high (note that the constructor of the DrawablePhysicsObject converts these units to world coordinates). It has a mass of 10KG. Note that we don't have to set the position of the body. This is implicitly done by the joint, which fixes the body on the background at the anchor positions.

Next we create the joint. The first argument is our physics simulation and is used to register our joint to the simulation. We then pass the body this joint should be applied to. Since this is a Fixed joint we don't need to pass a second body. The joint will connect the first body to the world. We then have to give some coordinates. We pass the center of the body (0,0) and somewhere in our world. Note that we use the conversion methods to go from pixel to world coordinates. Also don't forget the last line, where we add the paddle to our list of paddles, else it won't show up for drawing.

You can now run the simulation. Again press space to drop crate, you will see that we've create a small paddle that rotates freely when hit by a crate.
<h2>A motorized joint</h2>
The motorized joint is very similar:

{% highlight csharp %}
// Creates a motorized paddle which left side is anchored in the background
// it will rotate slowly but the motor is not set soo strong that
// it can push everything away.
DrawablePhysicsObject motorPaddle = new DrawablePhysicsObject
(
    world,
    Content.Load(&quot;Paddle&quot;),
    new Vector2(128, 16),
    10
);

var j = JointFactory.CreateFixedRevoluteJoint
(
    world,
    motorPaddle.body,
    CoordinateHelper.ToWorld(new Vector2(-48, 0)),
    CoordinateHelper.ToWorld(new Vector2(GraphicsDevice.Viewport.Width / 2.0f,
                                         GraphicsDevice.Viewport.Height - 280))
);

// rotate 1/4 of a circle per second
j.MotorSpeed = MathHelper.PiOver2;
// have little torque (power) so it can push away a few blocks
j.MotorTorque = 3;
j.MotorEnabled = true;
j.MaxMotorTorque = 10;

paddles.Add(motorPaddle);
{% endhighlight %}

Again we create a body and a Fixed Revolute Joint. But this time we store the joint created by the joint factory in the variable j so that we can access the properties of the joint. The revolute joint exposes a few interesting properties. The most interesting one is to motorize it. We've set a motor speed of pi/2. This means that the every second the joint will rotate the connected body by pi/2 radians, or a 1/4 of a circle. We also have to set the torque to give the motor enough power to rotate the body and to keep rotating even when a few crates are blocking the paddle. We also set the max motor torque and enable the motor. Again in the last line we add the paddle to our list of paddles so that it will be drawn.
<h2>A trampoline</h2>
To create a trampoline we will use two Line Joints (a sort of springs) to connect a paddle to the ground. This way we create some sort of trampoline. Add the following code:

{% highlight csharp %}
// Use two line joints (a sort of springs) to create a trampoline
DrawablePhysicsObject trampolinePaddle = new DrawablePhysicsObject
(
    world,
    Content.Load(&quot;Paddle&quot;),
    new Vector2(128, 16),
    10
);

trampolinePaddle.Position = new Vector2(600, floor.Position.Y - 175);

var l = JointFactory.CreateLineJoint
(
    floor.body,
    trampolinePaddle.body,
    CoordinateHelper.ToWorld(trampolinePaddle.Position - new Vector2(64, 0)),
    Vector2.UnitY
);

l.CollideConnected = true;
l.Frequency = 2.0f;
l.DampingRatio = 0.05f;

var r = JointFactory.CreateLineJoint
(
    floor.body,
    trampolinePaddle.body,
    CoordinateHelper.ToWorld(trampolinePaddle.Position + new Vector2(64, 0)),
    Vector2.UnitY
);

r.CollideConnected = true;
r.Frequency = 2.0f;
r.DampingRatio = 0.05f;

world.AddJoint(l);
world.AddJoint(r);

paddles.Add(trampolinePaddle);
{% endhighlight %}

Now the creation of the body should look really familiar now. Note that this time we do have to set the position of the body. The line joint will try to keep the paddle and the ground at roughly the same position as the starting position from each other so it needs some initial position.

We create two joints, they are exactly the same, except for where they connect to the paddle. One is anchored on the left side of the paddle and one on the right side. So I will only explain the first line joint.

We start by passing the body of the first body the line joint should connect to, the floor. We then pass the body of the paddle. We tell the line joint to connect to the paddle at the given relative coordinates.  We then give the axis of freedom the line joint should offer. In our case the Y-Axis.

We also set some properties, CollideConnected  means that the paddle and the floor can collide with each other. Handy now but for a wheel inside a car you might want to keep this at the default, turned off, state. We also set a nice frequency and damping ratio. Finally we add the joints to the world. Don’t forget this step! Only Fixed joints are automatically added to the world. We also add the paddle to our list of paddles to draw.

You can now run the simulation again. Try to drop a few crates on the trampoline, you will see that it behaves quite nicely.

<iframe width="420" height="315" src="https://www.youtube.com/embed/gtNHBvBUyJg" frameborder="0" allowfullscreen></iframe>
<h1>Conclusion</h1>
Joints in Farseer are fairly easy to use and can add a dynamicity lot to your scene. Try playing around with all different joints to get a feel from them. All joints in Farseer are created using a way similar as shown in this tutorial. In the next tutorial we will add a controllable character and create a small platformer.
