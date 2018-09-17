import { Object3D } from 'three';
import { characterData, mobileData } from 'types';
import Cone from 'entities/Cone';
import Level from 'entities/level/Level';
import Mobile from 'entities/Mobile';

export default class Character extends Mobile {
  readonly mesh: Object3D;
  readonly level: Level;

  constructor({ level, position, navStopDistance = 0, mesh = new Cone(), speed }: characterData) {
    const mobileData: mobileData = {
      navigation: level.navigation,
      speed,
      navStopDistance,
      position,
    };
    super(mobileData);
    this.level = level;
    this.mesh = mesh;
    this.position.copy(position);
    this.add(this.mesh);
  }
}
