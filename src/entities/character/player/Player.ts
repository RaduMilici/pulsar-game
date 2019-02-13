import { Vector3 } from 'three';
import { NavigatorTile, tickData } from "pulsar-pathfinding";
import { skillData, MouseButtons, characterData } from 'types';
import Skill from 'skills/Skill';
import Shotgun from 'skills/Shotgun';
import Fireball from 'skills/Fireball';
import Level from 'entities/level/Level';
import Character from 'entities/character/Character';
import PlayerCamera from './PlayerCamera';
import PlayerController from './PlayerController';
import Radius from './Radius.component';
import toVec3 from 'util/toVec3';
import PlayerManaComponent from './PlayerMana.component';

export default class Player extends Character {
  readonly controller: PlayerController;
  readonly level: Level;
  readonly manaComponent: PlayerManaComponent;

  private readonly camera: PlayerCamera;
  private readonly radius: Radius;

  private primarySkill: Skill;
  private secondarySkill: Skill;
  private pullRadius: number = 15;

  constructor(playerData: characterData) {
    super(playerData);

    this.level = playerData.level;
    this.camera = new PlayerCamera(this, this.level.app3D.camera);
    this.controller = new PlayerController(this.level, this);
    this.radius = new Radius(this, this.pullRadius);
    this.manaComponent = new PlayerManaComponent();

    this.primarySkill = new Shotgun();
    this.secondarySkill = new Fireball();

    app3D.add(this.manaComponent);
  }

  start() {
    //app3D.updater.invokeRepeating(this.radius, 1000);
  }

  attack(position: Vector3, mouseButton: number): void;
  attack(character: Character, mouseButton: number): void;
  attack(target: Vector3 | Character, mouseButton: number): void {
    const end: Vector3 = target instanceof Vector3 ? target : target.position;
    const data: skillData = { begin: this.position, end, navigation: this.level.navigation };

    if (mouseButton === MouseButtons.Left) {
      this.castSkill(this.primarySkill, data);
    } else if (mouseButton === MouseButtons.Right) {
      this.castSkill(this.secondarySkill, data);
    }
  }

  canCastSkill(skill: Skill): boolean {
    if (skill.onCooldown) {
      return false;
    }

    return this.manaComponent.canCast(skill.manaCost);
  }

  castSkill(skill: Skill, data: skillData): void {
    if (this.canCastSkill(skill)) {
      this.manaComponent.payManaCost(skill.manaCost);
      skill.use(data);
    }
  }

  getRandomNeighboringPosition(): Vector3 {
    const random: NavigatorTile = this.level.navigation.getRandomNeighbor(this.destination);
    return toVec3(random.position);
  }
}
