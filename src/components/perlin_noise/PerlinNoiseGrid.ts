import { size, Vector, Shape, QuadTree, point } from 'pulsar-pathfinding';
import { randomVector2 } from 'util';

export default class PerlinNoiseGrid {
  private readonly resolution: number = 6;

  constructor(private size: size) {
    /*const shape: Shape = this.makeOuterShape();
    const quadTree: QuadTree = new QuadTree(shape, []);
    quadTree.forceDivide(2);
    console.log(quadTree);*/
  }

  makeOuterShape(): Shape {
    const topLeft: Vector = new Vector({ x: 0, y: 0 });
    const topRight: Vector = new Vector({ x: this.size.width, y: 0 });
    const bottomLeft: Vector = new Vector({ x: 0, y: this.size.height });
    const bottomRight: Vector = new Vector({ x: this.size.width, y: this.size.height });
    const points: Vector[] = [topLeft, topRight, bottomLeft, bottomRight];
    return new Shape(points);
  }
}
