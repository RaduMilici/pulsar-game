import GameObject from './GameObject';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import Room from './room/Room';
import MST from './corridors/MST';

export default class Level extends GameObject {
  readonly rooms: Room[] = [];
  readonly mst: MST;
  private static minRoomArea: number = 10;

  private readonly shape: Shape;
  private readonly quadTree: QuadTree;
  private readonly boundingBox: BoundingBox;

  constructor(readonly points: Vector[]) {
    super();
    this.boundingBox = new BoundingBox(points);
    this.boundingBox.grow(1);
    this.shape = this.makeShape();
    this.quadTree = new QuadTree(this.shape, points);
    this.rooms = this.makeRooms();
    this.mst = new MST(this);
    this.makeWalls();
    this.add(...this.rooms, this.mst);
  }

  private makeRooms(): Room[] {
    const rooms: Room[] = this.points.map((point: Vector) => new Room(point));
    return Level.growRooms(rooms);
  }

  private makeWalls(): void {
    this.rooms.forEach((room: Room) => room.makeWalls(this.mst.lines));
  }

  private getRoomByCentroid(centroid: Vector): Room {
    return this.rooms.find((room: Room) => room.centroid.equals(centroid));
  }

  private static growRooms(rooms: Room[]): Room[] {
    return rooms.reduce((acc: Room[], room: Room) => {
      if (room.area < Level.minRoomArea) {
        const point: Vector = new Vector();
        point.quadTree = room.quadTree;
        const smallRoom: Room = new Room(point, true);
        acc.push(smallRoom);
        acc.push(Level.growRoom(room));
      } else {
        acc.push(room);
      }
      return acc;
    }, []);
  }

  private static growRoom(room: Room): Room {
    let biggerRoom: Room = room;

    while (biggerRoom.area < Level.minRoomArea) {
      const biggerQuadTree: QuadTree = biggerRoom.quadTree.parent;
      const point: Vector = new Vector(biggerQuadTree.shape.centroid);
      point.quadTree = biggerQuadTree;
      biggerRoom = new Room(point);
    }

    return biggerRoom;
  }

  private makeShape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
