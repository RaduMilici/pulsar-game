import { Vector3 } from 'three';
import Navigation from 'nav/Navigation';

type characterData = {
  navStopDistance?: number;
  navigation: Navigation;
  position: Vector3;
  speed: number;
};

export default characterData;
