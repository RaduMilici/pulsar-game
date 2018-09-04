import GameObject from './GameObject';
import { ConeGeometry, Geometry, Mesh, MeshBasicMaterial, Matrix4 } from 'three';

export default class Cone extends GameObject {
  static material: MeshBasicMaterial = new MeshBasicMaterial({
    color: 0xffffff,
  });
  static matrix: Matrix4 = new Matrix4().makeRotationX(Math.PI / 2);
  static geometry: Geometry = new ConeGeometry(0.3, 1, 3).applyMatrix(Cone.matrix);

  constructor(color: string = '') {
    super();

    const material: MeshBasicMaterial =
      color === '' ? Cone.material : new MeshBasicMaterial({ color });

    this.add(new Mesh(Cone.geometry, material));
  }
}
