import { GameObject, Rooms, Player } from 'entities';
import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import { Navigation } from 'nav';
import GhostPlane from './GhostPlane';
import App3D from '../../App3D/App3D';

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
