const fragmentShader = `
precision mediump float;

void main() {
  float x = sin(gl_FragCoord.x / 3.);
  float z = sin(gl_FragCoord.y / 3.);
  gl_FragColor = vec4(x, 0., z, 1.);
}
`;

export default fragmentShader;
