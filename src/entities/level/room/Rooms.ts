import { Vector, QuadTree } from 'pulsar-pathfinding';
import { Object3D } from 'three';
import Navigation from 'nav/Navigation';
import GameObject from 'entities/GameObject';
import MST from 'entities/MST';
import Level from 'entities/level/Level';
import Corridors from 'entities/level/corridor/Corridors';
import CorridorLine from 'entities/level/corridor/CorridorLine';
import Room from './Room';
import {MIN_ROOM_AREA} from "const";

export default class Rooms extends GameObject {
  readonly floor: Object3D[];

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
    this.corridors = new Corridors(this);
    this.addNavData();
    this.floor = this.getNavFloor();
    this.add(...this.rooms, this.corridors, this.mst);
  }

  get centroids(): Vector[] {
    return this.rooms.map((room: Room) => room.centroid);
  }

  getNavFloor(): Object3D[] {
    const floor: Object3D[] = this.rooms.map((room: Room) => room.floor);
    const corridors: Object3D[] = this.corridors.children;
    return [...floor, ...corridors];
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
      if (room.area < MIN_ROOM_AREA) {
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

    while (biggerRoom.area < MIN_ROOM_AREA) {
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
}
