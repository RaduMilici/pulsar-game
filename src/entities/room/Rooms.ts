import GameObject from '../GameObject';
import { Vector, Line } from 'pulsar-pathfinding';
import Room from './Room';
import QuadTree from 'pulsar-pathfinding/dist/quadtree/QuadTree';
import MST from '../corridors/MST';
import CorridorLine from '../corridors/CorridorLine';
import Corridors from '../corridors/Corridors';

export default class Rooms extends GameObject {
  private static minRoomArea: number = 5;
  private readonly rooms: Room[];

  constructor(private readonly points: Vector[]) {
    super();

    this.rooms = this.points.map((point: Vector) => new Room(point));
    //this.rooms = Rooms.growRooms(all);
    this.add(...this.rooms);
  }

  get centroids(): Vector[] {
    return this.rooms.map((room: Room) => room.centroid);
  }

  makeWalls(mst: MST) {
    this.rooms.forEach((room: Room) => room.makeWalls(mst.lines));
  }

  intersectCorridors(corridors: Corridors): CorridorLine[] {
    return corridors.mstLines.reduce((acc: CorridorLine[], { a, b }: Line) => {
      const corridor = new CorridorLine(a, b);
      const roomA = this.getRoomByCentroid(a);
      const roomB = this.getRoomByCentroid(b);

      const intersectionsA: Vector[] = roomA.intersect(corridor);
      const intersectionsB: Vector[] = roomB.intersect(corridor);

      corridor.addIntersection(intersectionsA);
      corridor.addIntersection(intersectionsB);

      acc.push(corridor);
      return acc;
    }, []);
  }

  private static growRooms(rooms: Room[]): Room[] {
    return rooms.reduce((acc: Room[], room: Room) => {
      if (room.area < Rooms.minRoomArea) {
        //const containedRoom: Room = Rooms.makeContainedRoom(room);
        //acc.push(containedRoom);
        const biggerRoom: Room = Rooms.growRoom(room);
        if (biggerRoom) {
          acc.push(biggerRoom);
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
