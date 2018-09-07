import { projectileData, skillData } from 'types';
import GameObject from 'entities/GameObject';
import Sphere from 'entities/Sphere';
import Skill from './Skill';
import Projectile from './Projectile';

export default class Fireball extends Skill {
  constructor() {
    super();
    this.cooldownTime = 1;
  }

  createEffect({ begin, end, navigation }: skillData) {
    const projectileData: projectileData = {
      begin,
      end,
      speed: 10,
      navigation: navigation,
      onEndPath: GameObject.app3D.remove.bind(GameObject.app3D),
      mesh: new Sphere('red'),
    };

    const projectile: Projectile = new Projectile(projectileData);
    GameObject.app3D.add(projectile, GameObject.scene);
  }
}
