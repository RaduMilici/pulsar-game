import GameObject from './GameObject';
import { Rotate } from '../components';
import { BoxGeometry, Mesh } from 'three';

export default class Cube extends GameObject {
  constructor() {
    super();

    const rotate: Rotate = new Rotate(0, 2, 0);
    this.components.push(rotate);

    const geometry = new BoxGeometry(1, 1, 1);
    const cube = new Mesh(geometry);
    this.add(cube);
  }
}
