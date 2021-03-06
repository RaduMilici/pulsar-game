import { Shape, QuadTree, Vector, BoundingBox } from 'pulsar-pathfinding';
import Navigation from 'nav/Navigation';
import GameObject from 'entities/GameObject';
import Room from 'entities/level/room/Room';
import Rooms from 'entities/level/room/Rooms';
import Player from 'entities/character/player/Player';
import Enemy from 'entities/character/enemy/Enemy';
import GhostPlane from './GhostPlane';
import App3D from '../../App3D/App3D';
import { characterData } from 'types';
import { toVec3 } from 'util';

export default class Level extends GameObject {
  readonly rooms: Rooms;
  readonly navigation: Navigation;
  readonly player: Player;
  readonly enemies: Enemy[];
  readonly ghostPlane: GhostPlane;
  private readonly quadTree: QuadTree;

  constructor(private points: Vector[], readonly boundingBox: BoundingBox, readonly app3D: App3D) {
    super();

    this.ghostPlane = new GhostPlane(this);
    this.quadTree = new QuadTree(this.shape, points);
    this.navigation = new Navigation(this);
    this.rooms = new Rooms(this);

    this.player = this.createPlayer();
    //this.enemies = this.createEnemies();
    this.enemies = [];

    //this.add(this.rooms, this.player, this.ghostPlane, ...this.enemies);
    app3D.add(this.rooms, this);
    app3D.add(this.player, this);
    app3D.add(this.ghostPlane, this);
    app3D.updater.add(this.player);
  }

  get shape(): Shape {
    const { topLeft, topRight, bottomRight, bottomLeft } = this.boundingBox;
    return new Shape([topLeft, topRight, bottomRight, bottomLeft]);
  }

  private createPlayer(): Player {
    const data: characterData = {
      level: this,
      position: this.rooms.rooms[0].centroidV3,
      speed: 15,
    };
    return new Player(data);
  }

  private createEnemies(): Enemy[] {
    const enemyPerSquare = 0.035;
    return this.rooms.rooms.reduce((acc: Enemy[], room: Room) => {
      for (let i = 0; i < room.area * enemyPerSquare; i++) {
        const data: characterData = {
          level: this,
          position: toVec3(room.randomTile().position),
          speed: 10,
          navStopDistance: 4,
        };
        const enemy: Enemy = new Enemy(data);
        acc.push(enemy);
      }

      return acc;
    }, []);
  }
}
