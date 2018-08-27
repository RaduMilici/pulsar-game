import GameObject from '../GameObject';
import Wall from './Wall';
import { QuadTree, Line, randomColor, Shape } from 'pulsar-pathfinding';
import { Intersection, Raycaster, Vector3 } from 'three';
import toVec3 from '../../util/toVec3';

export default class Walls extends GameObject {
  static height: number = 1;
  static extraWidth: number = 0.1;
  static doorWidth: number = 1;
  readonly walls: Wall[] = [];
  private readonly shape: Shape;

  constructor({ shape }: QuadTree, private readonly mstLines: Line[]) {
    super();
    this.shape = shape;
    this.walls = this.makeWalls();
    this.makeHoles();
    this.add(...this.walls);
  }

  private makeWalls(): Wall[] {
    const color: string = randomColor();

    return this.shape.lines.map((line: Line) => {
      const wall: Wall = new Wall(line, this.mstLines, this.shape);
      wall.debugColor = color;
      wall.create();
      return wall;
    });
  }

  private makeHoles(): void {
    this.mstLines.forEach(({ a, b, length }: Line) => {
      const aV3: Vector3 = toVec3(a, Walls.height / 2);
      const bV3: Vector3 = toVec3(b, Walls.height / 2);

      const direction: Vector3 = bV3
        .clone()
        .sub(aV3)
        .normalize();
      const raycaster: Raycaster = new Raycaster(aV3, direction, 0, length);

      this.walls.forEach((wall: Wall) => {
        const i: Intersection[] = raycaster.intersectObject(wall, true);
        i.forEach(({ uv }: any) => wall.addHole(uv));
      });
    });
  }
}
