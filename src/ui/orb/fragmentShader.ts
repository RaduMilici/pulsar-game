const fragmentShader = `
precision mediump float;

uniform float u_scroll;
uniform float u_level;
uniform vec2 u_resolution;

void main() {
  vec2 coordNorm = gl_FragCoord.xy / u_resolution.xy;
  float x = sin(gl_FragCoord.x / 3.);
  float z = sin(gl_FragCoord.y / 3. - u_scroll);
  vec4 color = vec4(x, 0., z, 1.);
  float border = step(coordNorm.y, u_level);
  gl_FragColor = color * border;
}
`;

export default fragmentShader;
