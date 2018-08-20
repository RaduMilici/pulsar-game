import GameObject from '../GameObject';
import { QuadTree, Vector } from 'pulsar-pathfinding'
import { LineBasicMaterial, Geometry, Vector3, Line, Mesh, PlaneGeometry } from "three";

export default class Floor extends GameObject {


  constructor(private readonly quadTree: QuadTree) {
    super();
    const outline: Line = Floor.makeOutline(quadTree.shape.points);
    const plane: Mesh = Floor.makePlane(quadTree);
    Floor.placePlane(plane, quadTree);
    this.add(plane, outline);
  }

  private static makePlane(quadTree: QuadTree): Mesh {
    const { width, height } = quadTree.shape.boundingBox;
    const geometry: PlaneGeometry = new PlaneGeometry(width, height);
    const mesh: Mesh = new Mesh(geometry);
    mesh.rotation.x -= Math.PI / 2;
    return mesh;
  }

  private static placePlane(plane: Mesh, quadTree: QuadTree): void {
    const { x, y }: Vector = quadTree.shape.centroid;
    const centroid3D: Vector3 = new Vector3(x, 0, y);
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