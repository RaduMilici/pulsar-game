import GameObject from './GameObject';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import Rooms from './room/Rooms';
import MST from './corridors/MST';
import Corridors from './corridors/Corridors';
import Navigation from '../nav/Navigation';

export default class Level extends GameObject {
  readonly rooms: Rooms;
  readonly mst: MST;
  readonly corridors: Corridors;
  private readonly quadTree: QuadTree;
  private readonly navigation: Navigation;

  constructor(private points: Vector[], readonly boundingBox: BoundingBox) {
    super();
    this.quadTree = new QuadTree(this.shape, points);
    this.rooms = new Rooms(points);
    this.mst = new MST(this);
    this.rooms.makeWalls(this.mst);
    this.corridors = new Corridors(this.mst, this.rooms);
    this.navigation = new Navigation(this);
    this.add(this.rooms, this.mst, this.corridors);
  }

  get shape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
