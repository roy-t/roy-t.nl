---
layout: post
title: Computermanagement software
date: 2009-10-12 09:23
author: admin
comments: true
categories:
---
Lately I've been bussy working at the Rijksuniversiteit Groningen as 'one day a week'  systemadministrator/programmer.

One of the first jobs that was assigned to me was reorganizing a set of 14 computers. These computers run 'exhibits' so people interested in going to the university can see what we do. The old setup was kinda odd, all computers where attached to 4 remote controlled powerinterupters and each morning someone at the reception, or me turned on then powerinterupters and each computer turned on because "wake on power" was turned on in their bioses.

Each afternoon someone would again turn off the powerinterupters and each computer would just stop because the power ran out.

If there was something wrong with a computer, you'd just pick up your keys, keyboard and mouse and sat in front of the damn thing until it worked again.

I quickly started working on laying networkcables between all computers, setting up remote desktop configurations, configuring a sever to become a proxy/dhcp server/webserver and setting up all computers to "wake on lan." After that the administration began, find each computers username, password and mac adress, and setting a helpful computername.

After these changes I could remote desktop to the server, and from there remote desktop to each connected computer, configure it, install new software, reboot it, etc... The proxy server blocked all websites except for the websites of the university so the computers could no longer be used for 'bad browsing'.

There was still one thing that bothered me though, and that was not being able to see which computers where still working without logging in to each and every one of them. I also wasnt happy with still having to login in to the server to send the wake on lan packets in the morning, and shutting every computer down by login in again in the afternoon.

To overcome this problem I wrote two programs, creatively called ComputerManager and ComputerMonitor. ComputerMonitor is a small application that runs in the background and sends a "I'm alive" packet to ComputerMonitor every 2minutes, it also has a small listenserver running to listen to shutdown and reboot commands. I installed this on all 14 pc's.

The ComputerManager program listens for those "I'm alive " packets and keeps track of which computers have not send an "I'm alive" packet for 5 minutes and adds these to a "red list". The computers that keep responding keep being updated in the "green list" with their last update time, computername and ip-adress.

The program also allows for saving mac adresses of computers. These mac adresses are used to wake-up all computers on 8:55 am. The program also sends a shutdown message to every computer on 6:05pm. This way my job got allot easier. Ofcourse it was allot of work at first but it was worth my effort.

As a final touch I created one more little program that can be run by an exec command in a php script. This allowed me to make a secure webpage where people other than me can only press two buttons: "Turn all on" and "Turn all off".

I'm releasing the sourcecode of ComputerManager and Monitor to everyone. Allot is still hardcoded, and there are probably some bad design descissons here and there but it might be useful to someone. The asynchronous listen server is solid and a good learning example. There's also allot of code dealing with win32 calls like shutdown and reboot.

The most recent version can be downloaded <a title="Download!" href="http://cid-64e785655f2eee72.skydrive.live.com/browse.aspx/.Public/ComputerManagerMonitor" target="_blank">here</a>

I won't be actively updating or supporting this program since it was just written for my personal use, but if you got any questions or comments, feel free to ask.
