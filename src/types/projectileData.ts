import { Vector3 } from 'three';
import Navigation from '../nav/Navigation';

type projectileData = {
  begin: Vector3;
  end: Vector3;
  speed: number;
  navigation: Navigation;
};

export default projectileData;
