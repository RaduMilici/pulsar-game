import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three';
import { GameObject } from 'entities';
import { Rotate } from 'components';

export default class Sphere extends GameObject {
  static geometry: SphereGeometry = new SphereGeometry(1, 3, 3);
  static material: MeshBasicMaterial = new MeshBasicMaterial({
    color: 0xffffff,
  });

  constructor(color: string = '') {
    super();

    const rotate: Rotate = new Rotate(0, 20, 0);
    this.components.push(rotate);

    const material: MeshBasicMaterial =
      color === '' ? Sphere.material : new MeshBasicMaterial({ color });

    this.add(new Mesh(Sphere.geometry, material));
  }
}
