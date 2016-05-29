---
layout: post
title: Immediate GUIs in XNA, Scrollbars
date: 2010-03-30 20:57
author: admin
comments: true
categories:
---
<h1>Introduction</h1>
Last time we've made a small IMGUI framework, now we are going to add scrollbars, or sliders if you prefer that term, to our set of controls. Sliders work a bit differently than buttons because you'll have to know last time's value to show the slider correctly, and we can't store state for each slider in the IMGUI itself (or well, that goes against the idea).

<h2>Setup</h2>
Load last time's project (see part one <a href="http://roy-t.nl/index.php/2010/03/10/immediate-guis-in-xna-setup-and-a-button/">here</a>)

Without further ado (and because I'm pretty busy lately) I'll put the source code for a scrollbar here, and afterwards explain the method.
{% highlight csharp %}
        /// <summary>
        /// Draws a vertical or horizontal scrollbar at the specified position. If the grip was moved, returns the new value, else returns the inserted value
        /// </summary>        
        public float DoScrollbar(int id, Rectangle rectangle, Texture2D scrollbarTexture, Texture2D gripTexture, float max, float value, bool horizontal)
        {
            //No matter the input, value should be at least 0 and at most max
            value = Math.Min(Math.Max(value, 0), max);

            //Determine if we're hot, and maybe even active
            if (MouseHit(rectangle)) //See previous part's code for this method
            {
                hotItem = id;
                if (activeItem == -1 &amp;&amp; mouse.LeftButton == ButtonState.Pressed)
                    activeItem = id;
            }

            //Draw the scrollbar
            spriteBatch.Draw(scrollbarTexture, rectangle, ActiveColor);

            //Position the grip relative on the scrollbar and make sure the grip stays inside the scrollbar
            //Note that the grip's width if vertical/height if horizontal is the scrollbar's smallest dimension.
            int gripPosition; Rectangle grip;
            if (horizontal)
            {
                gripPosition = rectangle.Left + (int)((rectangle.Width - rectangle.Height) * (value / max));
                grip = new Rectangle(gripPosition, rectangle.Top, rectangle.Height, rectangle.Height);
            }
            else
            {
                gripPosition = rectangle.Bottom - rectangle.Width - (int)((rectangle.Height - rectangle.Width) * (value / max));
                grip = new Rectangle(rectangle.Left, gripPosition, rectangle.Width, rectangle.Width);
            }
            
            //Draw the grip in the correct color
            if (activeItem == id || hotItem == id)
            {
                spriteBatch.Draw(gripTexture, grip, ActiveColor);
            }
            else
            {
                spriteBatch.Draw(gripTexture, grip, InActiveColor);
            }

            //If we're active, calculate the new value and do some bookkeeping to make sure the mouse and grip are in sync            
            if (activeItem == id)
            {
                if (horizontal)
                {
                    //Because the grip's position is defined in the top left corner
                    //we need to shrink the movable domain slightly so our grip doesnt
                    //draw outside the scrollbar, while still getting a full range.                    
                    float mouseRelative = mouse.X - (rectangle.X + grip.Width / 2);
                    mouseRelative = Math.Min(mouseRelative, rectangle.Width - grip.Width);
                    mouseRelative = Math.Max(0, mouseRelative);
                    //We then calculate the relative mouse offset 0 if the mouse is at
                    //the left end or more to the left. 1 if the mouse is at the right end
                    //or more to the right. We then multiply this by max to get our new value.
                    value = (mouseRelative / (rectangle.Width - grip.Width)) * max;
                }
                else
                {
                    //same as horizontal bit in the end we inverse value,
                    //because we want the bottom to be 0 instead of the top
                    //while in y coordinates the top is 0.
                    float mouseRelative = mouse.Y - (rectangle.Y + grip.Height / 2);
                    mouseRelative = Math.Min(mouseRelative, rectangle.Height - grip.Height);
                    mouseRelative = Math.Max(0, mouseRelative);
                    value = max - (mouseRelative / (rectangle.Height - grip.Height)) * max;
                }                                               
            }
            return value;
        }
{% endhighlight %}

As you can see a scrollbar is a bit more complicated than a button, but the code is still pretty short. I think the code is pretty self explanatory, but I'll add a short overview of the steps here:

- A scrollbar is called with as parameter a float called value, this value indicates where on the scrollbar the grip should be (between 0 and max)
-  First trim value so that it is between 0 and max
- Determine if the mouse is over the scrollbar, and if so check if the mouse is being pressed
- Draw our scrollbar background in the right color
- Now calculate where our grip should be positioned and how big it should be (two code paths, one for horizontal and one for vertical)
- If we have a scrollbar background of  60x500 we want our grip to be of size 60x60, and vice-versa
- If we have a value near max we want the grip to be more to the right (or top) and vice-versa
- Now draw our grip
- Last, if the scrollbar is the activeItem, we need to check if the mouse (and thus the grip) was moved (again two code paths).
- This is slightly tricky so take a good look at that code.
- In the end, return the value (which was changed if the grip was moved).

Well, now we have that nice scrollbar, how are we going to use it?

{% highlight csharp %}
        private IMGUI imgui; //construct/load these fields somewhere
        private Texture2D backgroundTexture;
        private Texture2D gripTexture;
        private float scrollvalue = 0;

        public void DrawImGui()
        {
            imgui.Update(gameTime); //normally you would do this in the Update method of your screen
                                              //but for code-compactness reasons in tutorials, I'll just add it here

            imgui.Begin();

            scrollvalue = imgui.DoScrollbar(1, new Rectangle(10, 10, 300, 50), backgroundTexture, gripTexture, 100, scrollvalue, true);
            //More GUI items

            imgui.End();
        }
{% endhighlight %}

(Note the call to imgui.Update(...) which I might have forgotten last time (oops).

Easy isn't it? A simmilar technique is used for text input, but you'd need an extra state to keep track of the item the mouse last clicked that receives keyboard input, I'll go over that next time. I would add a nice picture here to show you how this all looks, but tbh my programmer art is so ugly that I'm scared it would frighten you away from using this technique.