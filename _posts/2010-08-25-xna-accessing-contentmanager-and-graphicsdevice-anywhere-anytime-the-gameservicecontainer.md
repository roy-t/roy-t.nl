---
layout: post
title: XNA, Accessing ContentManager and GraphicsDevice anywhere anytime, the GameServiceContainer
date: 2010-08-25 17:33
author: admin
comments: true
categories:
---
<em>A quick code snippet that I produced today and wanted to share.</em>

Often you find yourself looking for a good path/way to give a certain component access to the ContentManager. Usually you will just plug it in the construct. However sometimes the object creating the new object doesn't have access to this component as well. Things start to become a bit more complicated then, of course you can add it to both constructors, but things often start to clutter.

Objects like the ContentManager and the GraphicsDevice are often needed on the craziest of places in a game's code. They can easily be shared as they are usually in a valid state throughout the runtime of your program and usually you don't need more than one. For these kind of objects it would be easy to create a static class so that anyone can access them.

A common technique is to create a static List<object> in which you can throw anything in. But this doesn't enforce that there is only instance of a given type in the container (why add two GraphicsDevices?) and makes it hard to get the right component from.

Luckily XNA has the GameServiceContainer class which allows you to store elements like this:
{% highlight csharp %}
container = GameServicesContainer();
container.AddService(typeof(GraphicsDevice), device);
{% endhighlight %}

There's also GetService and RemoveService. However this casting can make a lot of lines way longer than they need to be. Also we need to make the container static and protected access to it, so let's create a nice little class like this:

{% highlight csharp %}
public static class GameServices
    {
        private static GameServiceContainer container; 
        public static GameServiceContainer Instance {
            get
            {
                if (container == null)
                {                    
                    container = new GameServiceContainer();
                }
                return container;
            }
        }

        public static T GetService<T>()
        {
            return (T)Instance.GetService(typeof(T));
        }

        public static void AddService<T>(T service)
        {
            Instance.AddService(typeof(T), service);
        }

        public static void RemoveService<T>()
        {
            Instance.RemoveService(typeof(T));
        }                
    }
{% endhighlight %}

In the Initialize method of Gam1.cs put this:
{% highlight csharp %}
protected override void Initialize()
        {            
            base.Initialize();
            GameServices.AddService<GraphicsDevice>(GraphicsDevice);
            GameServices.AddService<ContentManager>(Content);
        }
{% endhighlight %}

Remember that GameServices is static so you can read, add and remove from anywhere in your code like this:
{% highlight csharp %}
GameServices.AddService<GraphicsDevice>(device);
myDevice = GameServices.GetService<GraphicsDevice>();
GameServices.RemoveService<GraphicsDevice>()
{% endhighlight %}

Quite a nifty way of doing this, if I may say that myself (A). However do note (as NullSoldi did on Efnet #xna) that this will increase coupling between your components as some class will start to depend on the non standard class we've just created while this otherwise wasn't needed. However I personally think that the benefits greatly outweigh the small penalty on coupling.

Have fun with this snippet, let me know if you're using it or found it useful for your own GameServices-like class.


