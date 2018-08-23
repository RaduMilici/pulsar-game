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
    this.add(...this.rooms, this.mst);
    this.makeWalls();
  }

  makeWalls(): void {
    this.rooms.forEach((room: Room) => {
      const mstLines: Line[] = this.mst.getLinesContainingPoint(room.centroid);
      room.makeWalls(mstLines);
    });
    /*this.mst.lines.forEach((mstLine: Line) => {
      const roomA: Room = this.getRoomByCentroid(mstLine.a);
      const roomB: Room = this.getRoomByCentroid(mstLine.b);

      roomA.makeWalls(mstLine);
      roomB.makeWalls(mstLine);
    });*/
  }

  getRoomByCentroid(centroid: Vector): Room {
    return this.rooms.find((room: Room) => room.centroid.equals(centroid));
  }

  private makeShape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
