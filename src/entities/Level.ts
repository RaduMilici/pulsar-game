import GameObject from './GameObject';
import Cube from './Cube';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import { toVec3 } from '../util';
import Rooms from './room/Rooms';
import MST from './corridors/MST';
import Corridors from './corridors/Corridors';
import CorridorLine from './corridors/CorridorLine';

export default class Level extends GameObject {
  readonly rooms: Rooms;
  readonly mst: MST;
  readonly corridors: Corridors;

  private readonly shape: Shape;
  private readonly quadTree: QuadTree;
  private readonly boundingBox: BoundingBox;

  constructor(readonly points: Vector[]) {
    super();
    this.boundingBox = new BoundingBox(points);
    this.boundingBox.grow(1);
    this.shape = this.makeShape();
    this.quadTree = new QuadTree(this.shape, points);
    this.rooms = new Rooms(points);
    this.mst = new MST(this);
    this.rooms.makeWalls(this.mst);
    //this.corridors = new Corridors(this.mst, this.rooms);
    this.add(this.rooms, this.mst);
  }

  private makeShape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
