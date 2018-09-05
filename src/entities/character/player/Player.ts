import Character from '../Character';
import PlayerCamera from './PlayerCamera';
import PlayerController from './PlayerController';
import Level from '../../level/Level';
import { Vector3 } from 'three';
import projectileData from '../../../types/projectileData';
import Projectile from '../Projectile';
import GameObject from '../../GameObject';

export default class Player extends Character {
  readonly controller: PlayerController;

  private readonly camera: PlayerCamera;

  constructor(readonly level: Level) {
    super(level);

    this.position.copy(level.rooms.rooms[0].centroidV3);
    this.camera = new PlayerCamera(this, level.app3D.camera);
    this.controller = new PlayerController(level, this);
  }

  attack(position: Vector3): void;
  attack(character: Character): void;
  attack(target: Vector3 | Character): void {
    if (target instanceof Vector3) {
      this.launchProjectile(target);
    }
    if (target instanceof Character) {
      this.launchProjectile(target.position);
    }
  }

  launchProjectile(destination: Vector3): void {
    const data: projectileData = {
      begin: this.position,
      end: destination,
      speed: 35,
      navigation: this.level.navigation,
      onEndPath: this.onProjectileEndPath.bind(this),
    };

    const projectile: Projectile = new Projectile(data);
    GameObject.app3D.add(projectile, GameObject.scene);
  }

  private onProjectileEndPath(projectile: Projectile): void {
    this.remove(projectile);
  }
}
