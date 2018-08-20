import { Vector } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import Floor from './Floor';
import Walls from './Walls';

export default class Room extends GameObject {
  constructor({ quadTree }: Vector) {
    super();

    const floor: Floor = new Floor(quadTree);
    const walls: Walls = new Walls(quadTree);

    this.add(floor, walls);
  }
}
