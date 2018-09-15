import { Component } from 'pulsar-pathfinding';
import GameObject from 'entities/GameObject';

export default class LookAt extends Component {
  constructor(private a: GameObject, private b: GameObject) {
    super();
  }

  update() {
    this.a.lookAt(this.b.position);
  }
}
