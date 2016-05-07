---
layout: post
title: Post-Complement Color Grading
date: 2013-05-10 17:48
author: admin
comments: true
categories:
---
A friend of mine was having problems implementing <a title="NVIDIA developer Portal" href="http://developer.download.nvidia.com/shaderlibrary/webpages/shader_library.html#post_complements">NVIDIA's Post-Complement example</a>. The example code was littered with unnecessary garbage, probably created by a cross-platform shader generator/compiler. So to make it more clear what the method does I quickly rewrote it and I thought I would share it. It took much more debugging than expected since apparently not all RGB2HSV converter code is equal. Luckily, in the end, everything seems to work.

So basically just dump the below code in a shader and call PostComplement before you return from the pixel shader to apply a form of colour grading that makes the guide colour pop-out by shifting colours that are close to the guide colour closer to it and colours that are far away from the guide colour to the complement of the guide colours. (Remember those Blue-Orangy movie posters, that's basically what you can do with this effect if you make the guide colour orange).

![Color Grading]({{site_url}}/files/color_grading.jpg)

(Image by Total Commitment Games. Effect at a not too subtle setting to clearly show the difference)


{% highlight csharp %}
// Post Complement method
// http://developer.download.nvidia.com/shaderlibrary/webpages/shader_library.html#post_complements

// RGB to HSV and HSV to RGB methods
// from http://www.chilliant.com/rgb2hsv.html
float RGBCVtoHUE(in float3 RGB, in float C, in float V)
{
    float3 Delta = (V - RGB) / C;
    Delta.rgb -= Delta.brg;
    Delta.rgb += float3(2,4,6);
    // NOTE 1
    Delta.brg = step(V, RGB) * Delta.brg;
    float H;
    H = max(Delta.r, max(Delta.g, Delta.b));
    return frac(H / 6);
}

float3 RGBtoHSV(in float3 RGB)
{
    float3 HSV = 0;
    HSV.z = max(RGB.r, max(RGB.g, RGB.b));
    float M = min(RGB.r, min(RGB.g, RGB.b));
    float C = HSV.z - M;
    if (C != 0)
    {
        HSV.x = RGBCVtoHUE(RGB, C, HSV.z);
        HSV.y = C / HSV.z;
    }
    return HSV;
}

float3 HUEtoRGB(in float H)
{
    float R = abs(H * 6 - 3) - 1;
    float G = 2 - abs(H * 6 - 2);
    float B = 2 - abs(H * 6 - 4);
    return saturate(float3(R,G,B));
}

float3 HSVtoRGB(float3 HSV)
{
    float3 RGB = HUEtoRGB(HSV.x);
    return ((RGB - 1) * HSV.y + 1) * HSV.z;
}

float3 HSVComplement(float3 HSV)
{
    // X = Hue, so rotate it for the complement
    float3 complement = HSV;
    complement.x -= 0.5;
    if (complement.x &lt; 0.0) { complement.x += 1.0; }
    return(complement);
}

// Lerps 2 hue values, since they are on a circle
// in HSV we need some weird code for that
float HueLerp(float h1, float h2, float v)
{
    float d = abs(h1 - h2);
    if(d &lt;= 0.5)
    {
        return lerp(h1, h2, v);
    }
    else if(h1 &lt; h2)
    {
        return frac(lerp((h1 + 1.0), h2, v));
    }
    else
    {
        return frac(lerp(h1, (h2 + 1.0), v));
    }
}

float3 PostComplement(float3 input)
{
    // Tweakable values
    float3 guide = float3(1.0f, 0.5f, 0.0f); // the RGB colour that you want to 'bring out'

    float amount = 0.5f; // influence how much a colour gets lerped toward the guide or complement

    // Correlation and Concentration together define a curve along which the colour grading is done
    // tweak these values to see the effects, I think correlation should be &lt; 0.5f and concentration should     // be &gt; 1.0f, but I havent double checked that math
    float correlation = 0.5f;
    float concentration = 2.0f;

    // Convert everything to HSV
    float3 input_hsv = RGBtoHSV(input);
    float3 hue_pole1 = RGBtoHSV(guide);
    float3 hue_pole2 = HSVComplement(hue_pole1);

    // Find the difference in hue, again hue is circular so keep it in a circle
    float dist1 = abs(input_hsv.x - hue_pole1.x); if (dist1 &gt; 0.5) dist1 = 1.0 - dist1;
    float dist2 = abs(input_hsv.x - hue_pole2.x); if (dist2 &gt; 0.5) dist2 = 1.0 - dist2;

    float descent = smoothstep(0, correlation, input_hsv.y);

    // *there was a version here that forced it 100% but I skipped implementing that*

    float3 output_hsv = input_hsv;
    // Check if we are closer to the guide or to the complement and color grade according
    if(dist1 &lt; dist2)
    {
        // Bring the colour closer to the guide
        float c = descent * amount * (1.0 - pow((dist1 * 2.0), 1.0 / concentration));
        output_hsv.x = HueLerp(input_hsv.x, hue_pole1.x, c);
        output_hsv.y = lerp(input_hsv.y, hue_pole1.y, c);
    }
    else
    {
        // Bring the colour closer to the complement
        float c = descent * amount * (1.0 - pow((dist2 * 2.0), 1.0 / concentration));
        output_hsv.x = HueLerp(input_hsv.x, hue_pole2.x, c);
        output_hsv.y = lerp(input_hsv.y, hue_pole2.y, c);
    }

    float3 output_rgb = HSVtoRGB(output_hsv);
    return output_rgb;
}
{% endhighlight %}
