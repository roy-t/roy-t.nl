---
layout: post
title: Farseer physics 3.3.1 and XNA, Platformer character
date: 2013-01-02 12:03
author: admin
comments: true
categories:
---
<em>It took a while, but here I finaly present you the third and final part of the Farseer Physics 3.3.1 and XNA tutorial series!</em>

<a title="Part 1" href="http://roy-t.nl/index.php/2012/08/19/farseer-physics-3-3-1-and-xna/">Part 1 of this tutorial</a>
<a title="Part 2" href="http://roy-t.nl/index.php/2012/09/06/farseer-physics-3-3-1-and-xna-joints/">Part 2 of this tutorial</a>

In the last two tutorials I've told you how to set up Farseer with XNA and how bodies and joints work. We're going to use the techniques from these tutorials to create a character for a platformer game, think Mario or Kirby or whatever your favorite platformer character is! It's not too obvious how to create a character in Farseer. Just applying forces to a rectangular body works OK, but traveling slopes becomes really tricky in this case and the ability to stop moving instantly becomes even more hacky (usually done by pinning the character to the background with a joint). Because of that I will use a technique described by <a title="Bryan Dismas' blog" href="http://amazingretardo.simiansoftwerks.com/2010/02/17/platformer-character-control-farseer-physics-engine/">Bryan Dismas</a> and <a title="Robert Dodd's BoxyCraft page" href="http://boxycraft.wordpress.com/">Robert Dodd</a> where we create a character by combining a motorized wheel and a rectangular with an axis joint and fixed angle joint (see the previous tutorial) to create a character.

<iframe width="420" height="315" src="https://www.youtube.com/embed/iG940TYfpbA" frameborder="0" allowfullscreen></iframe>

So let's start off. First things first. I made some small changes to the DrawablePhysicsObjects class to allow circular bodies. I also found a bug in the drawing (which only happens with circular bodies). So let's add the following constructor to the DrawablePhysicsObjects class:

{% highlight csharp %}
/// <summary>
/// Creates a circular drawable physics object
/// </summary>
/// <param name="world">The farseer simulation this object should be part of</param>
/// <param name="texture">The image that will be drawn at the place of the body</param>
/// <param name="diameter"> The diameter in pixels</param>
/// <param name="mass">The mass in kilograms</param>
public DrawablePhysicsObject(World world, Texture2D texture, float diameter, float mass)
{
    size = new Vector2(diameter, diameter);
    Body = BodyFactory.CreateCircle(world, (diameter / 2.0f) * CoordinateHelper.pixelToUnit, 1);

    Body.BodyType = BodyType.Dynamic;

    this.Size = size;
    this.texture = texture;
}
{% endhighlight %}

And to fix the drawing code replace the draw method in the DrawablePhysicsObject class with this one

{% highlight csharp %}
public void Draw(SpriteBatch spriteBatch)
{            
	Rectangle destination = new Rectangle
	(
		(int)Position.X,
		(int)Position.Y,
		(int)Size.X,
		(int)Size.Y
	);

	spriteBatch.Draw(texture, destination, null, Color.White, Body.Rotation, new Vector2(texture.Width / 2.0f, texture.Height / 2.0f), SpriteEffects.None, 0);
}
{% endhighlight %}

Now we can start with the player character. Add a new class to your project called Player and add the following private fields and constructor

{% highlight csharp %}
private DrawablePhysicsObject torso;
private DrawablePhysicsObject wheel;
private RevoluteJoint axis;

public Player(World world, Texture2D torsoTexture, Texture2D wheelTexture, Vector2 size, float mass, Vector2 startPosition)
{% endhighlight %}

As you can see the player is a composition of two DrawablePhysicsObjects: a torso and a wheel as mentioned above. The constructor is fairly standard, we need a texture for the torso and wheel. We need a size for the player, a mass and a start position. Let's start implementing these details!

