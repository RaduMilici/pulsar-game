import { BoxGeometry, Geometry, Mesh, MeshBasicMaterial } from 'three';
import Rotate from 'components/Rotate';
import GameObject from './GameObject';

export default class Cube extends GameObject {
  static geometry: Geometry = new BoxGeometry(0.3, 0.3, 0.3);
  static material: MeshBasicMaterial = new MeshBasicMaterial({
    color: 0xffffff,
  });

  constructor(color: string = '') {
    super();

    const rotate: Rotate = new Rotate(0, 2, 0);
    this.components.push(rotate);

    const material: MeshBasicMaterial =
      color === '' ? Cube.material : new MeshBasicMaterial({ color });

    this.add(new Mesh(Cube.geometry, material));
  }
}
