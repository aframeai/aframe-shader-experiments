# A-Frame Shader Experiments

Using fragment shaders to embed implicit geometries (defined by [signed distance functions](https://iquilezles.org/www/articles/distfunctions/distfunctions.htm)) seamlessly into a poly-mesh world...

# raytrace.js

This script extends upon the [aframe-raytrace-component](https://github.com/omgitsraven/aframe-raytrace-component) by Andrew Fraticelli.

Currently using custom versions of this component in each experiment to accomodate for different attributes / uniforms such as `time` or `color`...

# Shader Code

- [cube](cube) — hello world template to get you started
- [blob](blob) — taken directly from the examples of aframe-raytrace-component.
- [rings](rings) — a variation of the blob shader feat. rotating donuts rather than blobs
- [mandelbulb](mandelbubl) — the infamous Mandelbulb in a version crafted by Ingo Quiliez adapted to work with `raytrace.js`

# License

MIT licensed.

© 2017 Andrew Fraticelli  
© 2020 @bitcraftlab
