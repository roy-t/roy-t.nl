---
layout: post
title: Blender versus trueSpace, creating models for XNA
date: 2008-09-25 14:47
author: admin
comments: true
categories:
---
<strong>Update: the source code is now available <a href="http://rapidshare.com/files/149787437/ModellingTests.rar.html">here</a></strong>

Lately I've been more and more curious about the 3D aspects of games. Although I Haven't even completed a 2D game yet, or made a cool tech demo. 3D really draws me in, and you can do such cool tricks in 3D, especially now the Vertex and Pixel shaders are fully programmable on both the PC and Xbox360.

One of the main drawbacks of creating 3D games is the insane amount of models you need for a game. Anyone can just load pain.exe and create some sprites, but creating models is allot more difficult and time consuming. I've never ever before attempted to create a 3D model using Blender, trueSpace or any other programme. (Ok I've played a bit with UnrealEditor1/2.5/3 but that's more level design than 3D modelling).

I've installed both Blender 2.5.2 (www.blender.org ) and trueSpace7.6 (www.caligari.com ) (both the newest versions).

Blender pro's
<ul class="unIndentedList">
	<li> Free</li>
	<li> Large community (meaning much tutorials and unprofessional support)</li>
	<li> Loads of options to do things</li>
	<li> Large set of primitives to work with from start</li>
	<li> Exports to .x and .fbx (fbx is the way to go as it is human readable)</li>
</ul>
Blender cons
<ul class="unIndentedList">
	<li> Bit uncontrollable Camera</li>
	<li> Very difficult UI (which changes all the time)</li>
	<li> Viewports and renders not always the same.</li>
	<li> Inconsistencies in rendering and viewports</li>
</ul>
trueSpace pro's
<ul class="unIndentedList">
	<li> Free</li>
	<li> Excellent Camera control (after reading up on it a bit)</li>
	<li> Excellent manual (1500 pages with allot of pictures)</li>
	<li> Professional Video Tutorials (only recently made free)</li>
	<li> .x exporter specifically rewritten for XNA</li>
	<li> Professional Helpdesk</li>
