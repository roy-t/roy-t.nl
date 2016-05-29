---
layout: post
title: Hollandia progress report #1
date: 2010-08-27 13:53
author: admin
comments: true
categories:
---
So, it's again time to show off a bit more Hollandia here. Today I was working on the dialogue system, very basic functionality really. A dialogue consist of a series of frames. Some frames have special actions like activating a generic trigger or by showing a couple of options, instead of just text. Of course the character talked too can respond to different suggestions (this is done by associating each of the options with an index to a next frame). 

As I said pretty basic and I still need to think out a smart way to highlight a couple of words without this interfering too much with all the draw code.

I thought it would be very cool if the dialogue screen doesn't just appears and disappears instantly so using our prepared effect system (some nice abstraction around the actual effect files) I quickly cooked up a new shader added a few lines and yay, there it is.

I'll get more into the technicalities later (make a comment if you're interested in any specific subsystem). For now I'll just show you this (very much in development) sneak peak of Hollandia that I uploaded today:

<iframe width="560" height="315" src="https://www.youtube.com/embed/1BABPJ3zdGM" frameborder="0" allowfullscreen></iframe>
