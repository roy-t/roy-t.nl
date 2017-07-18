---
layout: page
title: Navigation Meshes
date: 2014-09-12 11:37
author: admin
comments: true
categories:
---
On this blog I have posted several articles on path finding, navigation grids and A*</a>. For my master thesis I started looking at Navigation Mesh techniques. I have developed a technique for objectively measuring the performance of <a title="Navigation Mesh" href="http://en.wikipedia.org/wiki/Navigation_mesh">navigation mesh techniques</a>. Using this new technique I have analysed the performance of several navigation mesh techniques.

The results of my master thesis can be downloaded here.
<ul>
	<li>Master thesis (<a title="Master Thesis" href="http://dspace.library.uu.nl/handle/1874/302263">pdf available freely from the Utrecht University Open Access Library</a>)</li>
</ul>

[Wouter van Toll](http://www.uu.nl/staff/WGvanToll) incorporated my work in this own studies, resulting in the following related publication and dissertation.

- van Toll, W.G., Triesscheijn, Roy, Kallmann, Marcelo, Oliva, Ramon, Pelechano, Nuria, Pettré, Julien &amp; Geraerts, R.J. (2016). A Comparative Study of Navigation Meshes. International ACM SIGGRAPH Conference on Motion in Games (pp. 91-100).

- van Toll, W.G., [Navigation for Characters and Crowds in Complex Virtual Environments](https://dspace.library.uu.nl/handle/1874/348971).

An excerpt of the introduction of my master thesis:
<blockquote>
Virtual worlds are often populated with autonomous characters called agents. How an agent can move inside the virtual worlds is influenced by many factors. The virtual world can consist of different terrain types, such as grass, asphalt and pavement, which are more or less desirable to walk on and influence the speed of the agent. Virtual worlds also contain obstacles. Obstacles can be completely static such as an immovable bolder or dynamic such as a car or another agent.
</blockquote>

<blockquote>
An agent should be able find paths in the virtual world (path planning) and traverse them smoothly in real-time (path navigation). Paths are influenced by the type of terrain, obstacles, and the capability and goals of the agent. Often a path should be short, smooth, and have a guaranteed amount of clearance from obstacles. Additional constraints follow from the goal of the agent. If the goal is stealth a path should have little or no exposure to observers. If the goal is to vacuum a room or to mow grass the path should have maximum coverage. Many other scenarios exist.
</blockquote>

<blockquote>
The data structure representing the virtual world does not necessarily represent the space that an agent can navigate (the walkable space) in a format that can efficiently facilitate path planning and path navigation queries. Hence, the walkable space should be represented in a specialized data structure such as a \emph{navigation mesh}. Navigation meshes speed up path planning and path navigation queries by storing a subdivision of the walkable space. There are many different navigation mesh techniques that differ in the way they compute and represent the subdivision of the walkable space. Each of these techniques has its own strengths and weaknesses.
</blockquote>
