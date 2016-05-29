---
layout: post
title: Hollandia and Farseer physics
date: 2010-08-20 18:13
author: admin
comments: true
categories:
---
I don't know why I didn't break this to everyone before. But I've been the lead developer of <a href="http://www.hollandiagame.com">Hollandia</a> for a few weeks already. Click the link to find out more :).

For Hollandia I'm doing a rewrite of the engine. Since it's a platformer the characters need to be able to jump onto things. So I had a choice to either write my own mini-physics-engine for this or to look for a valid alternative that I could easily plug in into the code that I had already written. Luckily I chose the last option and came across <a href="http://farseerphysics.codeplex.com/">Farseer physics</a> and I'm completely hysterical about it. After only one day of using it I've donated $10,- to show my support. Ok the manual pages could use a bit of work, but to aid in that I'm writing a Farseer physics platformer tutorial for the <a href="http://www.sgtconker.com">Sgt. Conker XNA Article Contest</a> in which I will put everything that I've found out about Farseer so far (see it as a gentle introduction, since once you 'get it' Farseer is very easy).

Anyway some who follow my youtube channel might've seen this already, but I made a small video where you can see that I've implemented Farseer physics into the engine. Things are really starting to come together (Screen managers, Scene Graphs, Layered system etc... unfortunately you can't see any of that in the video). Especially the artwork is really nice, but since I didn't make the art work, I've turned it off for the below video. (I'm just showing the physics bodies).

<iframe width="560" height="315" src="https://www.youtube.com/embed/xrQ9dJgmYkE" frameborder="0" allowfullscreen></iframe>

And no, this is not the 4x4 all terrain infinite horsepower brutal Segway of doom ©. This is actually our main character walking around. (It doesn't look so silly if you imagine a texture of a Dutch girl moving around instead of these funny boxes :). The idea to do it this way came from <a href="http://amazingretardo.simiansoftwerks.com/2010/02/17/platformer-character-control-farseer-physics-engine/">this blog article by Bryan Dismas</a> which in turn is based on <a href="http://boxycraft.wordpress.com/2009/06/30/behind-boxboy/">this blog article by Robert Dodd</a>
