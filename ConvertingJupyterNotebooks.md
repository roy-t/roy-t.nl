# Converting Jupyter notebooks to posts

1. Export as markdown
2. Add the standard front matter (see other posts)
3. Include require.min.js by adding the following code to the first line of the markdown content:
```
<script src="{{site.url}}/files/require.min.js"></script>
```
4. Replace all references to `https://cdn.plot.ly/plotly-1.49.2.min` with `{{site.url}}/files/plotly`

The markdown should now render and the charts should show up. The page should not have to load any external files (except for the counter of course).