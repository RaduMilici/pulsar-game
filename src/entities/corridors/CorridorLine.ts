import { Line, Vector } from 'pulsar-pathfinding';

export default class CorridorLine extends Line {
  readonly intersections: Vector[] = [];

  get hasIntersections(): boolean {
    return this.intersections.length !== 0;
  }
}
