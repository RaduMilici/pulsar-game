import GameObject from '../GameObject';
import { QuadTree, Line } from 'pulsar-pathfinding';
import { Mesh, Object3D, Vector3 } from 'three';
import { makePlane, toVec3 } from '../../util';

export default class Walls extends GameObject {
  private static height: number = 1;

  constructor(private readonly quadTree: QuadTree) {
    super();

    const walls: Object3D = Walls.makeWalls(quadTree);

    this.add(walls);
  }

  private static makeWalls(quadTree: QuadTree): Object3D {
    const parent: Object3D = new Object3D();
    const centroidV3: Vector3 = toVec3(quadTree.shape.centroid);

    quadTree.shape.lines.forEach((line: Line) => {
      const plane: Mesh = makePlane(line.length, Walls.height);
      const midpointV3: Vector3 = toVec3(line.midpoint);

      plane.position.copy(midpointV3);
      plane.lookAt(centroidV3);
      plane.position.setY(Walls.height / 2);
      parent.add(plane);
    });

    return parent;
  }
}
