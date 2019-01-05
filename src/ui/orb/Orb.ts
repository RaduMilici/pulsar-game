import { size, tickData } from 'pulsar-pathfinding';
import CanvasShader from 'components/shaders/CanvasShader';
import NoiseImage from './NoiseImage';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

export default class Orb extends CanvasShader {
  private scrollLocation: WebGLUniformLocation;
  private levelLocation: WebGLUniformLocation;
  private resolutionLocation: WebGLUniformLocation;
  private texCoordLocation: number;
  private texCoordBuffer: WebGLBuffer;
  private level: number;
  private noiseImage: NoiseImage;

  constructor(size: size) {
    super(size, vertexShader, fragmentShader);
    this.getLocations();
    this.gl.uniform2f(this.resolutionLocation, this.size.width, this.size.height);
    this.level = 0;
    this.noiseImage = new NoiseImage(size);
    this.bindTexture();
    this.noiseImage.image.onload = () => this.render();
  }

  private render(): void {
    this.uploadTexture();
    app3D.add(this);
    document.body.appendChild(this.canvas);
  }

  update(tickData: tickData): void {
    this.level += tickData.deltaTime;
    this.gl.uniform1f(this.scrollLocation, tickData.elapsedTime * 10);
    this.gl.uniform1f(this.levelLocation, Math.abs(Math.sin(this.level)));
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  private getLocations(): void {
    this.scrollLocation = this.gl.getUniformLocation(this.program, 'u_scroll');
    this.levelLocation = this.gl.getUniformLocation(this.program, 'u_level');
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
  }

  private bindTexture(): void {
    // provide texture coordinates for the rectangle
    this.texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1, -1, -1, 1, 1]),
      this.gl.STATIC_DRAW
    );
    this.gl.enableVertexAttribArray(this.texCoordLocation);
    this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    // create a texture
    const texture: WebGLTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // set the parameters so we can render any size image
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
  }

  private uploadTexture(): void {
    // upload the image into the texture
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.noiseImage.image
    );
  }
}
