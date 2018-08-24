import GameObject from './GameObject';
import { Shape, QuadTree, Vector, BoundingBox, Line } from 'pulsar-pathfinding';
import Room from './room/Room';
import Wall from './room/Wall';
import MST from './corridors/MST';

export default class Level extends GameObject {
  readonly rooms: Room[] = [];
  readonly mst: MST;

  private readonly shape: Shape;
  private readonly quadTree: QuadTree;
  private readonly boundingBox: BoundingBox;

  constructor(readonly points: Vector[]) {
    super();
    this.boundingBox = new BoundingBox(points);
    this.boundingBox.grow(1);
    this.shape = this.makeShape();
    this.quadTree = new QuadTree(this.shape, points);
    this.rooms = points.map((point: Vector) => new Room(point));
    this.mst = new MST(this);
    this.rooms.forEach((room: Room) => room.makeWalls(this.mst.lines));
    this.add(...this.rooms, this.mst);
  }

  getRoomByCentroid(centroid: Vector): Room {
    return this.rooms.find((room: Room) => room.centroid.equals(centroid));
  }

  private addExtraRooms(): void {
    this.mst.lines.forEach(({ midpoint }: Line) => {
      midpoint.quadTree = this.quadTree.findChildThatContains(midpoint);
      const room: Room = new Room(midpoint);
      this.rooms.push(room);
    });
  }

  private makeShape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