</ul>
trueSpace cons
<ul class="unIndentedList">
	<li> Small community</li>
	<li> Only exports to .x (although this was specifically rewritten for XNA)</li>
	<li> Non-standard UI (poor right-mouse-button support, no dropdown menu's)</li>
	<li> Library default doesn't show to many standard meshes (only cube and sphere)</li>
</ul>
To test both products I created my own simple shader, it only does two things: translating the object to WorldViewProjection space (3D space) texturing it with 1 texture.

The shader used was written in HLSL and listed here below (don't worry if you don't understand it, it's not relevant for the rest of this article.)

{% highlight csharp %}
//Simple shader for showing and texturing 3D models
//Writen by R.A. Triesscheijn, 25-09-2008 (DD/MM/YYYY)
//Released under the MIT License (Free for any use)
//http://www.opensource.org/licenses/mit-license.php

//WorldViewProj = worldMatrix * viewMatrix * projectionMatrix
float4x4 WorldViewProj : WORLDVIEWPROJ;  //set by XNA
texture texX;					//set by XNA
sampler sampX = sampler_state
{ texture = <texX>; magfilter = LINEAR; minfilter=LINEAR; mipfilter = LINEAR; AddressU = mirror; AddressV = mirror;};

struct VS_INPUT
{
    float4 inPos    :   POSITION0;
    float2 tex      :   TEXCOORD0;
};

struct VS_OUTPUT
{
    float4 Pos      :   POSITION0;
    float2 Tex      :   TEXCOORD0;
};

//Simple VertexShader just transforms to 3D
void VS(VS_INPUT In, out VS_OUTPUT Out)
{
    Out.Pos = mul(In.inPos,  WorldViewProj );
    Out.Tex = In.tex;
};

//Simple PixelShader just samples the texture
//And draws the correct colour.
float4 PS(VS_OUTPUT In) : COLOR0
{
    return tex2D(sampX, In.Tex);
};

technique Technique1
{
    pass Pass1
    {
        VertexShader = compile vs_2_0 VS();
        PixelShader = compile ps_2_0 PS();
    }
}
{% endhighlight %}

The code I used for the camera and actual drawing in XNA are maybe even more trivial than this shader code so I will only highlight the way how you have to set your own effect on the Model.

{% highlight csharp %}
foreach (ModelMesh mesh in model.Meshes)
{
    foreach (ModelMeshPart meshPart in mesh.MeshParts)
    {
        meshPart.Effect = effect.Clone(device);
    }
}
{% endhighlight %}

Where the effect file was created by saving the shader code in MyEffect.fx, adding it to the project, and then loading it using: Effect effect = Content.Load<Effect>("BasicFX");.
However ofcourse this isnt a tutorial on how to draw object, but on how Blender and trueSpace compare for XNA. So I did the following test in both programmes.
<ul class="unIndentedList">
	<li> Create a textured cube in Blender or trueSpace</li>
	<li> Load it into XNA</li>
	<li> Set my own effect on the model as show above</li>
	<li> Rendering the model using the following settings</li>
</ul>

{% highlight csharp %}
effect.CurrentTechnique = basicFX.Techniques["Technique1"];
effect.Parameters["WorldViewProj"].SetValue(Matrix.Identity * camera.viewMatrix * camera.projectionMatrix);
effect.Parameters["texX"].SetValue(texture);
{% endhighlight %}

First one's up is blender:

Blender

After installing blender I found a large viewport and allot of option tabs. I heard from many people that Blender's UI is terrible but actually at first I thought it wasn't so bad. Createing a cube wasn't hard at all either. I just followed the menu options: Add->Mesh->Cube. And *woosh* there was my first cube. It was still untextured so I was looking for a texture to drag onto it or a panel that said something like material. This was the part where the UI got in the way of me and modelling, I just couldn't find it! After searching on the internet I finally found the panel "Shading" doesn't really sounded like adding a texture/material, but ok. In the shading pannel I found one button accompanied by the text: "Links and pipeline", "Link to object". The button read "Add new". Well I would've never figured this out rationally so I just pressed add new, and yay there it was a new panel opened called material, I pressed the button "Add texture" and nothing happended but the word "Tex" appeared in a list. I tried clicking it, right clicking it and allot more, untill I returned to the tutorial. Apparently the texture was now added but to set it I had to go to a totally different panel that visually didn't have a link with this "Tex" at all.

After going to a new appeared pannel called "MaterialSettings" (which wasn't there before I added a Texture) I could finally load an image and the Cube was textured, well I couldn't see that in the viewport (not even in the Textured view) but when I pressed render it showed nicely.

After that came the exporting to .fbx which was easy (Export->.fbx->save) however the lack of a proper filebrowser is a bit unhandy (its really ugly console like) but not a dealbreaker. The adding to XNA was easy (just as every content import).

I loaded the model into a Model using the ContentManager Content. First I used the standard BasicEffect to draw the Cube, everything was fine, textures and all. However then I tried setting my own effect and drawing the cube with a different texture. Nothing showed.... After playing a bit with my pixelshader and letting it output full white (return float4(1,1,1,1)) I saw a white cube, so the shader was working properly, but the Model was good as well because it id show using the BasicEffect???

After some Google-ing I found out that a totally different approach is needed to texturing in Blender if you want it to be usable in XNA, you can find a tutorial here: http://www.stromcode.com/2008/03/10/modelling-for-xna-with-blender-part-i/  (read the comments when using Blender246+ because they changed the UI back then, moving the Face Mode to a button in the Edit Mode).

After completing this tutorial I could see the texture in the viewport of Blender, however when I tried rendering it in Blender this time the texture didn't show. So this was about the opposite effect as the first technique, very strange behaviour, but somehow the correct way if you want to use it in XNA. Because this time the model worked perfectly in XNA. Of course I don't really find this user-friendly.

trueSpace

So maybe trueSpace does a better job. However at first I wasn't even able to start it under Windows Vista 32bit. After manually setting trueSpace to run as admin it finally worked. The workspace I entered when starting trueSpace was totally different from Blender. There is a big library on the right where you can add objects too. One of the objects already there was a cube, I dragged and dropped it to the viewport and it instantly got added, with a texture on it. Because of the problems in Blender I wanted to add a texture myself so I dragged a texture from the library on to the model, and TADA, it also rendered correctly in trueSpace whether I rendered to file or just looked in the viewport. The model also instantly worked in XNA. I also want to highlight trueSpace's camera system where in Blender the target was a bit hard to keep in view, in trueSpace the camera is controlled by holding the mouse over one of several different ‘icons' in the lower right corner of the viewport, this gave very precise movement which for me felt more comfortable than Blender's approach.

Conclusion:

In the event of making a very simple model, only looking at the difference in length of text will give you a straight answer: In trueSpace it's much easier to create very simple geometry and instantly have it rendering correctly in XNA. After this small example I tried some tutorials and created some pretty cool stuff (a snowman with scenery in Blender and a spaceship in trueSpace) although this showed that Blender is a very powerful modelling programme, it didn't quite beat trueSpace, after a good introduction trueSpace's UI is much more accessible than Blender's one. Where in Blender everything I wanted to accomplish I had to look up in a tutorial, in trueSpace it came more natural to me how to do things. You don't have to switch modes constantly to select something different, in Blender you have to switch modes to, for example go to face select mode. First you go to edit mode, then enable face mode and then you can select a face. In trueSpace you just click your selection button, hold it and select "face select." Those small things make trueSpace allot less complex, your not losing buttons, not seeing an entirely different interface when you just want to select something else.

However I do have to note that I haven't tested trueSpace's and Blender's animation facilities, but from what I have read this might be a point where Blender excels. Also I don't know if the trueSpace simplism and real time rendering will affect you when trying to create very complex models. But for starters I would definitely recommend trueSpace. Blender isn't bad when used with XNA, and allot of people who know allot more of modelling and game programming use Blender, but in my eyes there are just to much sharp edges on Blender for a beginner to use it. And when your main goal is creating a fun game, and not creating stunning models trueSpace will just show allot more progress in the same time.
