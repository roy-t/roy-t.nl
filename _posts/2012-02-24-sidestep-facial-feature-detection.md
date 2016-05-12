---
layout: post
title: Sidestep, Facial Feature Detection
date: 2012-02-24 12:54
author: admin
comments: true
categories:
---
Recently I've been quite busy working on my thesis (which is coming around nicely)  and with a lot of work related things. For a temporary exhibition we where working on implementing Mimbo, this cute robot we found  on <a title="Mimbo" href="http://mashable.com/2012/01/04/mimbo-robot/" target="_blank">mashable</a> there was only one problem. It requires an iPhone, which is quite hard to secure in an unsupervised exhibition, and all our systems are Windows based. So we came up with using an iPad (larger, so more fun to look at) and an iMac to control it, but this would require securing a blu-tooth connection, and all sorts of problems. So the last few days I've been working on re-creating Mimbo in my spare time. This proved to be easier than I thought, using the excellent <a title="Luxand API" href="http://luxand.com/" target="_blank">Luxand API</a> which I just happened to come across. So after a bit of C# code to interpret the data, and some WPF to make a cool robot face this is the end result:

<iframe width="560" height="315" src="https://www.youtube.com/embed/5OydaEaMrPY" frameborder="0" allowfullscreen></iframe>

Man it's fun to step out of your comfort zone sometimes and do something completely different. Well anyway, I might release all the code as open-source, under the MIT license or something, but since I can technically use this at work I'll have to sort out what happens with it there first.

I hope the next time between posts isn't so long and that I can finally create some time to post the tutorials ideas I've been having, but it's crazy busy lately.

Sincerely,

Roy

Edit: after popular request: here is the<a title="Source code" href="http://roy-t.nl/files/MimboWPF.zip" target="_blank"> source code</a>
