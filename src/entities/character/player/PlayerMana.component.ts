import { Component, tickData } from "pulsar-pathfinding";

export default class PlayerManaComponent extends Component {
  mana: number;
  maxMana: number = 100;
  manaRegen: number = 10;

  constructor() {
    super();
    this.mana = this.maxMana;
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
    const manaTick: number = this.manaRegen * deltaTime;
    if (this.mana + manaTick <= this.maxMana) {
      this.mana += manaTick;
    }
  }
}