import { Vector, QuadTree, Line, Shape } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import Floor from './Floor';
import Walls from './Walls';
import CorridorLine from '../corridors/CorridorLine';

export default class Room extends GameObject {
  readonly area: number;
  readonly quadTree: QuadTree;

  private walls: Walls;
  private readonly floor: Floor;

  constructor({ quadTree }: Vector, isContained: boolean = false) {
    super();

    this.quadTree = quadTree;
    this.area = quadTree.shape.boundingBox.area;
    this.floor = new Floor(quadTree);
    if (!isContained) {
      this.add(this.floor);
    }
  }

  get centroid(): Vector {
    return this.quadTree.shape.centroid;
  }

  intersect(line: CorridorLine): Vector[] {
    const intersections: Vector[] = this.walls.intersect(line);
    return intersections.filter((i: Vector) => i !== null);
  }

  makeWalls(mstLines: Line[]): void {
    this.walls = new Walls(this.quadTree, mstLines);
    this.add(this.walls);
  }
}
