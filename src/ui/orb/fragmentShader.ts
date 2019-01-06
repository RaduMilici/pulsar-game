const fragmentShader = `
precision mediump float;

uniform float u_scroll;
uniform float u_level;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_image;

varying vec2 v_texCoord;

void main() {
  vec2 coordNorm = gl_FragCoord.xy / u_resolution.xy;
  float level = step(coordNorm.y, u_level);
  float texOffset = 0.25;
    
  vec2 scroll1 = vec2(v_texCoord.x,             v_texCoord.y + u_time / 8.);
  vec2 scroll2 = vec2(v_texCoord.x - texOffset, v_texCoord.y + u_time / 6.);
  vec2 scroll3 = vec2(v_texCoord.x + texOffset, v_texCoord.y + u_time / 4.);
  
  vec4 tex1 = texture2D(u_image, scroll1);
  vec4 tex2 = texture2D(u_image, scroll2); 
  vec4 tex3 = texture2D(u_image, scroll3);
 
  vec4 allTex = (tex1 + tex2 + tex3) / 3.;
  vec4 colorTex = vec4(0., 0., 1., 1.) * allTex; 
  
  gl_FragColor = colorTex * level;
}
`;

export default fragmentShader;
