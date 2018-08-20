import GameObject from '../GameObject';
import { QuadTree, Vector } from 'pulsar-pathfinding';
import { makePlane, toVec3 } from '../../util';
import { LineBasicMaterial, Geometry, Vector3, Line, Mesh } from 'three';

export default class Floor extends GameObject {
  constructor(private readonly quadTree: QuadTree) {
    super();

    // const outline: Line = Floor.makeOutline(quadTree.shape.points);
    const plane: Mesh = Floor.makePlane(quadTree);
    Floor.placePlane(plane, quadTree);

    this.add(plane);
  }

  private static makePlane(quadTree: QuadTree): Mesh {
    const { width, height } = quadTree.shape.boundingBox;
    const mesh: Mesh = makePlane(width, height);
    mesh.rotation.x -= Math.PI / 2;
    return mesh;
  }

  private static placePlane(plane: Mesh, quadTree: QuadTree): void {
    const centroid3D: Vector3 = toVec3(quadTree.shape.centroid);
    plane.position.copy(centroid3D);
  }

  private static makeOutline(points: Vector[]): Line {
    const geometry: Geometry = new Geometry();
    const pointsV3: Vector3[] = [];

    for (let i = 0; i < points.length; i++) {
      const { x, y }: Vector = points[i];
      const pointV3: Vector3 = new Vector3(x, 0, y);
      pointsV3.push(pointV3);
    }

    geometry.vertices.push(...pointsV3, pointsV3[0]);
    return new Line(geometry, new LineBasicMaterial());
  }
}
