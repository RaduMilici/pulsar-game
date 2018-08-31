import { Vector, QuadTree, Shape } from 'pulsar-pathfinding';
import GameObject from '../../GameObject';
import Floor from './Floor';
import Walls from './Walls';
import CorridorLine from '../corridor/CorridorLine';
import Navigation from '../../../nav/Navigation';
import { Vector3 } from 'three';
import { toVec3 } from '../../../util';

export default class Room extends GameObject {
  quadTree: QuadTree;
  readonly area: number;

  walls: Walls;
  readonly floor: Floor;

  constructor(readonly shape: Shape, private readonly navigation: Navigation) {
    super();

    this.area = shape.boundingBox.area;
    this.floor = new Floor(shape);
    this.add(this.floor);
  }

  get centroid(): Vector {
    return this.shape.centroid;
  }

  get centroidV3(): Vector3 {
    return toVec3(this.centroid);
  }

  addNavData() {
    this.navigation.clearRoom(this);
  }

  intersect(line: CorridorLine): Vector[] {
    const intersections: Vector[] = this.walls.intersect(line);
    return intersections.filter((i: Vector) => i !== null);
  }

  makeWalls(mstLines: CorridorLine[]): void {
    this.walls = new Walls(this.shape, mstLines);
    this.add(this.walls);
  }
}
