---
layout: post
title: Farseer physics 3.3.1 and XNA
date: 2012-08-19 14:45
author: admin
comments: true
categories:
---
![Preview]({{site.url}}/files/farseer_preview.png)

<a title="Part 2" href="http://roy-t.nl/index.php/2012/09/06/farseer-physics-3-3-1-and-xna-joints/">Part 2</a>
<a title="Part 3" href="http://roy-t.nl/index.php/2013/01/02/farseer-physics-3-3-1-and-xna-platformer-character/">Part 3</a>

A physics engine, like Farseer, is a piece of technology that allows you to simulate real-world-physics inside your game. It enables you to incorporate elements like gravity, weight, collision detection/response and much more into your game without having to rediscover and implement the laws of physics yourself.

Farseer is one of the most used physics engine for 2D games in C# and XNA, it’s tries to mimic the functionality of the popular Box2D physics engine which was built with C++ in mind. Note that you can also use Farseer if you’re not using XNA, it also has bindings for Silverlight and plain C#/.Net.

<a title="Old tutorial" href="http://roy-t.nl/index.php/2010/09/10/xna-farseer-platformer-physics-tutorial/" target="_blank">A while ago</a> I wrote a tutorial for Farseer 2.X on how to create and manipulate a character and how to setup a few platforms and a seesaw. That tutorial still remains popular but since then a lot of things have changed in the newer versions of Farseer so I think it is useful to revisit this topic.
This tutorial is the first in a series. The end result will be the same as the old platformer tutorial but we’ll get there in byte sized pieces this time and I’ll try to go a bit more in depth. Anyway, let’s get started!
<h1>Setting up Farseer and XNA</h1>
Ok so first things first, start visual studio and create a new XNA 4 Windows Game Project. You can then download the Farseer Physics Engine from <a title="Farseer homepage" href="http://farseerphysics.codeplex.com/" target="_blank">here</a>. At the time of writing the latest version was v3.3.1. Extract the archive and open the Visual Studio solution named ‘Samples XNA’. Switch to Release mode and build the project named ‘Farseer Physics XNA’. Now in the output directory (bin/x86/release) find the file ‘FarseerPhysicsXNA.dll’ and copy it to your game project. Switch back to the your own game project (you can close the other Visual Studio window). Locate the references in the solution explorer, right click it and click ‘Add Reference…’ browse to your project folder and select ‘FarseerPhysicsXNA.dll’. You can now use Farseer in your XNA project!
<h1>Setting up a simple physics simulation</h1>
Now let’s get some physics going. Open Game1.cs and add the following using statements at the top of the file.

{% highlight csharp %}
using FarseerPhysics.Dynamics;
using FarseerPhysics.Factories;
{% endhighlight %}

Also add the following member to the Game1 class.

{% highlight csharp %}
World world;
{% endhighlight %}

The World class is the most important class in Farseer. It represents the entire physics simulation. Every object that influences the simulation should be registered with your instance of the world class. Of course to make it work we have to instantiate it and tell it what kind of gravity we want. To do so add the following to your LoadContent() method.

{% highlight csharp %}
world = new World(new Vector2(0, 9.8f));
{% endhighlight %}

As you can see I've chosen a gravity of 0m*s^2 on the horizontal axis and 9.8m*s^2 on the vertical axis. Just as on earth!
The world object needs to do some work every frame to keep the simulation going so add this to your update method:

{% highlight csharp %}
world.Step((float)gameTime.ElapsedGameTime.TotalSeconds);
{% endhighlight %}

Now we still wont see anything, there aren't any objects, or bodies as they are called in Farseer, yet in our simulation. Lets remedy this situation by adding a crate. Add the following member to Game1.cs

{% highlight csharp %}
Body body;
const float unitToPixel = 100.0f;
const float pixelToUnit = 1 / unitToPixel;
{% endhighlight %}

And add the following code at end of the LoadContent method

{% highlight csharp %}
Vector2 size = new Vector2(50, 50);
body = BodyFactory.CreateRectangle(world, size.X * pixelToUnit, size.Y * pixelToUnit, 1);
body.BodyType = BodyType.Dynamic;
body.Position = new Vector2((GraphicsDevice.Viewport.Width / 2.0f) * pixelToUnit, 0);
{% endhighlight %}

Now as you can see we use a handy factory to create a rectangular body, we pass the world object so that it can be registered to it. However when passing the size of the body we first multiply this by the newly introduced constant pixelToUnit. Farseer uses Meters, Kilograms and Seconds as units while we are using pixels. So we need to convert all sizes and lengths to meters when we pass them to Farseer by multiplying them with pixelToUnit and, vice versa, when we get data back from Farseer, for example the position of a body, we need to convert back from meters to pixels. We use the same idea when setting the body's position.

We also set the body type to Dynamic. This is a normal body, you also have Static, which means that it is immovable and Kinematic which means that it has no mass and some other properties (we wont use it).

Anyway add an image for the crate to your content project, I’ve named mine ‘Crate.png’. Then add the following member to Game1.cs.

{% highlight csharp %}
Texture2D texture;
{% endhighlight %}

Now we can finally draw something to the screen. Add the following code to your Draw method

{% highlight csharp %}
spriteBatch.Begin(SpriteSortMode.Immediate, BlendState.Opaque);
Vector2 position = body.Position * unitToPixel;
Vector2 scale = new Vector2(50 / (float)texture.Width, 50 / (float)texture.Height);
spriteBatch.Draw(texture, position, null, Color.White, body.Rotation, new Vector2(texture.Width / 2.0f, texture.Height / 2.0f), scale, SpriteEffects.None, 0);
spriteBatch.End();
{% endhighlight %}

