import GameObject from '../GameObject';
import Wall from './Wall';
import { QuadTree, Line, randomColor } from 'pulsar-pathfinding';

export default class Walls extends GameObject {
  static height: number = 1;
  static thickness: number = 0.1;
  static doorWidth: number = 1;
  readonly walls: Wall[] = [];

  constructor({ shape }: QuadTree, private readonly mstLines: Line[]) {
    super();

    const color: string = randomColor();

    this.walls = shape.lines.map((line: Line) => {
      const wall: Wall = new Wall(line, mstLines, shape);
      wall.debugColor = color;
      wall.create();
      return wall;
    });

    this.add(...this.walls);
  }
}
