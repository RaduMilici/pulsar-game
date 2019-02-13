import { Component, tickData } from "pulsar-pathfinding";

export default class PlayerManaComponent extends Component {
  mana: number;
  maxMana: number = 100;
  manaRegen: number = 15;

  constructor() {
    super();
    this.mana = this.maxMana;
  }

  get manaLevel() :number {
    return this.mana / this.maxMana;
  }

  payManaCost(cost: number): boolean {
    const manaAfterCast = this.mana - cost;
    const canCast: boolean = manaAfterCast >= 0;

    if (canCast) {
      this.mana = manaAfterCast;
    }

    return canCast;
  }

  update({ deltaTime }: tickData): void {
    const manaTick: number = this.manaRegen * deltaTime;
    if (this.mana + manaTick <= this.maxMana) {
      this.mana += manaTick;
    }
  }
}