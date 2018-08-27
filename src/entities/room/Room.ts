import { Vector, QuadTree, Line } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import Floor from './Floor';
import Walls from './Walls';

export default class Room extends GameObject {
  private walls: Walls;
  private readonly quadTree: QuadTree;
  private readonly floor: Floor;

  constructor({ quadTree }: Vector) {
    super();

    this.quadTree = quadTree;
    this.floor = new Floor(quadTree);

    this.add(this.floor);
  }

  get centroid(): Vector {
    return this.quadTree.shape.centroid;
  }

  makeWalls(mstLines: Line[]): void {
    this.walls = new Walls(this.quadTree, mstLines);
    this.add(this.walls);
  }
}
