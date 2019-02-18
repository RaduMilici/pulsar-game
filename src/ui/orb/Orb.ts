import { size, tickData } from 'pulsar-pathfinding';
import { color } from 'types';
import CanvasShader from 'components/shaders/CanvasShader';
import NoiseImage from './NoiseImage';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';
import { ORB_CONTAINER } from 'const';

export default class Orb extends CanvasShader {
  private scrollLocation: WebGLUniformLocation;
  private levelLocation: WebGLUniformLocation;
  private colorLocation: WebGLUniformLocation;
  private resolutionLocation: WebGLUniformLocation;
  private timeLocation: WebGLUniformLocation;
  private texCoordLocation: number;
  private texCoordBuffer: WebGLBuffer;
  private time: number;
  private noiseImage: NoiseImage;
  private readonly level: number;

  constructor(size: size, color: color) {
    super(size, vertexShader, fragmentShader);
    this.getLocations();
    this.gl.uniform2f(this.resolutionLocation, this.size.width, this.size.height);
    this.gl.uniform4f(this.colorLocation, color.r, color.g, color.b, color.a);
    this.level = 1;
    this.time = 0;
    this.noiseImage = new NoiseImage(size);
    this.bindTexture();
    this.noiseImage.image.onload = () => this.render();
    ORB_CONTAINER.appendChild(this.canvas);
  }

  private render(): void {
    this.uploadTexture();
    app3D.add(this);
  }

  update({ deltaTime }: tickData): void {
    this.time += deltaTime;
    this.gl.uniform1f(this.timeLocation, this.time);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  setLevel(level: number): void {
    this.gl.uniform1f(this.levelLocation, level);
  }

  private getLocations(): void {
    this.scrollLocation = this.gl.getUniformLocation(this.program, 'u_scroll');
    this.levelLocation = this.gl.getUniformLocation(this.program, 'u_level');
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    this.colorLocation = this.gl.getUniformLocation(this.program, 'u_color');
    this.texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
  }

  private bindTexture(): void {
    // provide texture coordinates for the rectangle
    this.texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0]),
      this.gl.STATIC_DRAW
    );
    this.gl.enableVertexAttribArray(this.texCoordLocation);
    this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    // create a texture
    const texture: WebGLTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // set the parameters so we can render any size image
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
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
