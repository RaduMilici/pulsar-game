import { Vector3 } from 'three';
import GameObject from '../GameObject';
import Navigation from '../../nav/Navigation';
import Cube from '../../entities/Cube';
import projectileData from '../../types/projectileData';

export default class Projectile extends GameObject {
  private readonly begin: Vector3;
  private end: Vector3;
  private dir: Vector3;
  private speed: number;
  private navigation: Navigation;
  private mesh: Cube = new Cube();

  constructor({ begin, end, speed, navigation }: projectileData) {
    super();

    this.begin = begin;
    this.end = end;
    this.dir = end.clone().sub(begin);
    this.speed = speed;
    this.navigation = navigation;

    this.add(this.mesh);
    this.position.copy(this.begin);
  }
}
