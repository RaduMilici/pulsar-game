import { Shape as ShapePulsar, Vector } from 'pulsar-pathfinding';
import { Mesh, MeshBasicMaterial, DoubleSide, Shape, ShapeGeometry, Matrix4 } from 'three';
import { FLOOR_COLOR } from 'const';
import GameObject from 'entities/GameObject';

export default class Floor extends GameObject {
  private static material: MeshBasicMaterial = new MeshBasicMaterial({
    side: DoubleSide,
    color: FLOOR_COLOR,
  });

  constructor(private readonly shape: ShapePulsar) {
    super();
    const plane: Mesh = Floor.create(shape);
    this.add(plane);
  }

  private static create(shape: ShapePulsar): Mesh {
    const floorShape: Shape = new Shape();
    const ccw: Vector[] = Vector.ArrangePointsCCW(shape.points);

    floorShape.moveTo(ccw[0].x, ccw[0].y);

    for (let i = 1; i < ccw.length; i++) {
      floorShape.lineTo(ccw[i].x, ccw[i].y);
    }

    const geometry: ShapeGeometry = new ShapeGeometry(floorShape);
    const matrix: Matrix4 = new Matrix4().makeRotationX(Math.PI / 2);
    geometry.applyMatrix(matrix);

    return new Mesh(geometry, Floor.material);
  }
}
