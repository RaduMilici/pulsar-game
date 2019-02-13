const fragmentShader = `
precision mediump float;

uniform float u_scroll;
uniform float u_level;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_color;
uniform sampler2D u_image;

varying vec2 v_texCoord;

const vec4 white = vec4(1., 1., 1., 1.);
const float PI = 3.1415926535;

bool isUnderLevel(float thickness) {
  return 1. - u_level > v_texCoord.y && 1. - u_level < v_texCoord.y + thickness;
}

vec4 levelLine() {
  float thickness = 0.01;
  
  if (isUnderLevel(thickness)) { 
    return white;
  }
  return vec4(0., 0., 0., 0.);
}

vec4 outline(float distance, float stepDistance) {
  float thickness = 0.49;
  
  if (isUnderLevel(1.)) { 
    return vec4(0., 0., 0., 0.);   
  }
  return (white * (1. - step(distance, thickness))) * stepDistance;  
}

vec2 fishEye(vec2 uv) {
  float aperture = 190.0;
  float apertureHalf = 0.5 * aperture * (PI / 180.0);
  float maxFactor = sin(apertureHalf);
  
  vec2 fishEyeUv;
  
  vec2 xy = 2.0 * v_texCoord.xy - 1.0;
  
  float d = length(xy);
  
  if (d < (2.0-maxFactor)) {
    d = length(xy * maxFactor);
    float z = sqrt(1.0 - d * d);
    float r = atan(d, z) / PI;
    float phi = atan(xy.y, xy.x);
    
    fishEyeUv.x = r * cos(phi) + 0.5;
    fishEyeUv.y = r * sin(phi) + 0.5;
  } else {
    fishEyeUv = v_texCoord.xy;
  }
  
  return fishEyeUv;
}

void main() {
  vec2 coordNorm = gl_FragCoord.xy / u_resolution.xy;
  float level = step(coordNorm.y, u_level);
  float distance = distance(v_texCoord, vec2(0.5, 0.5));
  float stepDistance = step(distance, 0.5);
      
  vec2 fishEyeScroll = fishEye(v_texCoord);
  vec4 tex = texture2D(u_image, vec2(fishEyeScroll.x, fishEyeScroll.y + u_time * 0.2));  
  vec4 topLine = levelLine() * stepDistance;
  vec4 outline = outline(distance, stepDistance);
    
  gl_FragColor = u_color * tex * stepDistance * level + topLine + outline;
}
`;

export default fragmentShader;
