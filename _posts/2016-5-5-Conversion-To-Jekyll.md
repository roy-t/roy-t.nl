---
layout: post
title: Conversion to Jekyll
date: 2016-05-05 12:03
author: admin
comments: true
categories:
---

For the last 8 years this blog was running on Wordpress. I think Wordpress is a great platform, and in those eight years I was generally satisfied with how it worked.

Unfortunately the last few years have been different. Wordpress seems to have become extremely vulnerable to malware infections. This blog itself got infected at least 4 times in the last two years! This is odd since I use a completely standard installation and almost no plugins. Auto-update is configured and I've tried to harden the installation with a security scanner but this didn't seem to help at all. To make things worse the blog software also didn't really work when it wasn't infected, it was terribly slow.

Because of this I've decided to switch over my entire blog to plain old static html pages. This should make it virtually impossible to get infected and it also gives a nice speed boost!

Of course I will not be typing HTML by hand. I've decided to use [Jekyll](https://jekyllrb.com). Jekyll generates a complete static website from posts written in markdown. 

Changing from Wordpress to Jekyll isn't painless. I've used a converter to convert all the old Wordpress posts to markdown but most of them need small tweaks. I've also had some trouble making the old Wordpress links work. But thanks to some .htaccess voodoo that too works alright now :).

You can check out [Github](https://github.com/roy-t/roy-t.nl) to see how I've done the conversion. All the inputs for this website are stored there.

It will take some time to convert all the old posts. There are almost 150 of them. See my twitter feed for the actual status. Currently almost everything from the last 5 years has been converted.

In the meantime, sorry for the inconvenience!