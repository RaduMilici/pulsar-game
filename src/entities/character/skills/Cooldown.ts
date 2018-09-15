import { Component, tickData } from 'pulsar-pathfinding';
import GameObject from 'entities/GameObject';

export default class Cooldown extends Component {
  constructor(public time: number) {
    super();
  }

  get done(): boolean {
    return this.time <= 0;
  }

  update({ deltaTime }: tickData) {
    this.time -= deltaTime;

    if (this.done) {
      app3D.remove(this);
    }
  }
}
