---
layout: post
title: Installing XNA 4 under Visual Studio 2017
date: 2017-07-18 10:15
author: admin
comments: true
categories:
---
At [SilverFit](http://silverfit.nl) we use XNA to create physical and mental exercises for the elderly care industry. We've been doing this for more than eight years now. Leaving us with products that contain more than 30 XNA based games. You can imagine our horror when we tried to install the XNA plugin under Visual Studio 2017 and it didn't work.

Of course we're looking at alternatives. But even with alternatives such as MonoGame its hard to convert seven years of work in a short amount of time. (Actually we tried to convert all our games to MonoGame three years ago but we ran into several blocking issues). 

So I tried to find a solution. After some hardcore debugging I figured out how to change the VSIX file to run under VS2017 and how to move some files around so that XNA's content pipeline would work. I've been sitting on this guide for a while. Hoping for a more elegant solution. But unfortunately no-one has discovered one.

# The steps

1. Download a modified version of the XNA **2015** vsix [here](https://mxa.codeplex.com/) (the XNA 2017 version seems to be a failed attempt at getting things to work).
2. Unzip XNA Game Studio 4.0.vsix and replace the {% ihighlight xml %}<Installation />{% endihighlight %} tag in extension.vsixmanifest with this:

{% highlight xml %}
 <Installation InstalledByMsi="false">
    <InstallationTarget Version="[12.0,16.0)" Id="Microsoft.VisualStudio.VSWinDesktopExpress" />
    <InstallationTarget Version="[12.0,16.0)" Id="Microsoft.VisualStudio.Pro" />
    <InstallationTarget Version="[12.0,16.0)" Id="Microsoft.VisualStudio.Premium" />
    <InstallationTarget Version="[12.0,16.0)" Id="Microsoft.VisualStudio.Ultimate" />
    <InstallationTarget Version="[14.0,16.0)" Id="Microsoft.VisualStudio.Community" />
    <InstallationTarget Version="[14.0,16.0)" Id="Microsoft.VisualStudio.Enterprise" />
  </Installation>
{% endhighlight %}

3. Place everything in a zip file again and change the extension to vsix. Now run the the vsix file. It should give a warning message but other than that install for VS2017 without problems.

4. Copy everything from {% ihighlight powershell %}C:\Program Files (x86)\MSBuild\Microsoft\XNA Game Studio{% endihighlight %} to {% ihighlight powershell %}C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\MSBuild\Microsoft\XNA Game Studio{% endihighlight %}

5. Open the Visual Studio 2017 developer command prompt by searching for Developer command prompt for VS 2017 as administrator and execute the following code: (this will add the new version of Microsoft.Build.Framework to the Global Assembly Cache).

{% highlight powershell %}
 cd C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\MSBuild\15.0\Bin
 gacutil /i Microsoft.Build.Framework.dll
{% endhighlight %}

After this you should be able to work with XNA in Visual Studio 2017 without problems. 

I've made a ticket to get some more information from Microsoft why this is needed. You can see it [here](https://github.com/Microsoft/msbuild/issues/1831) but the response so far is not really overwhelming.