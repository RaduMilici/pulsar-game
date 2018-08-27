import GameObject from '../GameObject';
import { QuadTree } from 'pulsar-pathfinding';
import { makePlane, toVec3 } from '../../util';
import { Vector3, Mesh, MeshBasicMaterial, FrontSide } from 'three';
import { floorColor } from '../../const/colors';

export default class Floor extends GameObject {
  constructor(private readonly quadTree: QuadTree) {
    super();

    const plane: Mesh = Floor.makePlane(quadTree);
    Floor.placePlane(plane, quadTree);

    this.add(plane);
  }

  private static makePlane(quadTree: QuadTree): Mesh {
    const { width, height } = quadTree.shape.boundingBox;
    const mesh: Mesh = makePlane({ width, height });
    mesh.material = new MeshBasicMaterial({
      side: FrontSide,
      color: floorColor,
    });
    mesh.rotation.x -= Math.PI / 2;
    return mesh;
  }

  private static placePlane(plane: Mesh, { shape }: QuadTree): void {
    const centroid3D: Vector3 = toVec3(shape.centroid);
    plane.position.copy(centroid3D);
  }
}
