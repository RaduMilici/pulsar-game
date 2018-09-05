import Character from '../Character';
import PlayerCamera from './PlayerCamera';
import PlayerController from './PlayerController';
import Level from '../../level/Level';
import { Vector3 } from 'three';
import skillData from '../../../types/skillData';
import Skill from '../skills/Skill';
import Shotgun from '../skills/attack/Shotgun';
import Fireball from '../skills/attack/Fireball';
import MouseButtons from '../../../types/MouseButtons';

export default class Player extends Character {
  readonly controller: PlayerController;
  private readonly camera: PlayerCamera;
  private primarySkill: Skill;
  private secondarySkill: Skill;

  constructor(readonly level: Level) {
    super(level);

    this.position.copy(level.rooms.rooms[0].centroidV3);
    this.camera = new PlayerCamera(this, level.app3D.camera);
    this.controller = new PlayerController(level, this);

    this.primarySkill = new Shotgun();
    this.secondarySkill = new Fireball();
  }

  attack(position: Vector3, mouseButton: number): void;
  attack(character: Character, mouseButton: number): void;
  attack(target: Vector3 | Character, mouseButton: number): void {
    let position: Vector3 = target instanceof Vector3 ? target : target.position;

    const data: skillData = {
      begin: this.position,
      end: position,
      navigation: this.level.navigation,
    };

    if (mouseButton === MouseButtons.Left) {
      this.primarySkill.use(data);
    } else if (mouseButton === MouseButtons.Right) {
      this.secondarySkill.use(data);
    }
  }
}
