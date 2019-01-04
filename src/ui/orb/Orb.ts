import { size, tickData } from 'pulsar-pathfinding';
import CanvasShader from 'components/shaders/CanvasShader';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

export default class Orb extends CanvasShader {
  private scrollLocation: WebGLUniformLocation;
  private levelLocation: WebGLUniformLocation;
  private resolutionLocation: WebGLUniformLocation;
  private level: number;

  constructor(size: size) {
    super(size, vertexShader, fragmentShader);
    this.getUniformLocations();
    this.gl.uniform2f(this.resolutionLocation, this.size.width, this.size.height);
    this.level = 0;
    document.body.appendChild(this.canvas);
  }

  update(tickData: tickData): void {
    this.level += tickData.deltaTime;
    this.gl.uniform1f(this.scrollLocation, tickData.elapsedTime * 10);
    this.gl.uniform1f(this.levelLocation, Math.abs(Math.sin(this.level)));
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  private getUniformLocations(): void {
    this.scrollLocation = this.gl.getUniformLocation(this.program, 'u_scroll');
    this.levelLocation = this.gl.getUniformLocation(this.program, 'u_level');
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
  }
}
