import { Vector3 } from 'three';
import Navigation from '../nav/Navigation';
import Projectile from '../entities/character/Projectile';

type projectileData = {
  begin: Vector3;
  end: Vector3;
  speed: number;
  navigation: Navigation;
  onEndPath: (projectile: Projectile) => void;
};

export default projectileData;
