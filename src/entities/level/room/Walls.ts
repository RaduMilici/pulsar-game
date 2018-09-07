import { Line, Shape, Vector } from 'pulsar-pathfinding';
import { Intersection, Raycaster, Vector3 } from 'three';
import { toVec3 } from 'util';
import { wall } from 'const';
import CorridorLine from 'entities/level/corridor/CorridorLine';
import GameObject from 'entities/GameObject';
import Wall from './Wall';

export default class Walls extends GameObject {
  readonly walls: Wall[] = [];

  private static raycasterHeight: number = wall.height / 2;

  constructor(private shape: Shape, private mstLines: Line[]) {
    super();
    this.walls = this.makeWalls();
    this.makeHoles();
    this.add(...this.walls);
  }

  makeHoles(): void {
    this.mstLines.forEach((line: CorridorLine) => {
      const raycaster = Walls.makeRaycaster(line);

      this.walls.forEach((wall: Wall) => {
        const raycast: Intersection[] = raycaster.intersectObject(wall, true);
        raycast.forEach(({ uv }: any) => wall.addHole(uv));
      });
    });
  }

  intersect(line: CorridorLine): Vector[] {
    return this.walls.map((wall: Wall) => wall.intersect(line));
  }

  private static makeRaycaster({ a, b, length }: Line): Raycaster {
    const aV3: Vector3 = toVec3(a, Walls.raycasterHeight);
    const bV3: Vector3 = toVec3(b, Walls.raycasterHeight);

    const direction: Vector3 = bV3.sub(aV3).normalize();
    return new Raycaster(aV3, direction, 0, length);
  }

  private makeWalls(): Wall[] {
    return this.shape.lines.map((line: Line) => new Wall(line, this.mstLines, this.shape));
  }
}
