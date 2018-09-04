import { PlaneGeometry, MeshBasicMaterial, Mesh, Matrix4, Vector3 } from 'three';
import GameObject from '../GameObject';
import Level from './Level';
import { size } from 'pulsar-pathfinding';

export default class GhostPlane extends GameObject {
  private static sizeMultiplier: number = 10;
  constructor({ boundingBox }: Level) {
    super();

    const matrix: Matrix4 = new Matrix4();
    const { width, height }: size = {
      width: boundingBox.width * GhostPlane.sizeMultiplier,
      height: boundingBox.height * GhostPlane.sizeMultiplier,
    };
    const offsetPos: Vector3 = new Vector3(boundingBox.width / 2, 0, boundingBox.height / 2);
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({ visible: false });
    const plane = new Mesh(geometry, material);

    matrix.makeRotationX(-Math.PI / 2);
    matrix.setPosition(offsetPos);
    geometry.applyMatrix(matrix);

    this.add(plane);
  }
}
