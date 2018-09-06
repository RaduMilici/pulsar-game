import { Vector3, Object3D } from 'three';
import Navigation from '../nav/Navigation';
import Projectile from '../entities/character/skills/Projectile';

type projectileData = {
  begin: Vector3;
  end: Vector3;
  speed: number;
  navigation: Navigation;
  onEndPath: (projectile: Projectile) => void;
  mesh?: Object3D;
};

export default projectileData;
