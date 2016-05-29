---
layout: post
title: Code snippets from Visual Studio to Wordpress.com
date: 2008-09-30 19:56
author: admin
comments: true
categories:
---
To keep everything nice and tidy I was hoping for some feature in Wordpress to allow me to instert C# (or any style) code nicely. But wordpress wont even remember the indenting makeing everything gibberish unless I manually add spaces instead of tabs.

Many people use the <pre> tag but after some whining at the forums there is an actual function that does syntax highlighting and everything if you spell it exactly right.

Fill in your code between: {sourcecode language='cshar'} ... {/sourcecode} but replace the '{' and  '}' by the standard brackets '[' and ']'. This works really nicely like here below.

{% highlight csharp %}
public partial class Form1 : Form
{
        public Form1()
        {
            InitializeComponent();
        }

        private void buttonGenerate_Click(object sender, EventArgs e)
        {
            string source = richTextSource.Text;
            textOutput.Text = source;
        }
}
{% endhighlight %}

The FAQ item can be found <a href="http://faq.wordpress.com/2007/09/03/how-do-i-post-source-code">here</a>
Special thanks to user <a href="http://the-sacred-path.com">'a sacred path'</a>
