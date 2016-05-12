---
layout: post
title: Using JavaScript as a script engine in XNA/C#
date: 2012-06-05 19:39
author: admin
comments: true
categories:
---
A scripting engine is a useful component in any game-engine. It allows you to execute modified code (aka scripts) in real time while your game is running. This gives you immediate feedback, allows for easy debugging of scripts and gives you true rapid prototyping abilities.

Scripting engines are also easier to work with than a full blown programming language, an error in a script is easy to recover from and because the scripts aren’t compiled it’s easy for the script interpreter to give helpful debug information. Even better: you don’t have to compile the script and the game keeps running so immediately after you fix the bug in your script you can see the result.

Script engines gives opportunities for ‘other’-programmers (gameplay, leveldesign, animator, etc..), they might not wish to delve into the intricacies of the programming language and frameworks you’re using for the game engine but they will be more than willing to write some script to modify the behavior of that new enemy.

So, why write a scripting engine for XNA? Well after reading the article ‘<a title="Embracing Dynamism" href="http://www.altdevblogaday.com/2012/05/05/embracing-dynamism/" target="_blank">Embracing Dynamism</a>’  by Niklas Frykholm on #AltDevBlogADay I got interested again in scripting engines. Shortly after that I heard that someone wrote a full JavaScript interpreter for C# called <a title="Jint on codeplex" href="http://jint.codeplex.com/" target="_blank">JINT</a>  , well 1 + 1 = 2 so I started working on integrating JINT into XNA and see if I could set up an external IDE in WPF that, while the game is running, could load, modify and execute script code. After a few tries I finally succeeded and I’m pretty proud of the result.

<iframe width="560" height="315" src="https://www.youtube.com/embed/JzOVCNw8nQA" frameborder="0" allowfullscreen></iframe>

All the wrapping and magic happens in the JintXNA project. The code, as it is now, works fine on Windows but Windows Phone and Xbox 360 support isn’t there yet out of the box since JINT is targeted at the full .NET 4.0 framework. However there is a <a title="Jint CF port" href="https://hg.codeplex.com/forks/hounshell/compactframework" target="_blank">port of JINT</a> which targets the .NET Compact Framework  which should run on WP7 and the 360, I haven’t tried this yet though.

You can download the full source code of JintXNA <a title="JintXNA source code" href=" http://roy-t.nl/files/XNAScripting.zip" target="_blank">here</a> this package includes the JintXNA project, the IDE and a sample project and script as seen in the video.
