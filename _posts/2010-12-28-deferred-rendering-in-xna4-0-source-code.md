---
layout: post
title: Deferred Rendering in XNA4.0 Source Code
date: 2010-12-28 14:01
author: admin
comments: true
categories:
---
Lately I've been very interested in 'the 3D stuff'. And because of this I've been reading into Deferred Rendering.

Catalin Zima explaind deferred rendering very nicely, by comparing it to traditional rendering methods:
<blockquote>In the Single-Pass lighting method, each object is rendered, and all lights affecting that object are computer in one shader. [snip]. Since everything is done in a single shader, which has a limited instruction count, this technique is only suitable for a small number of lights [snip]. In some games, which only need a small number of lights, such as an outdoor daytime environment, this may prove to be a good choice. The disadvantages of this technique are the small number of lights, and the fact that shading operations may be wasted on surfaces which will be hidden in the final image.

Another method is the Multi-Pass lighting. Here, for each light, objects which are affected by the light are drawn with the current light’s shader. This causes a very high batch count (number of individual Draw calls), which in the worst case is equal to the number of lights multiplied by the number of objects. The problem of shading hidden surfaces still remains. And some operations are repeated many times each frame, such as vertex transformations.

Deferred Shading approaches the problem in a different manner. First, all objects are rendered without lighting computations. Instead, the objects output a set of attributes for each drawn pixel, such as position, normal, specular intensity, etc. After this, each light is applied on the final image as a 2D post process, using the data written in the previous pass. Because all objects use the same shader (the one which outputs the attributes), the engine management is greatly simplified. We no longed need to sort the scene objects based on the material they use. The number of draw calls is reduced to the number of objects + number of lights. Moreover, lighting calculations will only be done for visible pixels (the ones that make it into the final image).</blockquote>
Catalin has an <a href="http://www.catalinzima.com/tutorials/deferred-rendering-in-xna/">excellent tutorial on deferred rendering</a>, unfortunately some of the code no longer works, because it was written for XNA2.0.

Fortunately (for you) I've converted the entire code base to XNA4.0 as a learning exercise.

The code is a bit shorter now, (especially setting effects is so much easier in XNA4). And thus should be slightly easier to understand. The code includes everything that Catalin's original source code examples included. The camera can be moved using the keyboard (arrows, or w-a-s-d to move, z and x to zoom) or using the Xbox controller.

The source code can be downloaded here: <a href="http://www.roy-t.nl/files/DeferredLightingXNA4.rar">http://www.roy-t.nl/files/DeferredLightingXNA4.rar</a>

As a little benchmarking tool, I've already turned of VSync and FixedTimeStep for you. On my modest machine (AMD Athlon GP9400 Quad Core, 4GB ram, and an AMD HD4850) I could easily render 600 lights at 60fps+. (However this looks ugly). The default settings (103 lights) runs at 380~400 fps.

Here's a screen-shot how it should look (again by Catalin Zima)
<img src="http://www.catalinzima.com/wp-content/uploads/2008/02/demoscene.jpg" alt="Deferred Rendering" width="512" height="384" />

Anyway, have fun with it.
