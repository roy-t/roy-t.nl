---
layout: post
title: CodeSnippet, Quad renderer
date: 2011-05-07 09:42
author: admin
comments: true
categories:
---
This quad renderer was already part of my conversion of Catalin Zima's Deferred Rendering for XNA tutorial, but because I plan to use it in a tutorial I'm going to write later today here is a handy snippet for drawing a quad with texture coordinates in XNA. (You could use the SpriteBatch class for this, but as you all know the SB class tends to mess up your render state if you do not define all states correctly).

Anyway here's the class:
{% highlight csharp %}
    public class QuadRenderer
    {
        public QuadRenderer(GraphicsDevice device)
        {
            this.device = device;
            vertices = new VertexPositionTexture[]
            {
                new VertexPositionTexture(new Vector3(0,0,0),new Vector2(1,1)),
                new VertexPositionTexture(new Vector3(0,0,0),new Vector2(0,1)),
                new VertexPositionTexture(new Vector3(0,0,0),new Vector2(0,0)),
                new VertexPositionTexture(new Vector3(0,0,0),new Vector2(1,0))
            };

            indexBuffer = new short[] { 0, 1, 2, 2, 3, 0 };
        }

        public void Draw(Vector2 v1, Vector2 v2)
        {
            vertices[0].Position.X = v2.X;
            vertices[0].Position.Y = v1.Y;

            vertices[1].Position.X = v1.X;
            vertices[1].Position.Y = v1.Y;

            vertices[2].Position.X = v1.X;
            vertices[2].Position.Y = v2.Y;

            vertices[3].Position.X = v2.X;
            vertices[3].Position.Y = v2.Y;

            device.DrawUserIndexedPrimitives&lt;VertexPositionTexture&gt;(PrimitiveType.TriangleList, vertices, 0, 4, indexBuffer, 0, 2);
        }

        public void DrawFullScreenQuad()
        {
            Draw(Vector2.One * -1, Vector2.One);
        }

        #region FieldsAndProperties
        private VertexPositionTexture[] vertices = null;
        private short[] indexBuffer = null;
        private GraphicsDevice device;
        #endregion
    }
{% endhighlight %}
