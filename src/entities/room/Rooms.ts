import GameObject from '../GameObject';
import { Vector } from 'pulsar-pathfinding';
import Room from './Room';
import QuadTree from 'pulsar-pathfinding/dist/quadtree/QuadTree';
import MST from '../corridors/MST';

export default class Rooms extends GameObject {
  private static minRoomArea: number = 10;
  private readonly rooms: Room[];

  constructor(private readonly points: Vector[]) {
    super();

    const all: Room[] = this.points.map((point: Vector) => new Room(point));
    this.rooms = Rooms.growRooms(all);
    this.add(...this.rooms);
  }

  get centroids(): Vector[] {
    return this.rooms.map((room: Room) => room.centroid);
  }

  makeWalls(mst: MST) {
    this.rooms.forEach((room: Room) => room.makeWalls(mst.lines));
  }

  private static growRooms(rooms: Room[]): Room[] {
    return rooms.reduce((acc: Room[], room: Room) => {
      if (room.area < Rooms.minRoomArea) {
        //const containedRoom: Room = Level.makeContainedRoom(room);
        //acc.push(containedRoom);
        const biggerRoom: Room = Rooms.growRoom(room);
        if (biggerRoom) {
          acc.push();
        }
      } else {
        acc.push(room);
      }
      return acc;
    }, []);
  }

  private static growRoom(room: Room): Room {
    let biggerRoom: Room = room;

    while (biggerRoom.area < Rooms.minRoomArea) {
      const biggerQuadTree: QuadTree = biggerRoom.quadTree.parent;
      // make sure quadtree doesn't already have a room associated with it
      if (biggerQuadTree.containedPoints.length !== 0) {
        return null;
      }
      const point: Vector = new Vector(biggerQuadTree.shape.centroid);
      point.quadTree = biggerQuadTree;
      biggerQuadTree.containedPoints.push(point);
      biggerRoom = new Room(point);
    }

    return biggerRoom;
  }

  private static makeContainedRoom(room: Room): Room {
    const point: Vector = new Vector();
    point.quadTree = room.quadTree;
    return new Room(point, true);
  }

  private getRoomByCentroid(centroid: Vector): Room {
    return this.rooms.find((room: Room) => room.centroid.equals(centroid));
  }
}
