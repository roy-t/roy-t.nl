---
layout: post
title: GPU Based Path Tracer
date: 2013-04-21 22:28
author: admin
comments: true
categories:
---
<h2>Introduction</h2>
As some of you might have seen I've been working on a Path Tracer on the GPU. Path Tracing is ray tracing like technique that is (when done right) a physically correct simulation of light. Usually it is done on the CPU but since the work can be easily parallelized and GPUs are getting more powerful, and more programmable it is now feasible to let the GPU do the bulk of the work. I didn't use Cuda or OpenCL just plain 'simple' DirectX 11 with pixel shaders written in HLSL doing most of the work.

Since it is an assignment (which is due in 40 minutes) I can't share any source code with you. But I would like to show the video and tell you where you can find the resources to build your own.
<h2>Video</h2>
(Be sure to select the 720P version, but even then the compression has a hard time with the grainyness that path tracing produces. The actually generated image are grainy but look a lot better.)

<iframe width="560" height="315" src="https://www.youtube.com/embed/xNjUk8-GNKA?list=PLFFEF8E08DDF498AA" frameborder="0" allowfullscreen></iframe>
<h2>Image Gallery</h2>
![Cornell Box]({{site_url}}/files/Cornell-Box-300x167.png)

![Depth of Field]({{site_url}}/files/Depth-of-Field-1-300x168.png)

![Depth of Field 2]({{site_url}}/files/Depth-of-Field-2-300x168.png)

![Reflectance]({{site_url}}/files/Reflectance-1-300x169.png)

![Reflectance 2]({{site_url}}/files/Reflectance-2-300x168.png)

![Different levels of reflectance]({{site_url}}/files/Reflectance-parameter-influence-1.0-0.6-300x168.png)

<h2>References</h2>
The Direct3D 11 Reference
<a href="http://msdn.microsoft.com/en-us/library/windows/desktop/ff476079(v=vs.85).aspx">http://msdn.microsoft.com/en-us/library/windows/desktop/ff476079(v=vs.85).aspx</a>
<ul>
	<li>Main resource</li>
</ul>
Wolfram Math World
<a href="http://mathworld.wolfram.com/SpherePointPicking.html">http://mathworld.wolfram.com/SpherePointPicking.html</a>
<ul>
	<li>Sphere Point Picking algorithm #2</li>
</ul>
GPU Gems 3
<a href="http://http.developer.nvidia.com/GPUGems3/gpugems3_ch37.html">http://http.developer.nvidia.com/GPUGems3/gpugems3_ch37.html</a>
<ul>
	<li>GPU random number generation</li>
</ul>
Colors, Effects, Code
<a href="http://www.colorseffectscode.com/Projects/GPUPathTracer.html">http://www.colorseffectscode.com/Projects/GPUPathTracer.html</a>
<ul>
	<li>‘Jitter’ idea for depth of field</li>
</ul>
The FW1 DirectX 11 Font Wrapper
<a href="http://fw1.codeplex.com/">http://fw1.codeplex.com/</a>
<ul>
	<li>This library is used for font rendering</li>
</ul>
Rastertek.com
<a href="http://www.rastertek.com/dx11tut22.html">http://www.rastertek.com/dx11tut22.html</a>
<ul>
	<li>Render Targets</li>
	<li>Best practices (I recommend the entire tutorial series)</li>
</ul>
Fundamentals of Computer Graphics, 3<sup>rd</sup> edition, Peter Shirley &amp; Steve Marschner, 2009
<a href="http://www.amazon.com/Fundamentals-Computer-Graphics-Peter-Shirley/dp/1568814690/">http://www.amazon.com/Fundamentals-Computer-Graphics-Peter-Shirley/dp/1568814690/</a>
<ul>
	<li>Miscellaneous math</li>
	<li>View/Projection/Perspective transformations</li>
	<li>Inverse transformations</li>
</ul>
