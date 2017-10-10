---
layout: post
title: Roy-T.AStar, a NuGet package for A* path finding
date: 2017-08-01 21:02
author: admin
comments: true
categories:
---
Over the years I've made many improvements to my A* implementation. I believe its currently one of the fastest implemenations for C# out there. However, it was really hard to update to my latest and greatest version. So I present to you a completely new implementation, even faster. Which I've released as a NuGet package and have made available on GitHub.

- Get the [NuGet package](https://www.nuget.org/packages/RoyT.AStar/). Learn [how to use NuGet](https://docs.microsoft.com/en-us/nuget/quickstart/use-a-package).
- Browse the [source code](https://github.com/roy-t/AStar), contributions are welcome.

## Tutorial

Below I give a textual explanation of this library and how to use it. If you are more interested in a code sample you can find it right after the next section.

### Usage in text
Your agent might be able to move fluently through a world with hills and water but that representation is too complex for the A* algorithm. 
So the first thing you need to do is to is to create an abstract representation of your world that is simple enough for the path finding algorithm to understand.
In this library we use a grid to represent the traversable, and intraversable, space in your world. 

You can instantiate a grid using the `Grid` class. If you have a world that is a 100 by a 100 meters large, and you
create a grid of 100x100, each cell will represent a patch of land of 1x1 meters. 

Experiment with the size of the grid, a larger grid
will give you more fine grained control but it will also make the path finding algorithm slower.

Once you have a grid you need to configure which cells represent obstacles. Some obstacles, like a high wall, are intraversable. Use the `BlockCell` method to prevent the path finding algorithm from planning paths through that cell.
Other obstacles, like dense shrubbery, take more time to traverse. In that case give the cell a higher cost using the `SetCellCost` method.

Once you've configured your grid its time to start planning paths. Using the `GetPath` method you can immidately search for a path between two cells for an agent that can move in all directions. 
You can also plan paths for agents that are more limited in their movent using the overload of `GetPath` that takes a `movementPattern` parameter. In that case you can either select one of the predefined ranges of motion from the `MovementPatterns` class or you can configure yourself what kind of steps an agent can make.

You can define your own patterns for your agents. Below I have defined the movement pattern for an agent that can only move diagonally. (This movement pattern is included in the library as `MovementPatterns.DiagonalOnly`).

```csharp
var diagonalOnlyMovementPattern = new[] {
    new Offset(-1, -1), new Offset(1, -1), , new Offset(1, 1), , new Offset(-1, 1)
};
```


### Usage example in code
You can easily search for the lowest cost path for an agent that can move in all directions.

```csharp
using RoyT.AStar;

// Create a new grid and let each cell have a default traversal cost of 1.0
var grid = new Grid(100, 100, 1.0f);

// Block some cells (for example walls)
grid.BlockCell(new Position(5, 5))

// Make other cells harder to traverse (for example water)
grid.SetCellCost(new Position(6, 5), 3.0f);

// And finally start the search for the shortest path form start to end
IList<Position> path = grid.GetPath(new Position(0, 0), new Position(99, 99));

```
It is also posssible to define the agent's movement pattern.

```csharp
// Use one of the built-in ranges of motion
var path = grid.GetPath(new Position(0, 0), new Position(99, 99), MovementPatterns.DiagonalOnly);

// Or define the movement pattern of an agent yourself
// For example, here is an agent that can only move left and up
var movementPattern = new[] {new Offset(-1, 0), new Offset(0, -1)};
var path = grid.GetPath(new Position(0, 0), new Position(99, 99), movementPattern);
```


## Implementation details
While making this library I was mostly concerned with performance (how long does it take to find a path) and ease of use.
I use a custom `MinHeap` data structure to keep track of the best candidates for the shortest path. I've experimented with other data structures, like the standard `SortedSet` but they were consistently slower. 
Other small tricks I've used is using a `bool[]` to keep track of checked cells and to only compute the squared distance in my heuristic. (Which helped a surprising amount).

While micro-optimizing the code I've used the handy [BenchMark.Net](https://github.com/dotnet/BenchmarkDotNet) library to see if my changes had any effect. The benchmark suite is included in the source code here. So if you would like to try to make this implemention faster you can use the same benchmark and performance metrics I did.

For version 1.0 I got the following numbers for a 100x100 grid (10000 cells) filled with a gradient.


``` ini

BenchmarkDotNet=v0.10.8, OS=Windows 10 Redstone 2 (10.0.15063)
Processor=Intel Core i5-4690 CPU 3.50GHz (Haswell), ProcessorCount=4
Frequency=3415990 Hz, Resolution=292.7409 ns, Timer=TSC
dotnet cli version=1.0.4
  [Host]     : .NET Core 4.6.25211.01, 64bit RyuJIT
  DefaultJob : .NET Core 4.6.25211.01, 64bit RyuJIT

 |            Method |     Mean |     Error |    StdDev |
 |------------------ |---------:|----------:|----------:|
 | Gradient100X100 | 1.177 ms | 0.0057 ms | 0.0048 ms |

 ```