---
layout: post
title: XNA, Proxyclasses to 'Serialize' assets using the IntermediateSerializer
date: 2010-09-28 19:50
author: admin
comments: true
categories: 
---
As some of you've might seen, I've been breaking my head over the following problem for the past few days:

How do I serialize the class like the following without creating a special 'intermediate' struct for each and ever classes

{% highlight csharp %}
public class MyData
    {
        [ContentSerializer(SharedResource = true)]
        public Texture2D myTexture;
        public int myInt;
        public string[] myLines;
        public MyData() { } // for deserialization
        public MyData(int myInt, Texture2DProxy myTexture, string[] myLines)
        {
            this.myInt = myInt;
            this.myTexture = myTexture;
            this.myLines = myLines;
        }
    }
{% endhighlight %}

Even though I've marked the Texture2D as a shared resource, I still can't serialize it using the IntermediateSerializer because a Texture2D always has a reference to a GraphicsDevice object, and the IS can't serialize that.

Fortunately some helpfull people in #XNA on Efnet (ecosky and flashed, that's you guys!) told me about proxyclasses, first I was confused and thought they wanted me to write a proxy for every class in my project, but soon they helped me understand that I should write a proxy class for Texture2D. I just had to write a proxy class that can be serialized and that will store the path to texture, so that it can reload itself when deserialized. 

I quickly came up with the following class, very simple but it will suffice for now:
{% highlight csharp %}
public class Texture2DProxy
    {
        public Texture2DProxy(string path)
        {
            LoadTexture(path);
        }

        public Texture2DProxy() { }

        private void LoadTexture(string path)
        {
            ContentManager content = GameServices.GetService<ContentManager>(); //My own class, see my code snippet, you can also reference a static CM here.
            texture = content.Load<Texture2D>(path);
            this.path = path;
        }

        [ContentSerializerIgnore()] //make this is not serialized
        private Texture2D texture;

        [ContentSerializerIgnore()]
        public Texture2D Texture
        {
            get
            {
                if (texture == null)
                {
                    LoadTexture(path);
                }
                return texture;
            }
        }

        [ContentSerializer()] //make sure this is, even-though it's a private field.
        private string path;
    }
{% endhighlight %}


Now we just need to replace Texture2D with Texture2DProxy everywhere, and update some code. In the end we can now serialize and deserialize the MyData class like this:
{% highlight csharp %}
public void DoSerialize(MyData myData)
        {            
            XmlWriterSettings settings = new XmlWriterSettings();
            settings.Indent = true;
            using (XmlWriter writer = XmlWriter.Create("example.xml", settings))
            {
                IntermediateSerializer.Serialize(writer, myData, null);
            }
        }

        public MyData DoLoad()
        {
            MyData tmp;
            XmlReaderSettings settings = new XmlReaderSettings();            
            using(XmlReader reader = XmlReader.Create("example.xml", settings))
            {
                tmp = IntermediateSerializer.Deserialize<MyData>(reader, null);
            }

            return tmp;
        }
{% endhighlight %}

Btw, serializing like this will generate the following XML file:
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<XnaContent>
  <Asset Type="XNASerialization.MyData">
    <myTexture>#Resource1</myTexture>
    <myInt>42</myInt>
    <myLines>
      <Item>Two households, both alike in dignity,</Item>
      <Item>In fair Verona, where we lay our scene,</Item>
      <Item>From ancient grudge break to new mutiny,</Item>
      <Item>Where civil blood makes civil hands unclean.</Item>
    </myLines>
  </Asset>
  <Resources>
    <Resource ID="#Resource1" Type="XNASerialization.Texture2DProxy">
      <path>latern</path>
    </Resource>
  </Resources>
</XnaContent>
{% endhighlight %}

With this problem out of the way, I can now finally start working on a way to save and restore levels in Hollandia. Oh btw, you can ofcourse do the same trick with SoundEffects and Models or anything else for that matter.