First, because the player is a composition, we need to calculate the sizes of the wheel and torso. We want the wheel to be just as wide as the player and to form the lower part of the body (note that this technique won't work for characters that are wider than they are high!)

{% highlight csharp %}
Vector2 torsoSize = new Vector2(size.X, size.Y - size.X / 2.0f);
float wheelSize = size.X;

// Create the torso
torso = new DrawablePhysicsObject(world, torsoTexture, torsoSize, mass / 2.0f);
torso.Position = startPosition;            
			
// Create the feet of the body
wheel = new DrawablePhysicsObject(world, wheelTexture, wheelSize, mass / 2.0f);
wheel.Position = torso.Position + new Vector2(0, torsoSize.Y / 2.0f);
{% endhighlight %}

Now we can start adding joints. We will use a Fixed Angle Joint to keep the torso straight up at all times and we use a Revolute Joint to move the wheel (feet) of the character.

{% highlight csharp %}
// Create a joint to keep the torso upright
JointFactory.CreateFixedAngleJoint(world, torso.Body);

// Connect the feet to the torso
axis = JointFactory.CreateRevoluteJoint(world, torso.Body, wheel.Body, Vector2.Zero);
axis.CollideConnected = false;
            
axis.MotorEnabled = true;
axis.MotorSpeed = 0;
axis.MotorTorque = 3;
axis.MaxMotorTorque = 10;
{% endhighlight %}

Let's also implement a draw function, which is extremely simple because we can use the drawing facilities of the two DrawablePhysicsObjects. Note that in a real game you would just draw one animated sprite over the entire player but for this tutorial this will suffice.

{% highlight csharp %}
public void Draw(SpriteBatch spriteBatch)
{
	torso.Draw(spriteBatch);
	wheel.Draw(spriteBatch);
}
{% endhighlight %}

Great! Let's go to game class, add a field for the player, load it, and make it visible!

{% highlight csharp %}
public class Game1
{
	...
	
	Player player;
	
	...
	
	protected override void LoadContent()
	{
		...
		
		player = new Player
            (
                world,
                Content.Load<Texture2D>("Player"),
                Content.Load<Texture2D>("Wheel"),
                new Vector2(20, 75),
                100,
                new Vector2(430, 0)
            );     		
	}
	
	...
	
	protected override void Draw(GameTime gameTime)
	{
		...
		
		player.Draw(spriteBatch);
		
		...
	}
}
{% endhighlight %}

Ok. Run your game. If everything went well you will see your player character fall from the sky, land, and be pushed away by one of the paddles we added in the previous tutorial. You can see a body and a wheel and that they are connected. You will notice that the character keeps sliding a lot before it stands still when it's pushed by the paddle. Based on your game this might be desirable or undesirable. You can control this behavior using the friction of the wheel. I don't want the character to slide so much so I've added a bit of friction to the wheel by adding the following line in the constructor of player.

{% highlight csharp %}
wheel.Body.Friction = 0.8f;
{% endhighlight %}

Higher values will stop the character from sliding at all.

Now to make the scene more interesting we will have to be able to control the player. Let's first add movement and then later add jumping as well. Create the following enum:
{% highlight csharp %}
public enum Movement
{
    Left,
    Right,
    Stop
}
{% endhighlight %}

Add the following code to your player class:
{% highlight csharp %}
float speed = 3.0f;

...

public void Move(Movement movement)
{
	switch(movement)
	{
		case Movement.Left:
			axis.MotorSpeed = -MathHelper.TwoPi * speed;
			break;

		case Movement.Right:
			axis.MotorSpeed = MathHelper.TwoPi * speed;
			break;

		case Movement.Stop:                    
			axis.MotorSpeed = 0;
			break;
	}
}
{% endhighlight %}


Then go to the update function of your game class and add the following lines:
{% highlight csharp %}
if(keyboardState.IsKeyDown(Keys.Left))
{
	player.Move(Movement.Left);
}
else if(keyboardState.IsKeyDown(Keys.Right))
{
	player.Move(Movement.Right);
}
else
{
	player.Move(Movement.Stop);
}
{% endhighlight %}

Run the game again. You should now be able to control your character. Remember that you can still press space to make some boxes fall from the sky, push them around a bit. Depending on how high you've set the friction of your wheel body and (max) torque of your revolute joint you might be able to push none, one or quite a few more!

Now the finishing touch is obviously jumping, and with just adding a bit of force we can get there. Add the following fields and method to the Player class:

{% highlight csharp %}
private DateTime previousJump = DateTime.Now;   // time at which we previously jumped
private const float jumpInterval = 1.0f;        // in seconds
private Vector2 jumpForce = new Vector2(0, -1); // applied force when jumping

public void Jump()
{
	if ((DateTime.Now - previousJump).TotalSeconds >= jumpInterval)
	{
		torso.Body.ApplyLinearImpulse(ref jumpForce);
		previousJump = DateTime.Now;
	}
}
{% endhighlight %}

As you can see we do some management to keep track of when we last jumped. The jumping itself is done by adding impulse to the torso body and since the wheel is connected to the torso body we don't need to do anything else. Simple right? Let's hook this jump function up to the left control key by adding these last few lines to the Update function of your game class.

{% highlight csharp %}
if (keyboardState.IsKeyDown(Keys.LeftControl) &amp;&amp; !prevKeyboardState.IsKeyDown(Keys.LeftControl))
{
    player.Jump();
}
{% endhighlight %}

Et voila! We have a controllable player character which you can use in your very own platform game! Fire up your game and if you followed my instructions this is what you should end up with:
[youtube=http://www.youtube.com/watch?v=iG940TYfpbA[/]

You can download the complete source code (includes everything from the previous two tutorials and this one) <a href="http://roy-t.nl/files/Farseer331XNA.zip" title="Source Code">here</a>

<em>Fun trivia</em>
<ul>
<li>I published (and wrote most) of this tutorial on my birthday, 25 now, yay!</li>
<li>In 2010 I got 2nd place on SgtConker's Absolutely Fine tutorial contest writhing the Farseer 2.x version of this series</li>
</ul>


 
