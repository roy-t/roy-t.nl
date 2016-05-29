---
layout: post
title: Project Specs OOAD/iterative development style
date: 2009-12-02 16:25
author: admin
comments: true
categories:
---
I've said before that I'm working on a game for some time now. Actually me and a friend of mine came up with this togheter, and now for a month or two I've been testing and laying foundations for this game. However I came a bit stuck as to "what to do now" LostC1tY @ #xna (effnet server) asked me why I didn't make some kind of feature list and then try to work my way trough there. This reminded me of practices in the book<a title="The book on amazon" href="http://www.amazon.com/Applying-UML-Patterns-Introduction-Object-Oriented/dp/0131489062"> Object-Oriented Analysis and Design and Iterative Development</a> by Craig Larman (what a long name for a book :D). In which he describes how to do iterative development.

One of the first few artifacts in iterative development are a small story "Vision" some uses cases and some features that are essential. Then you work your way down from there and keep refining the requirements while at the same time implementing them step by step.  I can really recommend this book!

Anyway, I've made a bit of a beginning  that I wanted to share, now you know what I've been working on. (Oh the working title is "SpaceAce" and I will post further related blog items under that tag, but the game will definitely not be called like that in the end, I'm just not good in thinking up names :).

<strong>Design Document:</strong>
<p align="center">“Space Ace”</p>


<strong>Vision:</strong>

My vision is to create a back-to-basics strategy game in space.  The setting is a small solar system with moving planets. The player starts on one planet and their opposition on another planet. Both players don’t know where the other player is located. Players start building ships and space stations. As long as these objects stay within the gravity well of the planet they will ‘follow’ the planet.  Planets got multiple ‘gravity well rings’. Depending on the planet there will be 2 to 6 rings. The inner most ring is the smallest and is very close to the planet. Objects in the innermost ring swiftly rotate around the planet this might be used tactically (say a space station with guns that can cover all approaches to the planet).  The inner most ring is only suitable for small objects (research stations, sentries, satellites etc...).  More outer rings cover a larger area and objects in that area orbit less swiftly. The most outer ring is very large; objects in this ring don’t orbit around the planet.  The outer rings are more suitable for factories and other large structures “that can’t handle the stress of rotating so fast.”

Once a player has a bit of an army they might decide to explorer. They can select a couple of units to form a fleet. Once they’ve cleared the gravity well of their home planet they can try to stay ahead of their planet (the slowest normal ships must be faster than the fastest planet, however comets and the like might be faster) or decide to go the other way in which case it’s much faster to find other planets.  It might be wise to have some ships in the gravity wells of planets that orbit the sun at different velocities as to always have a presence in different parts of the solar system.

The planets must move as fast around the sun as to not make this game boring but as slow such that the tactics of planets movement and gravity wells is still intact.

In the end players encounter other players. Fighting is pretty regular, different types of weapons do different types of damage (Kinetic, EM, Heat, and Electric). Each ship’s armor and shield are affected differently by these types of damage.  Players select their ships and then select enemy ships to attack these ships. Ships might also auto attack enemy ships when they are within the same gravity well.

Planets can be captured by sending troop ships, filled with troopers. Each planet has a “ground defense force” when you send sufficient amounts of troopers down to the planet the planet should be yours.

Economy is based on the number of captured planets, each planet has a different ‘economics’ and ‘resources’ value, per tick is calculated how much money and resources are gained. There is an ‘organization tax’ which slightly increases with each captured planet, to keep the game balanced when one player quickly acquires a few planets while others haven’t. Some special units might require rare materials; these can only be acquired by capturing special comets.

<strong>Preliminary feature list
</strong><em>As in proper iterative development this is not a complete feature list, but this will be grained out and refined during development.</em>

<em>(Starting with the most critical/difficult to implement features, which will be developed/tested first).</em>

- Moving planets (complete)
- Gravity rings
- Build-able objects
- Ships
- Path finding
- Fighting
- AI
- Resources
- LAN
- Player control
- Menus
- Different difficulties
- Advanced editor
- Missions/storyline.
