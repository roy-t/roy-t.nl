---
layout: post
title: Custom XML Serialization in C#
date: 2010-10-24 10:00
author: admin
comments: true
categories:
---
As people who follow me on twitter might know, I was working on a reflection tutorial for C#/XNA. However I got a bit carried away with the XML Serialization.

So here's first an XML Serialization tutorial.

In previous tutorials/code-snippets I showed how to use the <a href="http://roy-t.nl/index.php/2010/09/28/xna-proxyclasses-to-serialize-assets-using-the-intermediateserializer/" target="_self"> intermediate serializer</a>. But for the tutorial I wanted to serialize all the XML by hand so that it would be crystal clear for anyone following the tutorial what was going on.

Quickly I coded up the following interface:
{% highlight csharp %}
    public interface ISerializable
    {
        /// <summary>
        /// Allows the object to serialize itself into the current xml node
        /// </summary>
        void Serialize(XmlDocument document, XmlNode parent);

        /// <summary>
        /// Allows the object to reconstruct itself from the current xml node
        /// </summary>
        void Deserialize(XmlDocument document, XmlNode self);
    }
{% endhighlight %}

This code should be pretty self explanatory. Remember that an XmlDocument object is also an XmlNode. So for the root object you can pass your newly constructed XmlDocument as parent node.

I quickly created 3 classes: 

-Block, a simple class with texture, position scale and tinting with the ability to draw itself.
-RotatbleBlock, child class of block, with the ability to rotate itself.
-Scene, a class containing a Block[] that draws all the blocks.

Both Scene and Block, and thus RotatableBlock, implement ISerializable.

Serializing is now easy (only relevant bits here):
In our static Serializer class we do this:
{% highlight csharp %}
        public static void Save(ISerializable root, string fileName)
        {
            //Set the culture of the saving thread to InvariantCulture so that
            //we do not get problems with different decimal seperators and the likes
            //when trying to save and load in different countries
            CultureInfo userCulture = Thread.CurrentThread.CurrentCulture;
            Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;

            XmlDocument document = new XmlDocument();
            root.Serialize(document, document);
            document.Save(fileName);

            //Restore the thread culture
            Thread.CurrentThread.CurrentCulture = userCulture;   
        }
{% endhighlight %}
Take extra care to set the culture to invariant temporarily so that we don't get different results depending on our computer's localization settings.

Scene is serialized this way:
{% highlight csharp %}
        public virtual void Serialize(XmlDocument document, XmlNode parent)
        {
            XmlElement me = document.CreateElement("ReflectionTutorialEngine.Scene");
            parent.AppendChild(me);

            XmlElement blocksElement = document.CreateElement("Blocks");
            me.AppendChild(blocksElement);

            foreach (Block b in blocks)
            {
                b.Serialize(document, blocksElement);
            }
        }
{% endhighlight %}

As you can see the object serialized just creates a new child node in the parent node. It's name is it's exact full namespace name (this will be important later).

The serialization code for Block is pretty straightforward too.
{% highlight csharp %}
        public virtual void Serialize(XmlDocument document, XmlNode parent)
        {
            XmlElement me = document.CreateElement("ReflectionTutorialEngine.Block");
            parent.AppendChild(me);

            XmlElement textureNode = document.CreateElement("Texture");
            textureNode.InnerText = texture.Tag.ToString(); //the full asset name is saved in the tag elsewhere

            XmlElement positionNode = document.CreateElement("Position");
            positionNode.InnerText = position.X + ";" + position.Y;

            XmlElement scaleNode = document.CreateElement("Scale");
            scaleNode.InnerText = scale.ToString();

            XmlElement tintingNode = document.CreateElement("Tinting");
            tintingNode.InnerText = tinting.R.ToString() + ';' + tinting.G.ToString() + ';' + tinting.B.ToString() + ';' + tinting.A.ToString();            

            me.AppendChild(textureNode);
            me.AppendChild(positionNode);
            me.AppendChild(scaleNode);
            me.AppendChild(tintingNode);          
        }

{% endhighlight %}

Where it get's interesting is in the serialization code of RotatableBlock:
{% highlight csharp %}
        public override void Serialize(XmlDocument document, XmlNode parent)
        {
            XmlElement me = document.CreateElement("ReflectionTutorialEngine.RotatableBlock");
            parent.AppendChild(me);

            XmlElement rotationElement = document.CreateElement("Rotation");
            rotationElement.InnerText = rotation.ToString();

            me.AppendChild(rotationElement);
            base.Serialize(document, me);
        }
{% endhighlight %}

As you can see we create an element for our object as normal. We also append anything we want to remember in child nodes in the XML. The interesting part is that we pass the newly created node as a root node for the Serialize method of the base class.

