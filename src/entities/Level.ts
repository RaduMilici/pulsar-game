import GameObject from './GameObject';
import Cube from './Cube';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import { toVec3 } from '../util';
import Rooms from './room/Rooms';
import MST from './corridors/MST';
import Corridors from './corridors/Corridors';
import Room from './room/Room';
import Navigation from '../nav/Navigation';

export default class Level extends GameObject {
  readonly rooms: Rooms;
  readonly mst: MST;
  readonly corridors: Corridors;

  private readonly shape: Shape;
  private readonly quadTree: QuadTree;
  private readonly pointsBoundingBox: BoundingBox;
  private readonly navigation: Navigation;

  constructor(readonly points: Vector[], readonly boundingBox: BoundingBox) {
    super();
    this.pointsBoundingBox = new BoundingBox(points);
    this.pointsBoundingBox.grow(1);
    this.shape = this.makeShape();
    this.quadTree = new QuadTree(this.shape, points);
    this.rooms = new Rooms(points);
    this.mst = new MST(this);
    this.rooms.makeWalls(this.mst);
    this.corridors = new Corridors(this.mst, this.rooms);
    this.navigation = new Navigation(this);
    this.add(this.rooms, this.mst, this.corridors);
  }

  /*get boundingBox(): BoundingBox {
    const points: Vector[] = this.rooms.rooms.reduce((acc: Vector[], room: Room) => {
      acc.push(...room.quadTree.shape.points);
      return acc;
    }, []);

    return new BoundingBox(points);
  }*/

  private makeShape(): Shape {
    const {
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    } = this.pointsBoundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
