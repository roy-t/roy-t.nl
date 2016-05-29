---
layout: post
title: Review, NDepend
date: 2009-08-17 12:23
author: admin
comments: true
categories:
---
Just at the start of the summer vaction I got an e-mail from Patrick Smacchia, Lead Developer of <a title="NDepend Website" href="http://www.ndepend.com/" target="_blank">NDepend</a> he asked me if I was interested to write something about their wonderfull code analysis tool, as said called NDepend.

I warned Patrick that I've never used code analysis tools and that's also the reason why this blogpost about NDepend is kind of brief, I can't really compare it to anything else. However this is a good opertunity to check out where code analysis tools are at.

After receiving a product key I downloaded NDepend from their website which almost screams "MVP" and all the companies that use NDepend. (Altough I had never heard of it before Patrick e-mailed me). Big companies like Microsoft and NASA.  The website features quite a big documentation/tutorial section which are also accesible from within NDepend.

<strong>Reporting</strong>

After downloading and following the really easy video tutorials (I so love video tutorials) the power of NDepend becomes clear, it's not just a simple tool that just shows a nice graph with dependencies. It's much more, NDepend generates a very nice statistical analysis of your .Net code. When the statistic analysis is complete you can print a nice report and know all sorts of things about your code. Starting with a quick overview of your code.

<em>Excerpt from my racing game:</em>
<blockquote><em> </em> Number of IL instructions: 1796
Number of lines of code: 294
Number of lines of comment: 152
Percentage comment: 34
Number of assemblies: 1
Number of classes: 6
Number of types: 8
Number of abstract classes: 0
Number of interfaces: 2
Number of value types: 0
Number of exception classes: 0
Number of attribute classes: 0
Number of delegate classes: 0
Number of enumerations classes: 0
Number of generic type definitions: 0
Number of generic method definitions: 0
Percentage of public types: 75%
Percentage of public methods: 85,15%
Percentage of classes with at least one public field: 12,5%

Number of IL instructions: 1796
Number of lines of code: 294
Number of lines of comment: 152
Percentage comment: 34
Number of assemblies: 1
Number of classes: 6
Number of types: 8
Number of abstract classes: 0
Number of interfaces: 2
Number of value types: 0
Number of exception classes: 0
Number of attribute classes: 0
Number of delegate classes: 0
Number of enumerations classes: 0
Number of generic type definitions: 0
Number of generic method definitions: 0
Percentage of public types: 75%
Percentage of public methods: 85,15%
Percentage of classes with at least one public field: 12,5%</blockquote>
As you can see allot of information, and this is just the top of the report.

Another very usefull metric in the report is the "Assemblies Abstractness vs. Instability" graph. Which will warn you if you are soldering everything togheter,  or a just creating useless interfaces instead of working code.  (Luckily my race game was pretty centered).

There are ofcourse allot more things, I could list them all here but it might be easier to just check this http://www.ndepend.com/Features.aspx#Metrics page.

<strong>Main screen</strong>

Let's get to the main screen (sorry about the big image but there is just so much information there)
<img title="NDepend" src="http://i27.tinypic.com/168xtld.jpg" alt="Main screen" width="1080" height="654" />Main screen

The main screen visually lists all parts of your project, hovering over the 'code' blocks on the right gives you more information on the bottom left of the screen. You can change the way the code blocks on the right are ordered.  Right now they are ordered by method with lines of codes, but you can select a variety of views.  But you can also view them as types with #IL generated instructions or other things.

<strong>Code Query Language</strong>

NDepend also has a feature called 'code query language'. This CQL allows you to select things that are of special interest to you, possibly all the methods that have more than 50 lines of code. You this in a simple SQL'esque language "SELECT METHODS  WHERE NbLinesOfCode >  50". There are also allot of predefined CQL statements that you can use ranging from method sizes to code quality and design.

<strong>Conclusion</strong>

As you can see NDepend has a lot to offer, and really I've just skimmed the surface here. I see a lot of potential for NDepend in large project groups especially for software engineers who need to worry about the code quality and robustness but who can't check each and every line of code themselves. For small projects and 'one man teams' like me this tool is plainly overkill but fun to play with. Unfortunately I don't have knowledge of other code analysis tools so I can't really compare it to anything else. However NDepend feels solid and gives allot of usefull (documented) information.

Oh and did I mention it is a stand alone app aswell as an integration with Visual Studio? This pleases me very much as a VS Express user.

<em>Special Thanks to Patrick Smacchia for providing a NDepend licence.</em>
