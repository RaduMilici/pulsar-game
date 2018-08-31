import GameObject from './GameObject';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import Rooms from './room/Rooms';
import Navigation from '../nav/Navigation';

export default class Level extends GameObject {
  readonly rooms: Rooms;
  private readonly quadTree: QuadTree;
  private readonly navigation: Navigation;

  constructor(private points: Vector[], readonly boundingBox: BoundingBox) {
    super();
    this.quadTree = new QuadTree(this.shape, points);
    this.navigation = new Navigation(this);
    this.rooms = new Rooms(this);
    //this.navigation.debugPathfinding();
    this.add(this.rooms);
  }

  get shape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
