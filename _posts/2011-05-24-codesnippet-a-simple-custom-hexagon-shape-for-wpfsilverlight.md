---
layout: post
title: Codesnippet, A simple custom hexagon shape for WPF/Silverlight
date: 2011-05-24 21:26
author: admin
comments: true
categories:
---
Recently I've been trying to learn more about WPF, since WinForms is getting really old now. As a small exercise I was trying to create a custom <code>Shape</code>, so I created a new class, derived it from <code>Shape</code> and started following <a href="http://www.codeproject.com/KB/WPF/wpfarrow.aspx">this</a> tutorial untill I found out that you can't override the <code>DefiningGeometry</code> method in Silverlight.

After some searching I found <a href="http://blogs.msdn.com/b/nickkramer/archive/2009/12/03/subclassing-shape-or-more-accurately-path.aspx">this</a> MSDN Blog article, where in Silverlight a custom shape is created by extending from <code>Path</code> (well I wouldn't have thought of that).

After a bit of tweaking I adapted the class to display a Hexagon instead of a Triangle:
{% highlight csharp %}
namespace MyProject.Shapes
{
    public class Hexagon : Path
    {
        public Hexagon()
        {
            CreateDataPath(0, 0);
        }

        private void CreateDataPath(double width, double height)
        {
            height -= this.StrokeThickness;
            width -= this.StrokeThickness;

            //Prevent layout loop
            if(lastWidth == width && lastHeight == height)
                return;

            lastWidth = width;
            lastHeight = height;

            PathGeometry geometry = new PathGeometry();
            figure = new PathFigure();

            //See for figure info http://etc.usf.edu/clipart/50200/50219/50219_area_hexagon_lg.gif
            figure.StartPoint = new Point(0.25 * width, 0);
            AddPoint(0.75 * width, 0);
            AddPoint(width, 0.5 * height);
            AddPoint(0.75 * width, height);
            AddPoint(0.25 * width, height);
            AddPoint(0, 0.5 * height);
            figure.IsClosed = true;
            geometry.Figures.Add(figure);
            this.Data = geometry;
        }

        private void AddPoint(double x, double y)
        {
            LineSegment segment = new LineSegment();
            segment.Point = new Point(x + 0.5 * StrokeThickness,
                y + 0.5 * StrokeThickness);
            figure.Segments.Add(segment);
        }

        protected override Size MeasureOverride(Size availableSize)
        {
            return availableSize;
        }

        protected override Size ArrangeOverride(Size finalSize)
        {
            CreateDataPath(finalSize.Width, finalSize.Height);
            return finalSize;            
        }

        #region FieldsAndProperties
        private double lastWidth = 0;
        private double lastHeight = 0;
        private PathFigure figure;
        #endregion 
    }
{% endhighlight %}

You can use a 'shape'  like this in XAML:
{% highlight xml %}
<UserControl x:Class="FantasyCartographer.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:Shapes="clr-namespace:MyNameSpace.Shapes"
    mc:Ignorable="d"
    d:DesignHeight="300" d:DesignWidth="400">

    <Grid x:Name="LayoutRoot" Background="White">
        <Canvas Height="161" HorizontalAlignment="Left" Margin="27,32,0,0" Name="canvas1" VerticalAlignment="Top" Width="254">
            <Shapes:Hexagon Canvas.Left="0" Canvas.Top="0" Height="154" x:Name="hexagon1" Stroke="Black" StrokeThickness="3" Width="188" Fill="Red"  />            
        </Canvas>
    </Grid>
</UserControl>
{% endhighlight %}

Tip: don't forget to define an <code>xmlns</code> namespace mapping to your own .NET namespaces so that you can use a shape even if you defined it in another namespace, I've done this in the above <code>XAML</code> code as an example.

