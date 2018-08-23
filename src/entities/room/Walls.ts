import GameObject from '../GameObject';
import Wall from './Wall';
import { QuadTree, Line } from 'pulsar-pathfinding';

export default class Walls extends GameObject {
  static height: number = 1;
  static doorWidth: number = 1;
  readonly walls: Wall[] = [];

  constructor({ shape }: QuadTree, private readonly mstLines: Line[]) {
    super();

    this.walls = shape.lines.map(
      (line: Line) => new Wall(line, mstLines, shape.centroid)
    );

    this.add(...this.walls);
  }
}
