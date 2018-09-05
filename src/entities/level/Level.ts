import GameObject from '../GameObject';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import Rooms from './room/Rooms';
import Navigation from '../../nav/Navigation';
import Player from '../character/player/Player';
import App3D from '../../App3D/App3D';
import GhostPlane from './GhostPlane';

export default class Level extends GameObject {
  readonly rooms: Rooms;
  readonly navigation: Navigation;
  readonly player: Player;
  readonly ghostPlane: GhostPlane;
  private readonly quadTree: QuadTree;

  constructor(private points: Vector[], readonly boundingBox: BoundingBox, readonly app3D: App3D) {
    super();

    this.ghostPlane = new GhostPlane(this);
    this.quadTree = new QuadTree(this.shape, points);
    this.navigation = new Navigation(this);
    this.rooms = new Rooms(this);
    this.player = new Player(this);

    this.add(this.rooms, this.player, this.ghostPlane);
  }

  get shape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }
}
