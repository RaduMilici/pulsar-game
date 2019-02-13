import { projectileData, skillData } from 'types';
import { Vector3 } from 'three';
import { randomFloat } from 'pulsar-pathfinding';
import Skill from './Skill';
import Projectile from './Projectile';

export default class Shotgun extends Skill {
  constructor() {
    super();
    this.manaCost = 10;
    this.cooldownTime = 0.3;
  }

  createEffect({ begin, end, navigation }: skillData) {
    for (let i = 0; i < 20; i++) {
      const clone: Vector3 = end.clone();
      const x: number = randomFloat(-5, 5);
      const y: number = randomFloat(-5, 5);
      const z: number = randomFloat(-5, 5);
      clone.sub(new Vector3(x, y, z));

      const projectileData: projectileData = {
        begin,
        end: clone,
        speed: 35,
        navigation: navigation,
        onComplete: app3D.remove.bind(app3D),
      };

      const projectile: Projectile = new Projectile(projectileData);
      app3D.add(projectile, app3D.scene);
    }
  }
}