When you run the game now you should briefly see a crate fall to its doom before it disappears from the screen.
<h1>A more interesting simulation</h1>
Now of course this is a bit of a boring simulation to see something interesting happen we would need at least two objects, and preferably much more. Now we can duplicate the code a couple of times but I believe that you should never have to write the same code twice. Delete the following lines.
<ul>
	<li>The line that starts with spriteBatch.Draw(…) in your Draw method</li>
	<li>The members unitToPixel and pixelToUnit</li>
	<li>The body member and everything that involves the body in the LoadContent method.</li>
</ul>
Now create a new class called DrawablePhysicsObject. This class will be a wrapper around a body object. We will automatically convert between pixel coordinates and the coordinates used by Farseer and we will make drawing a bit easier. Since there are no new concepts introduced in this class I’ll just place the code right here:

{% highlight csharp %}
public class DrawablePhysicsObject
    {
        // Because Farseer uses 1 unit = 1 meter we need to convert
        // between pixel coordinates and physics coordinates.
        // I've chosen to use the rule that 100 pixels is one meter.
        // We have to take care to convert between these two
        // coordinate-sets wherever we mix them!

        public const float unitToPixel = 100.0f;
        public const float pixelToUnit = 1 / unitToPixel;

        public Body body;
        public Vector2 Position
        {
            get { return body.Position * unitToPixel; }
            set { body.Position = value * pixelToUnit; }
        }

        public Texture2D texture;

        private Vector2 size;
        public Vector2 Size
        {
            get { return size * unitToPixel; }
            set { size = value * pixelToUnit; }
        }

        ///The farseer simulation this object should be part of
        ///The image that will be drawn at the place of the body
        ///The size in pixels
        ///The mass in kilograms
        public DrawablePhysicsObject(World world, Texture2D texture, Vector2 size, float mass)
        {
            body = BodyFactory.CreateRectangle(world, size.X * pixelToUnit, size.Y * pixelToUnit, 1);
            body.BodyType = BodyType.Dynamic;

            this.Size = size;
            this.texture = texture;
        }

        public void Draw(SpriteBatch spriteBatch)
        {
            Vector2 scale = new Vector2(Size.X / (float)texture.Width, Size.Y / (float)texture.Height);
            spriteBatch.Draw(texture, Position, null, Color.White, body.Rotation, new Vector2(texture.Width / 2.0f, texture.Height / 2.0f), scale, SpriteEffects.None, 0);
        }
    }
}
{% endhighlight %}

Now lets set this code to work!
Create the following members in Game1.cs

{% highlight csharp %}
List&lt;DrawablePhysicsObject&gt; crateList;
DrawablePhysicsObject floor;
KeyboardState prevKeyboardState;
Random random;
{% endhighlight %}

And add this line to the end of the LoadContent method.

{% highlight csharp %}
random = new Random();

floor = new DrawablePhysicsObject(world, Content.Load(&quot;Floor&quot;), new Vector2(GraphicsDevice.Viewport.Width, 100.0f), 1000);
            floor.Position = new Vector2(GraphicsDevice.Viewport.Width / 2.0f, GraphicsDevice.Viewport.Height - 50);
floor.body.BodyType = BodyType.Static;
crateList = new List&lt;DrawablePhysicsObject&gt;();
prevKeyboardState = Keyboard.GetState();
{% endhighlight %}

You see that we create one DrawablePhysicsObject with a Static BodyType. That’s going to be our floor. We also create a list of crates and do some keyboard logic. Lets create a method to fill that list of crates. Add this method to Game1.cs

{% highlight csharp %}
private void SpawnCrate()
{
	DrawablePhysicsObject crate;
	crate = new DrawablePhysicsObject(world, Content.Load&lt;Texture2D&gt;(&quot;Crate&quot;), new Vector2(50.0f, 50.0f), 0.1f);
	crate.Position = new Vector2(random.Next(50, GraphicsDevice.Viewport.Width - 50), 1);

	crateList.Add(crate);
}
{% endhighlight %}

This method will spawn a random crate somewhere at the top of the screen. We will trigger this method by a pressing the spacebar. To do so add this to the update method before base.Update().

{% highlight csharp %}
KeyboardState keyboardState = Keyboard.GetState();
if (keyboardState.IsKeyDown(Keys.Space) &amp;&amp; !prevKeyboardState.IsKeyDown(Keys.Space))
{
    SpawnCrate();
}

prevKeyboardState = keyboardState;
{% endhighlight %}

And finally add these last few lines in between spriteBatch.Begin() and spriteBatch.End() in your draw method so that we can see what's going on.

{% highlight csharp %}
foreach (DrawablePhysicsObject crate in crateList)
{
    crate.Draw(spriteBatch);
}

floor.Draw(spriteBatch);
{% endhighlight %}

Run the simulation and start hammering on the spacebar you should see something like this:
[youtube=http://www.youtube.com/watch?v=-B9OYh2f9ng]

This concludes this tutorial. In the next tutorial we will talk about springs and joints and ways to make compound bodies so that you can have more interesting simulations!

[Farseer v3.3.1 XNA Tutorial 1]({{site.url}}/files/Farseer331-Tutorial1-Setup.zip)

<em>Thanks to Ryan Foy for pointing out some errors in the code that somehow made it onto this blog</em>
