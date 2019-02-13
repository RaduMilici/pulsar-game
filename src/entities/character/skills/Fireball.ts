import { projectileData, skillData } from 'types';
import Sphere from 'entities/Sphere';
import Skill from './Skill';
import Projectile from './Projectile';

export default class Fireball extends Skill {
  constructor() {
    super();
    this.manaCost = 50;
    this.cooldownTime = 1;
  }

  createEffect({ begin, end, navigation }: skillData) {
    const projectileData: projectileData = {
      begin,
      end,
      speed: 10,
      navigation: navigation,
      onComplete: app3D.remove.bind(app3D),
      mesh: new Sphere('red'),
    };

    const projectile: Projectile = new Projectile(projectileData);
    app3D.add(projectile, app3D.scene);
  }
}
