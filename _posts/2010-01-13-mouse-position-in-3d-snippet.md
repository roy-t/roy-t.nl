---
layout: post
title: Mouse position in 3D, snippet
date: 2010-01-13 19:10
author: admin
comments: true
categories: 
---
And another snippet for today. I wanted to test some more path finding code so I wanted to move a collidable object with the mouse. To do so you have to 'unproject' your mouse coordinates (x and y) to a position in 3D space (x,y,z). I first tried to use the unproject method directly. But after reading the <a href="http://msdn.microsoft.com/en-us/library/bb203905.aspx" target="_blank">msdn article</a> I figured out that the z-values can be either 0 (near clip plane) or something else (far clip plane). So this didn't give me good results if I just plugged in the z level I wanted.

After reading on about rays and intersect methods, user ConkerJo on #XNA pointed out that intersect returns a point of intersection instead of true or false. So with that knowledge, and a little help from him and msdn, I quickly produced the following code.

This code will convert your mouse position to a point laying on the ground plane.

Remember that the definition of your ground plane is a normal. So if you want the x-z space to be the floor (eg. y is up), assign it like this:

{% highlight csharp %}
private Plane GroundPlane = new Plane(0, 1, 0, 0);  //creates a plane on the x-z axises.
{% endhighlight %}

And if you use another common approach, where z is up and the ground is on x-y use this:

{% highlight csharp %}
private Plane GroundPlane = new Plane(0, 0, 1, 0); //creates a plane on the x-y axises.
{% endhighlight %}

And now here's the actual snippet:

{% highlight csharp %}
/// <summary>
        /// Calculates where the mouse would be if it would float around at the level of the ground plane.
        /// Based on http://msdn.microsoft.com/en-us/library/bb203905.aspx and user conkerjo who
        /// pointed out that Ray.Intereset returns a vector3 and not a boolean (true/false) *DOH*.
        /// </summary>
        /// <returns></returns>
        private Vector3 CalculateMouse3DPosition()
        {
            int mouseX = Mouse.GetState().X;
            int mouseY = Mouse.GetState().Y;

            Vector3 nearsource = new Vector3((float)mouseX, (float)mouseY, 0f);
            Vector3 farsource = new Vector3((float)mouseX, (float)mouseY, 1f);

            Matrix world = Matrix.CreateTranslation(0, 0, 0);

            Vector3 nearPoint = device.Viewport.Unproject(nearsource,
                camera.ProjectionMatrix, camera.ViewMatrix , Matrix.Identity);

            Vector3 farPoint = device.Viewport.Unproject(farsource,
                camera.ProjectionMatrix, camera.ViewMatrix, Matrix.Identity);

            Vector3 direction = farPoint - nearPoint;
            direction.Normalize();
            Ray pickRay = new Ray(nearPoint, direction);
            float? position = pickRay.Intersects(GroundPlane);

            if (position.HasValue)
            {
                return pickRay.Position + pickRay.Direction * position.Value;
            }
            else
            {
                return target.Position;
            }
        }
{% endhighlight %}
