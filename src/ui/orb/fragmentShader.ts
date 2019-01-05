const fragmentShader = `
precision mediump float;

uniform float u_scroll;
uniform float u_level;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_image;

varying vec2 v_texCoord;

void main() {
  //grid
  /*vec2 coordNorm = gl_FragCoord.xy / u_resolution.xy;
  float x = sin(gl_FragCoord.x / 3.);
  float z = sin(gl_FragCoord.y / 3. - u_scroll);
  vec4 color = vec4(x, 0., z, 1.);
  float border = step(coordNorm.y, u_level);
  gl_FragColor = color * border;*/
  
  //blur
  float strength = 5.;
  vec2 onePixel = vec2(1., 1.) / u_resolution;
  vec2 scroll1 = vec2(v_texCoord.x, v_texCoord.y + u_time / 8.);
  vec2 scroll2 = vec2(v_texCoord.x, v_texCoord.y + u_time / 6.);
  vec2 scroll3 = vec2(v_texCoord.x, v_texCoord.y + u_time / 4.);
  vec4 tex1 = texture2D(u_image, scroll1); // + color * border
  vec4 tex2 = texture2D(u_image, scroll2 + vec2(onePixel.x * strength, 0.)); 
  vec4 tex3 = texture2D(u_image, scroll3 + vec2(-onePixel.x * strength, 0.)); 
  
  gl_FragColor = (tex1 + tex2 + tex3) / 3.;
}
`;

export default fragmentShader;
