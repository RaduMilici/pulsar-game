import GameObject from './GameObject';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import Room from './room/Room';

export default class Level extends GameObject {
  readonly rooms: Room[] = [];

  private readonly shape: Shape;
  private readonly quadTree: QuadTree;
  private readonly boundingBox: BoundingBox;

  constructor(readonly points: Vector[]) {
    super();
    this.boundingBox = new BoundingBox(points);
    this.boundingBox.grow(1);
    this.shape = this.makeShape();
    this.quadTree = new QuadTree(this.shape, points);
    points.forEach(this.addRoom.bind(this));
  }

  private addRoom(point: Vector): void {
    const room = new Room(point);
    this.rooms.push(room);
    this.add(room);
  }

  private makeShape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
