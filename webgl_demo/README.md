# Local development

For local development its very important to run a webserver that allows us to disable the browser's cache. Otherwise the browser will not notice that shaders have changed since the server gives a 304 on the unchanged index.html file. One tool that let's use do that is `dotnet-serve`:

Install [dotnet-serve](https://github.com/natemcmaster/dotnet-serve):

```
dotnet tool install --global dotnet-serve
```

Run `dotnet-serve` it will pick up the configuration from the `.netconfig` file which configures the cache control header and some other options.

# Sources

- https://developer.mozilla.org/en-US/docs/web/api/webgl_api/tutorial/getting_started_with_webgl
- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
- https://glmatrix.net (version 3.4.0)
- https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html