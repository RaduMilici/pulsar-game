import { PerspectiveCamera, Vector3 } from 'three';
import { Gyroscope } from 'util';
import Character from 'entities/character/Character';
import { PLAYER_CAMERA_POSITION } from 'const';

export default class PlayerCamera {
  constructor(private player: Character, private camera: PerspectiveCamera) {
    const gyro: Gyroscope = new Gyroscope();
    player.add(gyro);
    gyro.add(camera);
    this.placeCamera();
  }

  private placeCamera(): void {
    const position: Vector3 = new Vector3().add(PLAYER_CAMERA_POSITION);
    this.camera.position.copy(position);
    this.camera.lookAt(new Vector3());
  }
}
