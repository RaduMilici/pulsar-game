import { Vector, QuadTree, Line } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import Floor from './Floor';
import Walls from './Walls';

export default class Room extends GameObject {
  readonly area: number;
  private walls: Walls;
  readonly quadTree: QuadTree;
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

  makeWalls(mstLines: Line[]): void {
    this.walls = new Walls(this.quadTree, mstLines);
    this.add(this.walls);
  }
}
