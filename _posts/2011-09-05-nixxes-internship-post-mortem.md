---
layout: post
title: Nixxes internship post-mortem
date: 2011-09-05 08:56
author: admin
comments: true
categories:
---
I tried to do a weekly update during my internship at Nixxes, but I never got around to finish a single post. However since Post-Mortems are hip these days I decided to write a simple post-mortem about my internship.

Let's start with the beginning. In the first week my mentor at Nixxes was still on vacation so a co-worker set me up with a new computer (a shiny i7) and helped me set-up the development environment. I was handed a few drafts from another co-worker who a few years back wrote a proposal for the tool I was to build. So I tried to arm myself with knowledge and put my education to the task by writing things like inception documents and prototype proposals. Although this was a bit formal for the team (they only do a light scrum + two person commits) it helped me get a good overview of what I had to do. I also played a lot with their technology (trying to give good old Lara Croft green hair in a test-level of TR:Legend).

The tool I was to build had a simple enough goal and had to do with their automatic shader generation. I had to make a tool that gave artists insight in how different settings on materials would create different shader configurations. It was not to give technical insight inside the shaders (you wouldn't want to bore artists with that) . But to let them reduce the number of actual shaders by simplifying material.

In the next few weeks I started searching for existing tech, testing and prototyping. I needed tools to show large complex graphs with a lot of cross-nodes. So I started searching for layout algorithms (In the end I combined two layout techniques and wrote code myself, but it's always good to check if you're not reinventing the wheel, and it gave me some great insights).

I also had to familiarize myself with WPF, which I really enjoyed (the learning curve for WPF is much shorter than for WinForms and the performance and 'nice-ity'  of WPF greatly outclasses WinForms).

After a few prototypes we decided on a work-flow for the program and refined the core questions the program had to solve.  It's really helpful to write those down because a goal might be too abstract/far away so these core questions help you refine your way to do the goal and give you some work flow hints. (It's also good to have these in your help file).

Because of the limited time there was only one week of feedback from real artists but of course I was surrounded by techies  to help fill this void.

In the end we refined the work flow once more and tied in the program with existing tools. (Up until now I was just parsing raw data). I hooked into a content-service using C++/CLI. This C++/CLI program also hosted my C#/WPF frontend, and to my surprise this worked really well and was easy to do!

In the end I left behind a well document and finished product and because we had a week to spare there was even quite some polish (the last week was used to add in some background workers and  nicer progress bar, I also added cancellation support to the layout algorithm).

During my internship I also experienced the release of Deus Ex: Human Revolution, of which the tech and pc-port was done by Nixxes, so it was really great to see the game get an 8,9 on meta-critic!
<p style="text-align: center;"><img class="aligncenter" title="Deus Ex: Human Revolution" src="http://brutalgamer.com/wp-content/uploads/2011/08/DeusExTitle.jpg" alt="" width="456" height="240" /></p>
The end-talk with my mentor was relaxed and pleasant. I knew I had done pretty well but I was quite surprised when he gave me a final grade of 9 out of 10! Yay!

All in all I had a great time, and I've learned a lot of new techniques (C++/CLI, WPF, Graph Layout Algorithms, Data Binding). I also finally got to experience a real hands-on approach where everything gets prioritized because resources are finite. On the university  it's really a rare thing to experience this, so this was really an eye opener. I feel like I learned more valuable skills in these two months than I would have doing 3 more courses (Thanks to a helpful dean I could replace 3 courses with this intern shop)

I would like to thank everyone at Nixxes for a great time!

PS.

One of my co-workers again sped up my A* code after peeking at my blog. I have his code and am trying to add a nice visualizer to it this time before posting it, so expect it up soon.
