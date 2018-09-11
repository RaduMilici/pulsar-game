import { Shape, Component } from "pulsar-pathfinding";
import Vector from "pulsar-pathfinding/dist/common/Vector";
import toVector from "util/toVector";
import Player from './Player';
import Enemy from 'entities/character/enemy/Enemy';

export default class Radius extends Component {
  private shape: Shape;

  private static points: number = 4;
  private static pointsStep: number = 6 / Radius.points;

  constructor(private player: Player, private radius: number) {
    super();
  }

  update() {
    this.shape = new Shape(this.makeCirclePoints());
    this.player.level.enemies.forEach((enemy: Enemy) => {
      const isClose = this.shape.containsPoint(toVector(enemy.position));
      if (isClose) {
        enemy.moveTo(this.player.getRandomNeighboringPosition());
      }
    });
  }

  private makeCirclePoints(): Vector[] {
    const points: Vector[] = [];
    const { x, y }: Vector = toVector(this.player.position);
    let angle = 0;

    for (let i = 0; i < Radius.points; i++) {
      const cubePos: Vector = new Vector({
        x: x + this.radius * Math.cos(angle),
        y: y + this.radius * Math.sin(angle)
      });
      points.push(cubePos);
      angle += Radius.pointsStep;
    }

    return points;
  }
}