This approach generates the following XML:
(We saved a Scene which had an array of blocks, which contained one normal Block and one RotatableBlock using our Serializer's Save method).
{% highlight xml %}
<ReflectionTutorialEngine.Scene>
  <Blocks>
    <ReflectionTutorialEngine.Block>
      <Texture>test</Texture>
      <Position>32;32</Position>
      <Scale>1</Scale>
      <Tinting>255;255;255;255</Tinting>
    </ReflectionTutorialEngine.Block>
    <ReflectionTutorialEngine.RotatableBlock>
      <Rotation>0.7853982</Rotation>
      <ReflectionTutorialEngine.Block>
        <Texture>test</Texture>
        <Position>64;64</Position>
        <Scale>0.5</Scale>
        <Tinting>245;245;220;255</Tinting>
      </ReflectionTutorialEngine.Block>
    </ReflectionTutorialEngine.RotatableBlock>
  </Blocks>
</ReflectionTutorialEngine.Scene>
{% endhighlight %}

Recreating the Scene, Block and RotatableBlock from this XML file is fairly easy. Let's first declare a Load method in our Serializer.
{% highlight csharp %}
        public static ISerializable Load(string fileName)
        {
            CultureInfo userCulture = Thread.CurrentThread.CurrentCulture;
            Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;

            XmlDocument document = new XmlDocument();
            document.Load(fileName);

            XmlNode rootNode = document.FirstChild;
            ISerializable rootObject = GetObjectFromNode(rootNode);
            rootObject.Deserialize(document, rootNode);

            Thread.CurrentThread.CurrentCulture = userCulture;

            return rootObject;
        }

        //Small helper method that creates an instance of ISerializable from a node
        public static ISerializable GetObjectFromNode(XmlNode node)
        {
            return (ISerializable)Assembly.GetExecutingAssembly().CreateInstance(node.Name);
        }

{% endhighlight %}

As you can see we load an XMLDocument normally. And start deserializing the first child of the document (the <TutorialEngine.Scene> element in our case). I've added a little helper method (GetObjectFromNode) that actually does a lot of work. Via reflection it looks up the class stored in the name of the node. At first it will find "TutorialEngine.Scene" and it will thus create an instance of our Scene class.

After this we simply call Deserialize on our newly instantiated Scene object, giving it the XMlDocument and the node that represents the Scene itself.

Deserializing a Scene is now easy:
{% highlight csharp %}
        public virtual void Deserialize(XmlDocument document, XmlNode self)
        {                                                
            XmlElement blocksElement = self["Blocks"];

            blocks = new Block[blocksElement.ChildNodes.Count];
            for (int i = 0; i < blocks.Length; i++)
            {
                blocks[i] = (Block)Serializer.GetObjectFromNode(blocksElement.ChildNodes[i]);
                blocks[i].Deserialize(document, blocksElement.ChildNodes[i]);
            }            
        }
{% endhighlight %}
See that we keep using the Serializer.GetObjectFromNode helper method to instantiate a block. Note that a RotatableBlock can be casted to a Block (we are using polymorphism here again). But that when deserialzing the overriden method in RotatableBlock will be used.

The deserialization code for a block is easy (and a bit dull)
{% highlight csharp %}
        public virtual void Deserialize(XmlDocument document, XmlNode self)
        {            
            try
            {                                
                texture = GameServices.GetService<ContentManager>().Load<Texture2D>(self["Texture"].InnerText);
                position.X = Single.Parse(self["Position"].InnerText.Split(';')[0]);
                position.Y = Single.Parse(self["Position"].InnerText.Split(';')[1]);
                scale = Single.Parse(self["Scale"].InnerText);
                tinting.R = Byte.Parse(self["Tinting"].InnerText.Split(';')[0]);
                tinting.G = Byte.Parse(self["Tinting"].InnerText.Split(';')[1]);
                tinting.B = Byte.Parse(self["Tinting"].InnerText.Split(';')[2]);
                tinting.A = Byte.Parse(self["Tinting"].InnerText.Split(';')[3]);
            }
            catch(Exception e)
            {
                throw new XmlException("Error deserializing from XML, see inner exception for details", e);
            }
        }
{% endhighlight %}
Note that we are using the <a href="http://roy-t.nl/index.php/2010/08/25/xna-accessing-contentmanager-and-graphicsdevice-anywhere-anytime-the-gameservicecontainer/">GameServices class</a> from a previous tutorial to get easy access to the ContentManager.

Now the interesting part is again in how we handled Inheritance in RotatableBlock, so let's take a look at that code:
{% highlight csharp %}
        public override void Deserialize(XmlDocument document, XmlNode self)
        {
            try
            {                
                rotation = Single.Parse(self["Rotation"].InnerText);
                base.Deserialize(document, self["ReflectionTutorialEngine.Block"]);
            }
            catch (Exception e)
            {
                throw new XmlException("Error deserializing from XML, see inner exception for details", e);
            }            
        }
{% endhighlight %}

As you can see we first set the rotation variable with the data saved in our XMLNode. However the special thing is that we now just deserialize the rest of our RotatableBlock data by calling the base.Deserialize method on the <Block> element inside our <RotatableBlock> element. This way we don't have to duplicate any code.


As you can see this is a pretty neat and clean way of writing your own XML Serialization code. It will save you a lot of work, and a lot of errors compared to writing the same boring serialization code for each object. If you have problems understanding inheritance and polymorphism I suggest that you quickly brush up on those techniques as they are crazy powerful and a must for every developer that works with an object oriented language as C#.

Be aware that there are multiple ways to automatically serialize your data, like the previously mentioned IntermediateSerializer, or using Xna.BinaryWriter.

I believe that the above code is as Xbox360 compatible as the other ways, and the nice thing is, is that it will also work when not using XNA at all :).

Anyway, I hope you liked this. Stay tuned for the reflection tutorial for which I wrote this (yeah I did get carried away).
