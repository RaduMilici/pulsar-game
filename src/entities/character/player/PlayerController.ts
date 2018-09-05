import { size } from 'pulsar-pathfinding';
import { Raycaster, Vector2, Vector3, Intersection, Object3D } from 'three';
import Level from '../../level/Level';
import Player from '../player/Player';

export default class PlayerController {
  private raycaster: Raycaster = new Raycaster();
  private containerSize: size;
  private readonly allFloors: Object3D[];

  constructor(private level: Level, private player: Player) {
    this.containerSize = {
      width: level.app3D.settings.renderer.width,
      height: level.app3D.settings.renderer.height,
    };
    this.allFloors = [...this.level.rooms.floor, this.level.ghostPlane];
  }

  onClick(event: MouseEvent) {
    const mouse: Vector2 = this.getMouse(event);
    this.raycaster.setFromCamera(mouse, this.level.app3D.camera);
    const i: Intersection[] = this.raycaster.intersectObjects(this.allFloors, true);
    if (i[0]) {
      const position: Vector3 = i[0].point;
      this.clickedFloor(position, event);
    }
  }

  private getMouse({ offsetX, offsetY }: MouseEvent): Vector2 {
    const x: number = (offsetX / this.containerSize.width) * 2 - 1;
    const y: number = -(offsetY / this.containerSize.height) * 2 + 1;
    return new Vector2(x, y);
  }

  private clickedFloor(position: Vector3, { shiftKey }: MouseEvent): void {
    if (shiftKey) {
      this.player.faceTo(position);
      this.player.attack(position);
    } else {
      this.player.moveTo(position);
    }
  }
}
