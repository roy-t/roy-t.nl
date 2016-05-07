---
layout: post
title: A Self Balancing Creature
date: 2013-06-29 11:42
author: admin
comments: true
categories:
---
I've been finishing up the last few courses for my MSc degree (next year I will fully devote to research). This means that I didn't have time to create original content for this blog. But for one of the courses (Master Level Game Physics) by Nicolas Pronost I created a self balancing creature. This was quite a cool project so I'd like to share the video with you guys.

<iframe width="560" height="315" src="https://www.youtube.com/embed/WbJ0DchkIEg" frameborder="0" allowfullscreen></iframe>

The creature keeps balance by trying to keep the center of mass above the center of support. This is done by feeding the joint errors into PID-Controllers. The gains for the PID-Controllers were found using a self-learning algorithm (based on Simulated Annealing). The simulation also contained a muscle-actuated version (not shown in the video). 

We used the Bullet Physics Engine to make this all work, however I cannot really recommend it. The documentation is horrid and we encountered a few very nasty bugs regarding joint constraints and motors.
