import { Vector, QuadTree } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import Floor from './Floor';
import Walls from './Walls';

export default class Room extends GameObject {
  private readonly quadTree: QuadTree;
  constructor({ quadTree }: Vector) {
    super();

    this.quadTree = quadTree;
    const floor: Floor = new Floor(quadTree);
    const walls: Walls = new Walls(quadTree);

    this.add(floor, walls);
  }

  get centroid(): Vector {
    return this.quadTree.shape.centroid;
  }
}
