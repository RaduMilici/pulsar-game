import { size } from 'pulsar-pathfinding';
import { Raycaster, Vector2, Vector3, Intersection } from 'three';
import Level from '../level/Level';
import Player from './Player';

export default class PlayerController {
  private raycaster: Raycaster = new Raycaster();
  private mouse: Vector2 = new Vector2();
  private containerSize: size;

  constructor(private level: Level, private player: Player) {
    this.containerSize = {
      width: level.app3D.settings.renderer.width,
      height: level.app3D.settings.renderer.height,
    };
  }

  onClick(event: MouseEvent) {
    this.mouse = this.getMouse(event);
    this.raycaster.setFromCamera(this.mouse, this.level.app3D.camera);
    const i: Intersection[] = this.raycaster.intersectObjects(
      this.level.rooms.floor,
      true
    );
    if (i[0]) {
      const position: Vector3 = i[0].point;
      this.clickedFloor(position);
    }
  }

  private getMouse({ offsetX, offsetY }: MouseEvent): Vector2 {
    const x: number = (offsetX / this.containerSize.width) * 2 - 1;
    const y: number = -(offsetY / this.containerSize.height) * 2 + 1;
    return new Vector2(x, y);
  }

  private clickedFloor(position: Vector3): void {
    this.player.moveTo(position);
  }
}
