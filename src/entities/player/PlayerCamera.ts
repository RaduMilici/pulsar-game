import { PerspectiveCamera, Vector3 } from 'three';
import Character from './Character';

export default class PlayerCamera {
  private static relativePosition: Vector3 = new Vector3(10, 20, 10);

  constructor(private player: Character, private camera: PerspectiveCamera) {
    player.add(camera);
    this.placeCamera();
  }

  private placeCamera(): void {
    const position: Vector3 = new Vector3().add(PlayerCamera.relativePosition);
    this.camera.position.copy(position);
    this.camera.lookAt(new Vector3());
  }
}
