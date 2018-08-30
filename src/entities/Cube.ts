import GameObject from './GameObject';
import { Rotate } from '../components';
import { BoxGeometry, Geometry, Mesh, MeshBasicMaterial } from 'three';

export default class Cube extends GameObject {
  static geometry: Geometry = new BoxGeometry(0.3, 0.3, 0.3);
  static material: MeshBasicMaterial = new MeshBasicMaterial({
    color: 0xffffff,
  });

  constructor() {
    super();

    //const rotate: Rotate = new Rotate(0, 2, 0);
    //this.components.push(rotate);

    this.add(new Mesh(Cube.geometry, Cube.material));
  }
}
