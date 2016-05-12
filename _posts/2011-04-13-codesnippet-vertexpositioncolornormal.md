---
layout: post
title: Codesnippet, VertexPositionColorNormal
date: 2011-04-13 12:46
author: admin
comments: true
categories:
---
For some prototyping I needed a struct like VertexPositionColor, but I also needed a normal, after a minute of Googling I found out that nobody wrote a small (XNA4) compatible snippet) for this. So here I give you my own snippet. (Which also is a handy reference to see how the 'new' IVertexType interface in XNA4 works (yes I still think of XNA4 as new).

Anyway the source code:
{% highlight csharp %}
    public struct VertexPositionColorNormal : IVertexType
    {
        public Vector3 Position;
        public Color Color;
        public Vector3 Normal;

        public VertexPositionColorNormal(Vector3 position, Color color, Vector3 normal)
        {
            this.Position = position;
            this.Color = color;
            this.Normal = normal;                        
        }
        
        public static readonly VertexElement[] VertexElements =
        {
            new VertexElement(0, VertexElementFormat.Vector3, VertexElementUsage.Position, 0),
            new VertexElement(sizeof(float)*3, VertexElementFormat.Color, VertexElementUsage.Color, 0),
            new VertexElement(sizeof(float)*4, VertexElementFormat.Vector3, VertexElementUsage.Normal, 0) 
        };
        public static readonly VertexDeclaration vertexDeclaration = new VertexDeclaration(VertexElements);
        
        public VertexDeclaration VertexDeclaration
        {
           get { return vertexDeclaration; }
        }
    }
{% endhighlight %}
