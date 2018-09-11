import Character from 'entities/character/Character';
import Level from 'entities/level/Level';
import Player from 'entities/character/player/Player';
import GameObject from 'entities/GameObject';
import { characterData } from 'types';
import Scan from './Scan';
import LookAt from './LookAt';

export default class Enemy extends Character {
  level: Level;
  player: Player;

  private maxRange: number = 15;
  private minRange: number = 3;

  constructor(enemyData: characterData) {
    super(enemyData);

    this.level = enemyData.level;
    this.player = enemyData.level.player;
  }

  get distanceToPlayer(): number {
    return this.position.distanceTo(this.player.position);
  }

  get playerInRange(): boolean {
    const isCloseEnough: boolean = this.distanceToPlayer <= this.maxRange;
    const isFarEnough: boolean = this.distanceToPlayer > this.minRange;
    return isCloseEnough && isFarEnough;
  }

  start() {
    //const scan: Scan = new Scan(this);
    //GameObject.app3D.updater.invokeRepeating(scan, 1000);
  }
  
  onNavComplete() {
    const lookAt = new LookAt(this, this.player);
    lookAt.update();
  }
}
