import { Line, Vector, contains } from 'pulsar-pathfinding';

export default class CorridorLine extends Line {
  private readonly intersections: Vector[] = [];

  get hasIntersections(): boolean {
    return this.intersections.length !== 0;
  }

  addIntersection(point: Vector): void;
  addIntersection(point: Vector[]): void;

  addIntersection(point: Vector | Vector[]): void {
    if (Array.isArray(point)) {
      point.forEach((p: Vector) => this.add(p));
    } else {
      this.add(point);
    }
  }

  private add(point: Vector): void {
    const index: number = this.intersections.findIndex(
      (intersection: Vector) => {
        return point.equals(intersection);
      }
    );

    if (index === -1) {
      this.intersections.push(point);
    }
  }
}
