import GameObject from './GameObject';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import Room from './room/Room';
import Corridors from './corridors/Corridors';

export default class Level extends GameObject {
  readonly rooms: Room[] = [];
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

    this.rooms = this.makeRooms(points);
    this.corridors = new Corridors(this.rooms);

    this.add(...this.rooms, this.corridors);
  }

  private makeRooms(points: Vector[]): Room[] {
    return points.map((point: Vector) => new Room(point));
  }

  private makeShape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
