import { skillData } from 'types';
import { GameObject } from 'entities';
import Cooldown from './Cooldown';

export default class Skill {
  cooldownTime: number = 0;
  private cooldown: Cooldown = new Cooldown(0);

  get onCooldown(): boolean {
    return !this.cooldown.done;
  }

  use(data: skillData): void {
    if (!this.onCooldown) {
      this.createEffect(data);
    }
    this.triggerCooldown();
  }

  createEffect(skillData: any): void {
    return skillData;
  }

  private triggerCooldown() {
    if (!this.onCooldown) {
      this.cooldown = new Cooldown(this.cooldownTime);
      GameObject.app3D.add(this.cooldown);
    }
  }
}
