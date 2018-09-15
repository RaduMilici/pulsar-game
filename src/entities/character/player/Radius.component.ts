import { Shape, Component, Vector } from 'pulsar-pathfinding';
import toVector from 'util/toVector';
import Player from './Player';
import Enemy from 'entities/character/enemy/Enemy';
import { MAX_NAVIGATORS } from 'const';

export default class Radius extends Component {
  private shape: Shape;
  private currentlyNavigating: number = 0;

  private static points: number = 4;
  private static pointsStep: number = 6 / Radius.points;

  constructor(private player: Player, private radius: number) {
    super();
  }

  update() {
    const radiusPoints: Vector[] = this.makeRadiusPoints();
    this.shape = new Shape(radiusPoints);
    const num: number = this.player.level.enemies.length;

    for (let i = 0; i < num && this.currentlyNavigating < MAX_NAVIGATORS; i++) {
      const enemy: Enemy = this.player.level.enemies[i];
      this.attackPlayerIfInsideRadius(enemy);
    }

    this.currentlyNavigating = 0;
  }

  private attackPlayerIfInsideRadius(enemy: Enemy): void {
    const isInsideRadius: boolean = this.shape.containsPoint(toVector(enemy.position));

    if (isInsideRadius) {
      this.currentlyNavigating++;
      enemy.moveToPlayer();
    }
  }

  private makeRadiusPoints(): Vector[] {
    const points: Vector[] = [];
    const { x, y }: Vector = toVector(this.player.position);
    let angle = 0;

    for (let i = 0; i < Radius.points; i++) {
      const cubePos: Vector = new Vector({
        x: x + this.radius * Math.cos(angle),
        y: y + this.radius * Math.sin(angle),
      });
      points.push(cubePos);
      angle += Radius.pointsStep;
    }

    return points;
  }
}
