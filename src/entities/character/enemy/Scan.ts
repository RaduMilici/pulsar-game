import { Component, NavigatorTile } from 'pulsar-pathfinding';
import { Vector3 } from 'three';
import Enemy from './Enemy';
import { toVec3 } from 'util';

export default class Scan extends Component {
  constructor(private enemy: Enemy) {
    super();
  }

  update() {
    if (this.enemy.playerInRange) {
      const position: Vector3 = this.getRandomNeighboringPosition();
      this.enemy.moveTo(position);
    }
  }

  private getRandomNeighboringPosition(): Vector3 {
    const playerDestination: NavigatorTile = this.enemy.player.destination;
    const random: NavigatorTile = this.enemy.level.navigation.getRandomNeighbor(playerDestination);
    return toVec3(random.position);
  }
}
