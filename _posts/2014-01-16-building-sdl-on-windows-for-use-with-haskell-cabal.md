---
layout: post
title: Building SDL on Windows for use with Haskell / Cabal
date: 2014-01-16 11:05
author: admin
comments: true
categories:
---
If, like me, you wish to perform graphical operations with Haskell you need a library like SDL. Unfortunately most of the Haskell world resides in Linux so it is pretty hard to find good guides for Windows. This guide describes my endeavor to get things working.

I'll assume that you have nothing installed yet, so you might be able to skip some of these steps.
<h2>1. Install the Haskell Platform</h2>
You can get it from<a href=" http://www.haskell.org/platform/" target="_blank"> http://www.haskell.org/platform/</a> and it will include most of what you will need to work with Haskell on Windows (or any other platform). Installation is as easy as double clicking the installer.
<h2>2. Install the MinGW-MSYS tool chain</h2>
In order for Cabal (a distribution-manager like apt-get but then just for Haskell) to be able to build packages that have no native Windows libraries we need a Linux like tool chain for Windows.
<ul>
	<li>Download the MinGW installer from <a href="http://www.mingw.org/wiki/Getting_Started" target="_blank">http://www.mingw.org/wiki/Getting_Started</a> (in the middle of the page there is a blue link to  mingw-get-setup.exe)</li>
	<li>Run the installer, for legacy reasons install it in a path that does not contain spaces. I'll asume for now that you've installed it in C:\MinGW</li>
	<li>During the end of the installation a package manager will show. Install the meta package MSYS and click apply changes in the menu.</li>
	<li>Add C:\MinGW\bin\, C:\MinGW\, and C:\MinGW\msys\1.0\bin\ to the <a title="Path variable explanation" href="http://geekswithblogs.net/renso/archive/2009/10/21/how-to-set-the-windows-path-in-windows-7.aspx" target="_blank">PATH</a> environment variable</li>
</ul>
<h2>3. Install the SDL development libraries</h2>
Now we need to install the SDL development libraries and add them to the PATH variable so that the Haskell implementation can link and build.
<ul>
	<li>Download the SDL-devel-1.2.15-mingw32.tar.gz archive from <a href="http://www.libsdl.org/download-1.2.php" target="_blank">http://www.libsdl.org/download-1.2.php</a> and extract. I'll assume it is located in C:\SDL</li>
	<li>Add C:\SDL\, and C:\SDL\bin to the PATH environment variable</li>
</ul>
<h2>4. Build Haskell's SDL implementation</h2>
Ok final steps!
<ul>
	<li>Open a command prompt</li>
	<li>Run  <strong>cabal install SDL --extra-include-dirs=C:\SDL\include --extra-lib-dirs=C:\SDL\lib</strong></li>
	<li>This operation should complete with the message 'Installed SDL-0.6.5'</li>
</ul>
<h2>5. In Conclusion</h2>
Building things with Cabal is quite a hassle especially since it uses both the PATH variable and explicitly given paths to find all dependencies, error messages are not to clear either. I hope this guide helps you and saves you some time as it took me two days to get this exactly right. If you wish to see if all really works why not try building and running <a title="A program using SDL" href="https://github.com/cwi-swat/monadic-frp" target="_blank">this little program</a>, it is the reason why I went trough all the steps to get SDL working. <em>(Just left-click and drag to create a rectange, middle click to change the color, and right click to finish the rectangle).</em>

<em>Note: I am aware that the Haskell Platform includes its own version of MinGW but it does not include the MSYS library which is vital under Windows. It is also not easy to modify the built in version of MinGW and according to the docs the build in version can live happily together with the stand alone version.</em>
