---
layout: post
title: Simple On demand Content Loading in XNA
date: 2008-08-27 16:54
author: admin
comments: true
categories:
---
<h4>Written in C# for XNA2.0 but might be useful with other versions.</h4>
<em>Warning: I just found out that the XNA2.0 ContentManager automatically checks if content is already loaded or not. The on-demand content loading part of this short-tut is still usefull and there isn't really overhead in finding content via this dictionary (you have to find it someway) so it is dynamic and very handy, but it doesn't get an extra plus for making content only load once.</em>

The problem.

There are a few problems with content in any game.

- Is it already loaded? <span style="text-decoration:line-through;">-Will I need it again? </span>(solved by XNA's own ContentManager)
- Where do I need to use it
- How am I going to get it to the object that needs it.

Loading content in game1.cs is easy. You just ask to contentmanager to load a certain file, for example:

{% highlight csharp %}
Texture2D texture = Content.Load<Texture2D>(@"Textures\Monkey");
{% endhighlight %}

But what if you have several classes in a hierarchy, take for example a WorldHandler that handles multiple pawns. How do you get the ContentManager to the pawns when they want a texture for visual representation. Ofcourse the anwser to this question is relatively easy, create a static class that makes the ContentManager accesible to them. However if we are going to create a seperate class, why not let that class load the content for the pawns so that we don't need any loading logic in there? That would be great, it would save us a whole lot of lines and if something about the content changes (for example what if we decide that we want a seperate folder for all the lolcats -textures we are going to put in our game?) we only have to change it in one place.

So that solves the later 2 problems. But if we have 50 warriors in our scene that all use the same texture, it would be a waste to load it 50 times, but how can we know if it was already loaded? The sollution I came up for is a dictionary like this:

{% highlight csharp %}
private static Dictionary<string, Texture2D> textures = new Dictionary<string, Texture2D>();
{% endhighlight %}

We can make a dictionary for each content type (for my sprite game I'm using textures and effects atm).

Next we need a way of loading the content into the dictionaries in a smart way. We could load all the content at startup but that would be kind of wasteful, we can do 2 things.

- Load at start of a level
- Load on demand

Or a way in between. After some thinking at this moment I went with total on demand loading. Here is a code sample of how I did it.

{% highlight csharp %}
public static Texture2D LoadTexture(string name)
{
    Texture2D texture;
    if (textures.TryGetValue(name, out texture) == true)
    {
        return texture;
    }
    else
    {
        texture = Content.Load<texture2D>(@"Textures\" + name);
        textures.Add(name, texture);
        return texture;
    }
}
{% endhighlight %}

If a texture's tag wasn't found in the dictionary yet it will be loaded and then returned to the calling object. If it was already loaded it will be returned directly.

Now we have a sollution for all 4 simple problems. We have a nice static class that will take care of all the content loading, that will never load a piece of content twice and that is accesible for all objects in your game. This class could be extended with a garbage collection mechanism if you have so much content that this is needed.

If you would like to load some content at the start of a level, dont worry you can always make a list of content that is needed (in this case a string[] with all the tags for the content) and run a foreach loop on the public static Texture2D LoadTexture(string name) method. You don't even have to supply a Texture2D object already because just calling the method will get the content loaded.

I hope this article helps all of you around there with making your content management more efficient and easier to handle, but remember I'm still new to all this to and can I no way be compared to all the XNA devs and their techdemo's so be sure to load arroound at creators.xna.com for some more info on content management. Goodluck and don't hesitate to comment with links to your tutorials/games/content!
