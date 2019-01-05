import { size } from 'pulsar-pathfinding';
import Canvas from './Canvas';

export default class CanvasShader extends Canvas {
  private readonly vertexShader: WebGLShader;
  private readonly fragmentShader: WebGLShader;
  protected program: WebGLProgram;
  protected gl: WebGLRenderingContext;

  constructor(size: size, vertexShaderSrc: string, fragmentShaderSrc: string) {
    super(size);
    this.gl = this.canvas.getContext('webgl');
    this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSrc);
    this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSrc);
    this.program = this.createProgram(this.vertexShader, this.fragmentShader);
    this.gl.useProgram(this.program);
    this.gl.viewport(0, 0, size.width, size.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.setupBuffer();
    this.setupAttribute();
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader: WebGLShader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    const success: boolean = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

    if (success) {
      return shader;
    }

    const errorText: string = this.gl.getShaderInfoLog(shader);
    this.gl.deleteShader(shader);
    throw new Error(errorText);
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program: WebGLProgram = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    const success: boolean = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

    if (success) {
      return program;
    }

    const errorText: string = this.gl.getProgramInfoLog(program);
    this.gl.deleteProgram(program);
    throw new Error(errorText);
  }

  private setupBuffer(): void {
    const positionBuffer: WebGLBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    // two triangles that cover the drawing area
    const positions: number[] = [-1, -1, -1, 1, 1, 1, 1, -1, -1, -1, 1, 1];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
  }

  private setupAttribute(): void {
    const size: number = 2;
    const type: number = this.gl.FLOAT;
    const normalize: boolean = false;
    const stride: number = 0;
    const offset: number = 0;
    const positionAttributeLocation: number = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  }
}
