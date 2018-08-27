import GameObject from '../GameObject';
import Wall from './Wall';
import { QuadTree, Line, Shape, Vector } from 'pulsar-pathfinding';
import { Intersection, Raycaster, Vector3 } from 'three';
import toVec3 from '../../util/toVec3';
import CorridorLine from '../corridors/CorridorLine';

export default class Walls extends GameObject {
  static height: number = 1;
  static extraWidth: number = 0.1;
  static doorWidth: number = 0.5;
  static doorFrameWidth: number = 0.2;

  readonly intersections: Vector[] = [];

  readonly walls: Wall[] = [];
  private readonly shape: Shape;

  constructor({ shape }: QuadTree, private readonly mstLines: Line[]) {
    super();
    this.shape = shape;
    this.walls = this.makeWalls();
    this.add(...this.walls);
  }

  makeHoles(): void {
    this.mstLines.forEach((line: Line) => {
      const raycaster = Walls.makeRaycaster(line);

      this.walls.forEach((wall: Wall) => {
        const raycast: Intersection[] = raycaster.intersectObject(wall, true);
        raycast.forEach(({ uv }: any) => wall.addHole(uv));
      });
    });
  }

  private static makeRaycaster({ a, b, length }: Line): Raycaster {
    const aV3: Vector3 = toVec3(a, Walls.height / 2);
    const bV3: Vector3 = toVec3(b, Walls.height / 2);

    const direction: Vector3 = bV3
      .clone()
      .sub(aV3)
      .normalize();
    return new Raycaster(aV3, direction, 0, length);
  }

  private makeWalls(): Wall[] {
    return this.shape.lines.map(
      (line: Line) => new Wall(line, this.mstLines, this.shape)
    );
  }
}
