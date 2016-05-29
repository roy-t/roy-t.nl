---
layout: post
title: XNA 3.0 and Winforms, the easy way
date: 2008-10-09 16:48
author: admin
comments: true
categories:
---
There are many tutorials on XNA and Winforms, however none of them seem very easy, but after reading a post from 'madman' on Ziggyware.com and fiddleing around it seems very easy  to do, easier than the creators example.

In short we adjust the game1.cs to draw to a picturebox instead of drawing to the window that is created for it. The code is very easy to understand (as it's only 10lines of code) and performs superb, without the use of ugly timers and all that stuff.

Firstoff create a new XNA3.0 Windows  project in  Visual Studio 2008 (Express) (this code will probably work just fine in XNA2.0/Visual Studio 2005 (Express))

Add a Form to it the usual way, and drag a picturebox to it. Call the picturebox pctSurface.

Then go into the code view of your  form and write the following code:

{% highlight csharp %}

public IntPtr getDrawSurface()
{
    return pctSurface.Handle;
}
{% endhighlight %}

This code will give us the Handle to the picturebox which we will later use to draw our game to.

Now open up game1.cs add the variable 'private IntPtr drawSurface;' and change the constructor to look like this:

{% highlight csharp %}

public Game1(IntPtr drawSurface)
{
              graphics = new GraphicsDeviceManager(this);
              Content.RootDirectory = "Content";
              this.drawSurface = drawSurface;
              graphics.PreparingDeviceSettings +=
              new EventHandler<preparingDeviceSettingsEventArgs>(graphics_PreparingDeviceSettings);
              System.Windows.Forms.Control.FromHandle((this.Window.Handle)).VisibleChanged +=
              new EventHandler(Game1_VisibleChanged);            
}
{% endhighlight %}

And add these 2 eventhandlers

{% highlight csharp %}
        /// <summary>
        /// Event capturing the construction of a draw surface and makes sure this gets redirected to
        /// a predesignated drawsurface marked by pointer drawSurface
        /// </summary>
        ///
<param name="sender"></param>
        ///
<param name="e"></param>
        void graphics_PreparingDeviceSettings(object sender, PreparingDeviceSettingsEventArgs e)
        {
                e.GraphicsDeviceInformation.PresentationParameters.DeviceWindowHandle =
                drawSurface;
        }

        /// <summary>
        /// Occurs when the original gamewindows' visibility changes and makes sure it stays invisible
        /// </summary>
        ///
<param name="sender"></param>
        ///
<param name="e"></param>
        private void Game1_VisibleChanged(object sender, EventArgs e)
        {
                if (System.Windows.Forms.Control.FromHandle((this.Window.Handle)).Visible == true)
                    System.Windows.Forms.Control.FromHandle((this.Window.Handle)).Visible = false;
        }
 {% endhighlight %}

Now we are almost done, change program.cs' static void main to this:

{% highlight csharp %}

static void Main(string[] args)
{
              formMain form = new formMain();
              form.Show();
              Game1 game = new Game1(form.getDrawSurface());
              game.Run();            
}

{% endhighlight %}

Now to make sure your application really exits when closing your form add the code

Application.Exit();

to your button and windowclosed eventhandler!

Thats it, run the code and you'll see your wonderfull Form with a blue square where you've located your pictureBox! Now you can change your game1.cs as normal, use your contentmanager and content project as normal, and use windowsforms for an excellent  userinterface for your editor.

Note: this will not work on the Xbox360 since it doesn't have WinForms
Note2: you might see a window for a few ms when starting your app. This is the old window that used to be drawn to, unfortunately I haven't figured out how to get rid of it completely, but the eventhandler will hide it the first time it shows.

The sourcode can be downloaded here: <a href="http://rapidshare.com/files/152392592/XNA3Editor.zip.html">sourcecode.</a>
in the example I also created a spriteBatch and spriteFont to show you can really draw!

<img src="http://i37.tinypic.com/20g1maq.jpg" alt="XNA3.0 In Winforms in action, notice the pictureBox borderstyle3d effect" width="400" />
(notice the picturebox' borderstyle settings affecting the rendering, here it adds a nice 3D border)

Update: since I couldn't believe the XNA devs being less smart than I am, I asked around at the <a href="http://forums.xna.com/forums/">creators forums</a> and landed in a discussion between, Shawn Hargreaves, theZman and myself. According to Shawn this sollution might work properly but its not tested and he says that there might be border cases where this sollution will stop working (drawsurface may invalidate etc..) The creators example is guaranteed to work 100%, however in my eyes it still a bit bulky and hard to understand, that code may be necessairy to let everything work properly, even on strange hardware configurations etc. Also the input logic in the update loop might not work properly. I myself haven't encountered any of these problems yet but it's a thing to keep in mind.

My advice: creating an editor just for yourself, or anyway just for devs, you can safely use this sample. If your going to make code that has to ship to other users, you might want to reconsider.

You could also look at this topic: <a href="http://forums.xna.com/forums/p/18445/96520.aspx#96520">Shawn Hargreaves in the Creators forums</a>