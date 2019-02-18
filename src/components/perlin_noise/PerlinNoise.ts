import { size } from 'pulsar-pathfinding';
// import { lerp, randomVector2 } from 'util';
import Canvas from 'components/shaders/Canvas';
import PerlinNoiseGrid from './PerlinNoiseGrid';

export default class PerlinNoise extends Canvas {
  grid: PerlinNoiseGrid;

  constructor(size: size) {
    super(size);
    this.grid = new PerlinNoiseGrid(size);
  }

  private dotGridGradient(): number {
    return 0;
  }
}
