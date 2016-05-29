---
layout: post
title: XNA XML ContentImporter
date: 2010-08-07 12:09
author: admin
comments: true
categories:
---
Quite often you'd like to use XML files in your games. You can use the standard XNA XML Importer for this, however then you'd need to write specific class that serialize to and from the special XNA XML documents that have a <XNAContent> tree.

If you're trying to build your levels in XML or if you're trying to set a high volume of settings this might not be the easiest way. Easier would be to just parse a hand written XML document yourself. Luckily this is very easy to accomplish.

The naive way of doing this is by just writing a custom content importer that would look similar to this:

{% highlight csharp %}
[ContentImporter(".xml", DisplayName = "XML Content Importer", DefaultProcessor = "None")]  //TImport was defined as System.Xml.XmlDocument a bit higher
    public class XMLContentImporter : ContentImporter<TImport>
    {
        public override TImport Import(string filename, ContentImporterContext context)
        {
            XmlDocument document = new XmlDocument();
            try
            {
                document.Load(filename);
            }
            catch (Exception e)
            {
                //Write error logger here or update the exception with more information
                throw e;
            }
            return document;
        }
    }
{% endhighlight %}

(Don't forget to add a reference to your content pipeline project to the<strong> Content project inside your game's project</strong>)

Now the following code doesn't work and will throw an error similar to this:

{% highlight csharp %}
Error   1   Building content threw InvalidOperationException: Cyclic reference found while serializing System.Xml.XmlDocument. You may be missing a ContentSerializerAttribute.SharedResource flag.
{% endhighlight %}

Now I'm not going to be holier than the pope, I actually made the same error as you can blatantly see <a href="http://forums.xna.com/forums/p/58481/358409.aspx">here</a>.

Unfortunately the error message is very unhelpful in this case, and might even throw you off completely since the error is not visual from the actual content file itself. Any XML file while give you this error.

Luckily user Saw was sitting around in #XNA on Efnet (IRC). He told me that the error comes from the fact that I've written no ContentWriter (and ContentReader). This means that reflection is used to serialize the XML document.

An XmlDocument has a lot of XMLNodes. An XmlNode has the member variable parent, which is an XmlNode, which has the member variable 'parent', which.... Well you get the idea. Probably the recursion error comes from there.

He then showed me how two write a very simple reader and writer. If we extend our content importer with these two extra classes this problem is easily solved.
{% highlight csharp %}
[ContentTypeWriter()]
    public class CustomXmlWriter : ContentTypeWriter<XmlDocument>
    {
        protected override void Write(ContentWriter output, XmlDocument value)
        {
            value.Save(output.BaseStream);
        }

        public override string GetRuntimeReader(TargetPlatform targetPlatform)
        {
            return typeof(CustomXmlReader).AssemblyQualifiedName;
        }
    }
    
    public class CustomXmlReader : ContentTypeReader<XmlDocument>
    {
        protected override XmlDocument Read(ContentReader input, XmlDocument existingInstance)
        {
            if (existingInstance == null)
            {
                existingInstance = new XmlDocument();
            }
            existingInstance.Load(input.BaseStream);
            return existingInstance;
        }
    }
{% endhighlight %}

The custom content writer just uses the XMLDocuments built in Save function which is aware of these cycles and deals with them properly, the other method is overload to tell XNA which content reader to use for this type. The content reader again uses the simple built in Load function, nothing special here.

However now compile your project again, see the errors are gone :).

Let's add a simple XML file to your content project, I've named it hello.xml.
{% highlight xml %}
<?xml version="1.0" encoding="utf-8" ?>
<MyTag>Hello World!</MyTag>
{% endhighlight %}

Click the file in the solution explorer and set the build action to 'Compile' and the Content Processor to 'XML Content Importer' (you can change the name by changing the DisplayName attribute). Note: you might need to recompile before you can do this.

Load and display it like this:
{% highlight csharp %}
XmlDocument xml = Content.Load<XmlDocument>(@"Tests\xmltest");
XmlNode node = xml.SelectSingleNode("//MyTag");
Console.Out.WriteLine(node.InnerText);
{% endhighlight %}

The expression "//MyTag" is an XPATH expression to query the XML document, you can learn more about that <a href="http://www.w3schools.com/xpath/xpath_syntax.asp">here</a>.

I hope you have a lot of fun with this code, and that it makes life a little bit easier for you, either by handling XML files for you, or by being a small source on how to write custom ContentTypeWriters and readers.

 
