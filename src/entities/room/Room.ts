import { Vector, QuadTree, Line, Shape } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import Floor from './Floor';
import Walls from './Walls';
import CorridorLine from '../corridors/CorridorLine';

export default class Room extends GameObject {
  quadTree: QuadTree;
  readonly area: number;

  private walls: Walls;
  private readonly floor: Floor;

  constructor(private readonly shape: Shape, isContained: boolean = false) {
    super();

    this.area = shape.boundingBox.area;
    this.floor = new Floor(shape);
    if (!isContained) {
      this.add(this.floor);
    }
  }

  get centroid(): Vector {
    return this.shape.centroid;
  }

  intersect(line: CorridorLine): Vector[] {
    const intersections: Vector[] = this.walls.intersect(line);
    return intersections.filter((i: Vector) => i !== null);
  }

  makeWalls(mstLines: Line[]): void {
    this.walls = new Walls(this.shape, mstLines);
    this.add(this.walls);
  }
}
