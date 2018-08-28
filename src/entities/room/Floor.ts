import GameObject from '../GameObject';
import { Shape } from 'pulsar-pathfinding';
import { makePlane, toVec3 } from '../../util';
import { Vector3, Mesh, MeshBasicMaterial, DoubleSide } from 'three';
import { floorColor } from '../../const/colors';

export default class Floor extends GameObject {
  constructor(private readonly shape: Shape) {
    super();

    const plane: Mesh = Floor.makePlane(shape);
    Floor.placePlane(plane, shape);

    this.add(plane);
  }

  private static makePlane(shape: Shape): Mesh {
    const { width, height } = shape.boundingBox;
    const mesh: Mesh = makePlane({ width, height });
    mesh.material = new MeshBasicMaterial({
      side: DoubleSide,
      color: floorColor,
    });
    mesh.rotation.x -= Math.PI / 2;
    return mesh;
  }

  private static placePlane(plane: Mesh, shape: Shape): void {
    const centroid3D: Vector3 = toVec3(shape.centroid);
    plane.position.copy(centroid3D);
  }
}
