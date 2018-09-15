import Character from 'entities/character/Character';
import Level from 'entities/level/Level';
import Player from 'entities/character/player/Player';
import { characterData } from 'types';
import LookAt from './LookAt';

export default class Enemy extends Character {
  level: Level;
  player: Player;

  constructor(enemyData: characterData) {
    super(enemyData);

    this.level = enemyData.level;
    this.player = enemyData.level.player;
  }

  moveToPlayer(): void {
    this.moveTo(this.player.getRandomNeighboringPosition());
  }

  onNavComplete() {
    const lookAt = new LookAt(this, this.player);
    lookAt.update();
  }
}
