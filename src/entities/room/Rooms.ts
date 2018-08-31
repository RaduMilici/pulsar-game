import GameObject from '../GameObject';
import { Vector, Line, QuadTree } from 'pulsar-pathfinding';
import Room from './Room';
import Level from '../Level';
import MST from '../MST';
import CorridorLine from '../corridors/CorridorLine';
import Corridors from '../corridors/Corridors';
import Navigation from '../../nav/Navigation';

export default class Rooms extends GameObject {
  private static minRoomArea: number = 10;
  readonly navigation: Navigation;
  readonly corridors: Corridors;
  readonly rooms: Room[];
  readonly mst: MST;

  constructor({ points, navigation }: Level) {
    super();

    this.navigation = navigation;
    this.rooms = points.map(({ quadTree }: Vector) => {
      const room: Room = new Room(quadTree.shape, this.navigation);
      room.quadTree = quadTree;
      return room;
    });
    this.rooms = this.growRooms(this.rooms);
    this.mst = new MST(this);
    this.makeWalls();
    this.corridors = new Corridors(this);
    this.addNavData();

    this.add(...this.rooms, this.corridors);
  }

  get centroids(): Vector[] {
    return this.rooms.map((room: Room) => room.centroid);
  }

  makeWalls() {
    //this.rooms.forEach((room: Room) => room.makeWalls(this.mst.lines));
  }

  getRoomByCentroid(centroid: Vector): Room {
    return this.rooms.find((room: Room) => room.centroid.equals(centroid));
  }

  intersectCorridors(): CorridorLine[] {
    return this.mst.lines.reduce((acc: CorridorLine[], line: CorridorLine) => {
      const roomA: Room = this.getRoomByCentroid(line.a);
      const roomB: Room = this.getRoomByCentroid(line.b);

      roomA.makeWalls(this.mst.lines);
      roomB.makeWalls(this.mst.lines);

      const intersectionsA: Vector[] = roomA.intersect(line);
      const intersectionsB: Vector[] = roomB.intersect(line);

      line.addIntersections(intersectionsA);
      line.addIntersections(intersectionsB);

      acc.push(line);
      return acc;
    }, []);
  }

  private addNavData() {
    this.rooms.forEach((room: Room) => room.addNavData());
  }

  private growRooms(rooms: Room[]): Room[] {
    return rooms.reduce((acc: Room[], room: Room) => {
      if (room.area < Rooms.minRoomArea) {
        //const containedRoom: Room = Rooms.makeContainedRoom(room);
        //acc.push(containedRoom);
        const biggerRoom: Room = this.growRoom(room);
        if (biggerRoom) {
          acc.push(biggerRoom);
        }
      } else {
        acc.push(room);
      }
      return acc;
    }, []);
  }

  private growRoom(room: Room): Room {
    let biggerRoom: Room = room;
    let parent: QuadTree = biggerRoom.quadTree.parent;

    while (biggerRoom.area < Rooms.minRoomArea) {
      // make sure quadtree doesn't already have a room associated with it
      if (parent.containedPoints.length !== 0) {
        return null;
      }

      parent.containedPoints.push(parent.shape.centroid);
      biggerRoom = new Room(parent.shape, this.navigation);
      biggerRoom.quadTree = parent;
      parent = parent.parent;
    }

    return biggerRoom;
  }

  private makeContainedRoom(room: Room): Room {
    const point: Vector = new Vector();
    point.quadTree = room.quadTree;
    return new Room(point.quadTree.shape, this.navigation);
  }
}
