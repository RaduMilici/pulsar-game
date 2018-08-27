import GameObject from '../GameObject';
import MST from './MST';
import Room from '../room/Room';

export default class Corridors extends GameObject {
  constructor(private readonly mst: MST, private readonly rooms: Room[]) {
    super();
  }
}
