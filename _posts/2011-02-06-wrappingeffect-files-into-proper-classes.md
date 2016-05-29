---
layout: post
title: Wrapping effect files into proper classes
date: 2011-02-06 15:52
author: admin
comments: true
categories:
---
In XNA shaders are processed into Effect objects by the content pipeline. These effect objects are not really 'first class citizens' because, contrarily to most C# classes, these classes have a lot of loosely-typed features. To remedy this I'm going to show you how I wrap these effect objects into their own wrapper, when we see the differences I'll explain the pros and cons of my approach.

For this tutorial we're going to use a part of a shader I use for deferred rendering:
{% highlight HLSL %}
float4x4 World : WORLD;
float specularIntensity = 0.8f;
texture Texture : TEXTURE;
{% endhighlight %}

As said, the content processor wraps this nicely into an Effect object. Now if we'd like to draw something with this effect it would probably be done something like this:

{% highlight csharp %}
Effect effect = Content.Load<Effect>("myEffect");
//Draw:
effect.Parameters.GetParameterBySemantic("World") = Matrix.Identity;
effect.Parameters["specularIntensity"] = 0.5f;
effect.Parameters["texture"] = 56;
effect.Techniques["technique1"].Passes[0].Apply();
{% endhighlight %}

Given the rest of the code is correct this will compile nicely, however during runtime we will receive an exception. Because we set the effect parameter "texture" to 56, which is not a proper texture value. Due to the loose typing this error could not be detected by the compiler, so it could sneak up on us. Also it's a bit hard to remember all the parameters an effect has, because we cant see that without opening the .fx file, I'd argue that the effect class is not a proper class as we know other classes to be in C#. And it can't be, because it has to be compatible with so many different shaders. Therefor I push forward my approach.

For the above shader I would write the following class:
{% highlight csharp %}
    public class MyEffect
    {
        public MyEffect(Effect effect)
        {
            worldMatrix = effect.Parameters.GetParameterBySemantic("World");                        
            texture = effect.Parameters.GetParameterBySemantic("Texture");  
            specularIntensity = effect.Parameters["specularIntensity"];
            
            technique1 = effect.Techniques["Technique1"];            
        }

        public void Apply()
        {
            technique1.passes[0].Apply();
        }

        #region FieldsAndProperties        
        private EffectTechnique technique1;        

        private EffectParameter worldMatrix;
        public Matrix WorldMatrix { set { worldMatrix.SetValue(value); } }
        
        private EffectParameter texture;
        public Texture2D Texture { set { texture.SetValue(value); } }
        
        private EffectParameter specularIntensity;
        public Texture2D SpecularIntensity { set { specularIntensity.SetValue(value); } }
        #endregion
        
    }
{% endhighlight %}

Using this code drawing an object would look like this:
{% highlight csharp %}
MyEffect effect = new MyEffect(Content.Load<Effect>("myEffect"));
//Draw:
effect.World = Matrix.Identity;
effect.SpecularIntensity = 0.5f;
effect.Texture = 56;
effect.Apply();
{% endhighlight %}

In my opinion this is a lot more readable and we now get an error while compiling that 56 does not match the type "Texture" also the new wrapper is more of an interface for the effect file. If we change one of the variable names in the effect file, we now only have to make a change at one place in our code base, even if we change the type of a parameter using some logic in the property we might still not have to change all the code. And if we really have to we will get a lot of helpful compiler warnings. We can now also find all references to a specific parameter. However the big downside is that Effect works for all effects (well you still have to remember the parameters and techniques which differ per shader), and this approach requires you to write a class per shader.

Anyway this is my approach, I'd love to know how other people handle this problem, and if you have any comments.

**Update 7-2-2011**

After discussing alternative approaches (thanks Flashed!) I would like to give everybody a tip to try an extend this system. How about have a content pipeline project that automatically matches an effect file with an effect wrapper? You can use metadata in the .fx files todo this!

