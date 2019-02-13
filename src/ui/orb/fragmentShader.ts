const fragmentShader = `
precision mediump float;

uniform float u_scroll;
uniform float u_level;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_color;
uniform sampler2D u_image;

varying vec2 v_texCoord;

vec4 white = vec4(1., 1., 1., 1.);

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

void main() {
  vec2 coordNorm = gl_FragCoord.xy / u_resolution.xy;
  float level = step(coordNorm.y, u_level);
  float texOffset = 0.25;
    
  vec2 scroll1 = vec2(v_texCoord.x            , v_texCoord.y + u_time / 8.);
  vec2 scroll2 = vec2(v_texCoord.x - texOffset, v_texCoord.y + u_time / 6.);
  vec2 scroll3 = vec2(v_texCoord.x + texOffset, v_texCoord.y + u_time / 4.);
  
  vec4 tex1 = texture2D(u_image, scroll1);
  vec4 tex2 = texture2D(u_image, scroll2); 
  vec4 tex3 = texture2D(u_image, scroll3);
  
  float distance = distance(v_texCoord, vec2(0.5, 0.5));
  float stepDistance = step(distance, 0.5);
  
  vec4 topLine = levelLine() * stepDistance;   
  
  vec4 outline = outline(distance, stepDistance);
  
  vec4 allTex = (tex1 + tex2 + tex3) / 3.;
  
  gl_FragColor = u_color * allTex * stepDistance * level + topLine + outline;
}
`;

export default fragmentShader;
