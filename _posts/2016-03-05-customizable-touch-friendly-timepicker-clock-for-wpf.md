---
layout: post
title: Customizable Touch-Friendly TimePicker Clock for WPF
date: 2016-03-05 12:18
author: admin
comments: true
categories:
---
<img class="alignnone size-full wp-image-881" src="https://raw.githubusercontent.com/roy-t/TimePicker/master/screenshot.png" alt="screenshot" width="351" />

I've created a fully customizable touch-friendly time picker control for WPF. Initially I tried to create a time picker that looks like the one on your phone. But I got so frustrated with creating an infinite scrollable list that I decided to make an old-fashioned time picker based on a clock.

The TimePicker supports a Two-Way binding to a TimeSpan property. Dragging the hour or minute indicator updates the TimeSpan. There are also a lot of visual options

 - Brush for the hour indicator
 - Thickness of the hour indicator
 - Brush for the minute indicator
 - Thickness of the minute indicator
 - Separate brushes for the hour and minute ticks
 - Separate thickness for the hour and minute ticks
 - Background brush
 - Border brush and border thickness

The code also includes a handy math class which, among other things, makes it possible to calculate a time based on the position on of the mouse in relation to the clock.

I 'recently' announced that I created a bitbucket account. But since I've grown so accustomed to git (we switched from Hg to git at work) I've decided to post this project on my brand new GitHub account.

You can download the code and examples at <a href="https://github.com/roy-t/TimePicker">GitHub</a>


