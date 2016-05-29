---
layout: post
title: Immediate GUIs in XNA, Setup and a button
date: 2010-03-10 10:54
author: admin
comments: true
categories:
---
<h1>Introduction</h1>
Part 2 (Scrollbars) is located <a href="http://roy-t.nl/index.php/2010/03/30/immediate-guis-in-xna-scrollbars/">here</a>

Immediate GUI’s are a pretty new concept to creating and drawing GUIs. One of the big differences between an Immediate (IM) GUI and a normal GUI is that an IMGUI is non persistent. Every frame a manager determines which screens/buttons/widgets have to be drawn and only these are drawn. There are no Button objects, Form objects or objects at all. GUI items are immediately drawn by calling a method. Most of these methods are prefixed by ‘Do’ to show the immediate nature of the button. Because of this, IMGUIs have a very low memory profile. However some objects are created every frame for drawing purposes and these might go havoc with the garbage collector if you don’t watch them properly (especially on the Xbox).

Because no objects are used, we have to use a special trick to keep track of ‘events’. To accompany this, every GUI item that can have a certain state, or can return something (for example a button, for which we want to know if it was clicked) is given a unique id (usually an integer).  The IMGUI manager holds a couple of variables to determine what item was clicked, what item the mouse was over and what item is receiving keyboard input. So the state literally consists of 3 integers, instead of a great series of objects.

Let’s create a framework for our own IMGUI in XNA.
<h2>Setup</h2>
Fire up a new XNA Windows Game project and create a new class called IMGUI. Add the following using statements:

{% highlight csharp %}
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
{% endhighlight %}

After that add the following fields:

{% highlight csharp %}
private SpriteBatch spriteBatch;
private MouseState mouse;
private int hotItem = -1;
private int activeItem = -1;
{% endhighlight %}

We need a SpriteBatch to draw our GUI. The hotItem will store the ID of the item where the mouse is over. The activeItem will store the item being clicked. We will also store the mouse state so we don’t have to get the mouse state in every GUI item.

Let’s add an update method to automatically update our mouse.

{% highlight csharp %}
public void Update(GameTime gameTime)
{
    mouse = Mouse.GetState();
}
{% endhighlight %}


Nothing fancy here, but this will keep track of the mouse.

We want our IMGUI to be selfcontained but we still need to begin and end our spriteBatch. We also need to clear the hotItem (the item where the mouse is over) before beginning. And at the end we need to check if the mouse is still pressed, if not we need to store in activeItem that no item is being clicked. To accommodate this, we will make a Begin() and End() methods, not unlike those of the normal spriteBatch.

{% highlight csharp %}
public void Begin()
{
        //Clear hot items before we begin.
        hotItem = -1;
        spriteBatch.Begin(SpriteBlendMode.AlphaBlend, SpriteSortMode.Immediate, SaveStateMode.SaveState);
}

public void End()
{
    spriteBatch.End();
    //If the user isn't clicking anything anymore, unset the active item.
    if (mouse.LeftButton == ButtonState.Released)
    {
        activeItem = -1;
    }
}
{% endhighlight %}

It might still seem a bit odd why we have to do this. But when we create our first GUI item, it will make a lot more sense. So let’s get right on it!

{% highlight csharp %}
/// <summary>
/// Draws a standard button with specified texture at the location of the rectangle
/// and returns if the button was clicked.
/// </summary>
/// <param name="id">Unique ID</param>
/// <param name="rectangle">Rectangle specifying the position of the button</param>
/// <param name="texture">Texture for the button</param>
/// <returns>True if button was clicked, otherwise False</returns>
public bool DoButton(int id, Rectangle rectangle, Texture2D texture)
{
      //Determine if we're hot, and maybe even active
      if (MouseHit(rectangle))
      {
      	hotItem = id;
            if (activeItem == -1 &amp;&amp; mouse.LeftButton == ButtonState.Pressed)
                    activeItem = id;
      }

      //Draw the button  
      Color drawColor;
      if (hotItem == id)
      {
      	if (activeItem == id)
            {
            	drawColor = Color.White;
            }
            else
            {
                 drawColor = Color.LightGray;
            }
      }
      else
      {
            drawColor = Color.Gray;
      }
            spriteBatch.Draw(texture, rectangle, drawColor);

      //If we are hot and active but the mouse is no longer down, we where clicked
      //Line updated after comment by anonymous user, I feel so silly now!
      return mouse.LeftButton == ButtonState.Released &amp;&amp; hotItem == id &amp;&amp; activeItem == id
}
//Small helper function that checks if the mouse is contained in the rectangle
//Might even be unneeded but I like not having to manually write ‘new Point…’ every time.
private bool MouseHit(Rectangle rectangle)
{
      return rectangle.Contains(new Point(mouse.X, mouse.Y))
}     
{% endhighlight %}
As you can see this is not much code for a button, because we got rid of all the state information and just bother ourselves with drawing a button, we don’t need to do much at all. Let’s look at what we have here.  First we determine if the mouse is over our button. If that is the case we are ‘hot’. We set the hotItem to our id, we also check if no item is active, and if the mouse’s left button is pressed. If so we set ourselves to be the activeItem as well.

We then start to draw our button (nothing fancy, we just change the tint we apply to our texture, and then draw the texture at the specified place).

At the end of our method we check if the mouse was released. If the mouse released and we where the hot and active item (the mouse is over our button and the mouse was pressed when over our button) then we return true to signal that we where clicked, else we return false. Because we store those nifty hot and active item integers this is all we need to determine if we were pressed.

Using the button and the IMGUI would look something like this:
{% highlight csharp %}
        IMGUI imgui = new IMGUI(spriteBatch);
        private Texture2D buttonTexture;
        public void DrawImGui()
        {
            imgui.Update(gameTime); //normally you would do this in the Update method of your screen
                                              //but for code-compactness reasons in tutorials, I'll just add it here
            imgui.Begin();

            if (imgui.DoButton(1, new Rectangle(0, 0, 64, 64), buttonTexture))
            {
                Console.Out.WriteLine("The button with id: 1 was pressed");
            }

            //More GUI items

            imgui.End();
        }
{% endhighlight %}
Easy isnt it? Just make sure that you keep your ids unique, and that you give the same button the same id every frame. Of course after a button is no longer used, you can reuse the id (make sure though that you wait at least one frame, or to check that the hotItem and activeItem where not set to the id you are going to reuses, else some false clicks might occur, but generally this shouldn’t be a problem).

If there is more animo I’ll write a following part somewhere next week. Here we are going tot tackle scrollbars and textfields, which are slightly more interesting because they require their own output to be inputted next frame.

Oh btw, one of the biggest sources on immediate GUIs is the website <a href="http://mollyrocket.com/861">mollyrocket.com IMGUI video</a> I've directly linked the one hour long video. Skip the first few minutes about "why this is a video tutorial, because he doesn't have much time etc.." and delve straight into the interesting part!

<em>Update 30-03-2010 added a call to imgui.Update(..) which I forgot and only saw in the next installment in this series.</em>