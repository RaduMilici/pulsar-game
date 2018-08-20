import { Vector } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import Floor from './Floor'

export default class Room extends GameObject {
  constructor({ quadTree }: Vector) {
    super();

    const floor: Floor = new Floor(quadTree);

    this.add(floor);
  }
}
