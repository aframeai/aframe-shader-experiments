# A-Frame Shader Experiments

Using fragment shaders to embed implicit geometries (defined by [signed distance functions](https://iquilezles.org/www/articles/distfunctions/distfunctions.htm)) seamlessly into a poly-mesh world...

![screenshot-mandelbulb](https://user-images.githubusercontent.com/720669/94386437-f0408c80-0147-11eb-8643-51a823e14022.jpg)

# raytrace.js

This script extends upon the [aframe-raytrace-component](https://github.com/omgitsraven/aframe-raytrace-component) by Andrew Fraticelli.

Currently using custom versions of this component in each experiment  
to accomodate for different attributes / uniforms such as `time` or `color`...

# Shader Code

- [cube](cube) — hello world template to get you started
- [blob](blob) — taken directly from the examples of aframe-raytrace-component.
- [rings](rings) — a variation of the blob shader feat. rotating donuts rather than blobs
- [mandelbulb](mandelbulb) — the infamous Mandelbulb in a version crafted by Ingo Quiliez  
  adapted to work with `raytrace.js`

# License

All code except for the Mandelbulb code is MIT licensed.

© 2017 Andrew Fraticelli  
© 2020 @bitcraftlab

## Mandelbulb Code

[CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/) licensed.

© 2013 inigo quilez  
© 2020 @bitcraftlab
