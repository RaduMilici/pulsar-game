import { Component, tickData } from "pulsar-pathfinding";
import Orb from 'src/ui/orb/Orb';

export default class PlayerManaComponent extends Component {
  mana: number;
  maxMana: number = 100;
  manaRegen: number = 10;

  constructor(private orb: Orb) {
    super();
    this.mana = this.maxMana;
    app3D.add(this);
  }

  get manaLevel() :number {
    return this.mana / this.maxMana;
  }

  canCast(cost: number): boolean {
    return this.mana - cost >= 0;
  }

  payManaCost(cost: number): void {
    if (this.canCast(cost)) {
      this.mana -= cost;
    }
  }

  update({ deltaTime }: tickData): void {
    this.regenerateMana(deltaTime);
    this.orb.setLevel(this.manaLevel);
  }

  private regenerateMana(deltaTime: number): void {
    const manaTick: number = this.manaRegen * deltaTime;
    if (this.mana + manaTick <= this.maxMana) {
      this.mana += manaTick;
    }
  }
}