import { Vector3 } from 'three';
import GameObject from 'entities/GameObject';
import Level from 'entities/level/Level';

type characterData = {
  mesh?: GameObject;
  navStopDistance?: number;
  level: Level;
  position: Vector3;
  speed: number;
};

export default characterData;
