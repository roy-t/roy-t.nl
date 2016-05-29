---
layout: post
title: Traversal algorithms using yield
date: 2011-02-12 15:04
author: admin
comments: true
categories:
---
So two days ago I wrote a <a href="http://roy-t.nl/index.php/2011/02/10/traversal-algorithms-using-generics-generic-constraints-where-and-action-delegates/">an article on traversal algorithms</a> using delegates. One of the commenters (I'm looking at you Mart) mentioned a different approach using the <a href="http://msdn.microsoft.com/en-us/library/9k7k7cf0(VS.80).aspx">yield</a> keyword, which generates a state machine underneath.

I had heard of the yield keyword before, but I've never used it so far. I was thrilled to work out his comment, to find out how it works, et voila ,this blog-post was written.

I first wrote this generic Node class which allowed me to build a tree like structure.
{% highlight csharp %}
    public class Node<T>
    {
        public Node(T self, List<Node<T>> children)
        {
            this.self = self;
            this.children = children;
        }
        public T self;
        public List<Node<T>> children;
    }
{% endhighlight %}

Depth first traversal of this tree is easily done using yield.
{% highlight csharp %}
        public static IEnumerable<T> Traverse<T>(Node<T> root)
        {
            Stack<Node<T>> stack = new Stack<Node<T>>();
            stack.Push(root);
            while (stack.Count > 0)
            {
                Node<T> n = stack.Pop();
                yield return n.self;
                foreach (Node<T> child in n.children)
                {
                    stack.Push(child);
                }
            }
        }
{% endhighlight %}

When compiled, this piece of code generates a thread-safe state machine (very nifty) but thanks to the abstraction that yield gives us we don't have to worry about. We can just interact with this method as if the result is an IEnumerable<T> (as indicated/expected), so we can use this method like this:
{% highlight csharp %}
                foreach (int i in DepthFirstTraversal.Traverse<int>(rootNode))
                {
                     //DoSomethingWith(i);
                }
{% endhighlight %}

But what are the performance implications of this hidden state machine? To test this I've adapted the previous post's traversal algorithm to be as similar as possible:
{% highlight csharp %}
        public static void Traverse<T>(Node<T> root, Action<T> action) 
        {
            Stack<Node<T>> stack = new Stack<Node<T>>();            
            stack.Push(root);

            while (stack.Count > 0)
            {
                Node<T> n = stack.Pop();
                action(n.self);
                foreach (Node<T> child in n.children)
                {
                    stack.Push(child);
                }
            }
        }
{% endhighlight %}

Performing a given action for each item in our tree (depth first) is done like this:
{% highlight csharp %}
DepthFirstTraversal.Traverse<int>(rootNode, (i) => DoSomethingWith(i));
{% endhighlight %}

Using a recursive algorithm I constructed a tree (of ints) with a depth of 10, where each node has 2 child nodes. I then benchmarked how long it took to add each item in the tree to a list like this:
{% highlight csharp %}
List<int> results = new List<int>(41);
//Yield approach
                foreach (int i in DepthFirstTraversal.Traverse<int>(rootNode))
                {
                    results.Add(i);
                }
//Action approach
                DepthFirstTraversal.Traverse<int>(rootNode, (i) => results.Add(i));
{% endhighlight %}

After 100.000 iterations the result was the following:
{% highlight csharp %}
Average milliseconds for yield approach:            0.01265
Average milliseconds for delegate/Action<> approach 0.00578
{% endhighlight %}

So the yield approach is more then two times as slow as the delegate approach to a depth first traversal, which isn't surprising since we're talking state machine vs method+virtual lookup. Still it was interesting to see how yield works. For more in depth info about yield see <a href="http://csharpindepth.com/Articles/Chapter6/IteratorBlockImplementation.aspx">this article</a> by Jon Skeet.

See the code for this benchmark <a href="http://pastebin.com/wRZCRY8s">here</a>
