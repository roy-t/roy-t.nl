---
layout: post
title: XNA, Preventing starvation/underflow when moving 2D objects slower than 1 pixel per frame
date: 2010-08-12 10:25
author: admin
comments: true
categories:
---
<em>Another title for this article could be: "XNA: Preventing starvation/underflow when updating integers with less than 1 each frame".</em>

A very naive (but usually) working method for making 2D objects move in XNA is by placing the following code in the update method.

{% highlight csharp %}
//Assume we hold position by a rectangle, since we can use that so easily in the spritebatch
myCar.Y += (int)(gravity * gameTime.ElapsedGameTime.TotalSeconds);
{% endhighlight %}

This will make your object fall down with 'gravity' pixels per second. However since rectangles use integers for positioning, and an integer can not hold information after the seperator (eg 1.5 would become 1 for an int) objects will not move when gravity is very low or updates are very frequent.

Although, I say very low, but since the updates are done 60 times per second (if you're using fixed timesteps, else it might even be a lot higher), gameTime.ElapsedGameTime.TotalSeconds will usually be 1/60th. This means that for an object to move, it should move with at least 60 pixels per second. That means, depending on your game's resolution, that would mean in full HD an object moveing from the top of the screen to the bottom of the screen has to do this in 18 seconds or less, else it won't move (1080 high divided by 60), in SD this is even worse, 8 seconds (480/60).

There are two approaches here, one way is to change the way we modify integers, this is a good approach to use inside for example an object, that modifies the position of <strong>ONE</strong> other object.

{% highlight csharp %}
//Code inside for example a gravity class
underflowFloat += gameTime.ElapsedGameTime.TotalSeconds;
myCar.Y += (int)underflowFloat;
underflowFloat -= (int)underflowFloat;
{% endhighlight %}

Although this approach is simple and efficient, there are two drawbacks to this approach:
<ul>
	<li>If you have multiple objects that modify one other object, then you will have a lot of extra floats hanging around</li>
	<li>An object will need one float per direction per object that it modifies. For a gravity class that might influence all your objects this is very inefficient.</li>
</ul>
A second approach would be to modify the object itself, a handy way to do this is properties.

{% highlight csharp %}
public int X;
private float underflowX;
public float Xfloat
{
    get { return (X + underflowX); }
    set
    {
        X = (int)value;
        underflowX = (value - (int)value);
    }
}
//Same for Y
{% endhighlight %}

This approach is way more useful since it will make sure that all your code that is using integers won't break, while you still have an accurate floating point based position if needed. Basically we store all the data after the seperator in our variable underflowX.  If the integer values get changed, we will still return the correct values as float. If the float values are changed, the integer is updated to be as precise as possible.

<strong>Remarks</strong>

After asking for some feedback in #XNA I got a few comments  that I bundled here, please read these!
There are more options, you could store the position as a Vector2 and cast the X and Y to integers only when you need to (but you shouldn't ever if you start from scratch). Then you can either cast to integers when drawing, or use the SpriteBatch's overload that uses a Vector2 for position (you will see some blending/blurring if the object is not pixel-aligned). Remember that if you cast to integers, that you will lose precision when you store the values back, this may or may not be a problem (it might not even be noticeable, but if you keep casting 5.999 to 5 every frame it might become noticeable).
