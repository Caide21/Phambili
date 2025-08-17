// lib/visualizer/shaders.js
// Fragment shader implementing psychedelic visual effects
// Radial kaleidoscope sampling, breathing zoom, chromatic aberration, grain/noise overlay, palette rotation

export const fragmentShader = `
  precision highp float;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_intensity;
  uniform float u_zoom;
  uniform float u_kaleidoSegments;
  uniform float u_chromaShift;
  uniform float u_noise;
  uniform float u_hueShift;
  
  // Noise functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // Convert HSV to RGB
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  // Kaleidoscope function
  vec2 kaleidoscope(vec2 uv, float segments) {
    vec2 p = uv - 0.5;
    float angle = atan(p.y, p.x);
    float radius = length(p);
    
    // Fold angle into segments
    float segmentAngle = 2.0 * 3.14159 / segments;
    angle = mod(angle, segmentAngle);
    if (angle > segmentAngle * 0.5) {
      angle = segmentAngle - angle;
    }
    
    return vec2(cos(angle), sin(angle)) * radius + 0.5;
  }
  
  // Breathing zoom effect
  float breathingZoom(float time) {
    return 1.0 + 0.1 * sin(time * 0.5) * u_intensity;
  }
  
  // Chromatic aberration helper
  vec3 applyChromaticAberration(vec3 color, vec2 uv, float shift) {
    if (shift <= 0.0) return color;
    
    // Create color separation effect
    vec2 offset = vec2(shift * 0.01, 0.0);
    vec3 chroma = vec3(
      color.r * (1.0 + shift * 0.2),
      color.g,
      color.b * (1.0 + shift * 0.2)
    );
    return mix(color, chroma, shift * 0.5);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centered = uv - 0.5;
    
    // Apply breathing zoom
    float zoom = u_zoom * breathingZoom(u_time);
    centered *= zoom;
    
    // Apply kaleidoscope
    vec2 kaleidUV = kaleidoscope(centered + 0.5, u_kaleidoSegments);
    
    // Warp the domain with time-based distortion
    float warp = u_intensity * 0.3;
    kaleidUV += vec2(
      sin(kaleidUV.y * 3.0 + u_time) * warp,
      cos(kaleidUV.x * 3.0 + u_time * 0.7) * warp
    );
    
    // Generate base color from position and time
    float angle = atan(kaleidUV.y - 0.5, kaleidUV.x - 0.5);
    float radius = length(kaleidUV - 0.5);
    
    // Create smooth color palette
    float hue = (angle + 3.14159) / (2.0 * 3.14159) + u_time * 0.1 + u_hueShift;
    float saturation = 0.8 + 0.2 * sin(u_time * 0.3);
    float value = 0.6 + 0.4 * sin(radius * 10.0 - u_time * 2.0);
    
    // Apply intensity scaling
    value *= (0.3 + 0.7 * u_intensity);
    
    vec3 color = hsv2rgb(vec3(hue, saturation, value));
    
    // Add chromatic aberration
    color = applyChromaticAberration(color, kaleidUV, u_chromaShift);
    
    // Add noise/grain
    if (u_noise > 0.0) {
      float grain = noise(gl_FragCoord.xy + u_time * 100.0) * 2.0 - 1.0;
      color += grain * u_noise * 0.2;
    }
    
    // Add subtle vignette
    float vignette = 1.0 - length(centered) * 0.5;
    color *= vignette;
    
    // Clamp final color
    color = clamp(color, 0.0, 1.0);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Fallback shader for reduced motion
export const reducedMotionShader = `
  precision highp float;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_intensity;
  uniform float u_zoom;
  uniform float u_kaleidoSegments;
  uniform float u_hueShift;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centered = uv - 0.5;
    
    // Very gentle zoom
    centered *= u_zoom * (1.0 + 0.02 * sin(u_time * 0.1));
    
    // Simple kaleidoscope
    float angle = atan(centered.y, centered.x);
    float radius = length(centered);
    
    float segmentAngle = 2.0 * 3.14159 / u_kaleidoSegments;
    angle = mod(angle, segmentAngle);
    if (angle > segmentAngle * 0.5) {
      angle = segmentAngle - angle;
    }
    
    vec2 kaleidUV = vec2(cos(angle), sin(angle)) * radius + 0.5;
    
    // Gentle color palette
    float hue = (angle + 3.14159) / (2.0 * 3.14159) + u_hueShift;
    float saturation = 0.6;
    float value = 0.5 + 0.3 * sin(radius * 5.0);
    
    vec3 color = hsv2rgb(vec3(hue, saturation, value));
    
    // Very subtle vignette
    float vignette = 1.0 - length(centered) * 0.3;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;
