---
layout: post
title: Getting the Left, Forward and Back vectors from a View Matrix directly
date: 2010-03-04 17:51
author: admin
comments: true
categories:
---
I was wondering why I had to calculate the forward and left vectors for my arcball camera manually and why these results differed from ViewMatrix.Left and the likes.  So I asked <a title="Thread" href="http://forums.xna.com/forums/t/48799.aspx" target="_blank">at the xna forums</a> and almost immediately Jeremy Walsh pointed me in the right direction.  He pointed out to me that view matrices are <a title="Wiki" href="http://en.wikipedia.org/wiki/Transpose" target="_blank">transposed</a> from a normal matrix (meaning that the rows and columns are switched). To get the right vectors from the view matrix, we have to transpose it again to get the original matrix, however this generates a lot of garbage, so he told me that its better to construct the vectors from the matrix cells themselves.

And so I did, and I've packaged them into my neat PositionalMath class (which I might release some day). Here are the methods to get all the information you want from those view matrices, without having to calculate the forward (lookat - position) and crossing that.

{% highlight csharp %}
// Because a ViewMatrix is an inverse transposed matrix, viewMatrix.Left is not the real left
        // These methods returns the real .Left, .Right, .Up, .Down, .Forward, .Backward
        // See: http://forums.xna.com/forums/t/48799.aspx        
        
        public static Vector3 ViewMatrixLeft(Matrix viewMatrix)
        {
            return -ViewMatrixRight(viewMatrix);
        }

        public static Vector3 ViewMatrixRight(Matrix viewMatrix)
        {
            return new Vector3(viewMatrix.M11, viewMatrix.M21, viewMatrix.M31);
        }
        
        public static Vector3 ViewMatrixUp(Matrix viewMatrix)
        {
            return new Vector3(viewMatrix.M12, viewMatrix.M22, viewMatrix.M33);
        }

        public static Vector3 ViewMatrixDown(Matrix viewMatrix)
        {
            return -ViewMatrixUp(viewMatrix);
        }

        public static Vector3 ViewMatrixForward(Matrix viewMatrix)
        {
            return -ViewMatrixBackward(viewMatrix);
        }

        public static Vector3 ViewMatrixBackward(Matrix viewMatrix)
        {
            return new Vector3(viewMatrix.M13, viewMatrix.M23, viewMatrix.M33);
        }
{% endhighlight %}
