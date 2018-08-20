import { Vector, Triangulation, Line as LinePulsar } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import Room from '../room/Room';
import { toVec3 } from '../../util';
import { Geometry, Line, LineBasicMaterial, Vector3 } from 'three';

export default class Corridors extends GameObject {
  private readonly points: Vector[] = [];
  private readonly triangulation: Triangulation;

  constructor(private readonly rooms: Room[]) {
    super();
    this.points = rooms.map((room: Room) => room.centroid);

    this.triangulation = new Triangulation(this.points);
    this.triangulation.start();
    this.triangulation.MST.start();

    const debugLines: Line[] = Corridors.makeDebugLines(
      this.triangulation.MST.lines
    );
    this.add(...debugLines);
  }

  private static makeDebugLines(lines: LinePulsar[]): Line[] {
    return lines.map(({ a, b }: LinePulsar) => {
      const aV3: Vector3 = toVec3(a);
      const bV3: Vector3 = toVec3(b);
      const geometry: Geometry = new Geometry();

      geometry.vertices.push(aV3, bV3);

      return new Line(geometry, new LineBasicMaterial());
    });
  }
}
