import { Vector3 } from 'three';
import { skillData, MouseButtons, characterData } from 'types';
import Skill from 'skills/Skill';
import Shotgun from 'skills/Shotgun';
import Fireball from 'skills/Fireball';
import Level from 'entities/level/Level';
import Character from 'entities/character/Character';
import PlayerCamera from './PlayerCamera';
import PlayerController from './PlayerController';
import {NavigatorTile} from "pulsar-pathfinding";
import {toVec3} from "util";

export default class Player extends Character {
  readonly controller: PlayerController;
  readonly level: Level;

  private readonly camera: PlayerCamera;
  private primarySkill: Skill;
  private secondarySkill: Skill;

  constructor(playerData: characterData) {
    super(playerData);

    this.level = playerData.level;
    this.camera = new PlayerCamera(this, this.level.app3D.camera);
    this.controller = new PlayerController(this.level, this);

    this.primarySkill = new Shotgun();
    this.secondarySkill = new Fireball();
  }

  attack(position: Vector3, mouseButton: number): void;
  attack(character: Character, mouseButton: number): void;
  attack(target: Vector3 | Character, mouseButton: number): void {
    const end: Vector3 = target instanceof Vector3 ? target : target.position;
    const data: skillData = { begin: this.position, end, navigation: this.level.navigation };

    if (mouseButton === MouseButtons.Left) {
      this.primarySkill.use(data);
    } else if (mouseButton === MouseButtons.Right) {
      this.secondarySkill.use(data);
    }
  }

  /*getRandomNeighboringTile(): NavigatorTile {
    const random: NavigatorTile = this.level.navigation.getNeighbors(this.destination);
    return toVec3(random.position);
  }*/
}
