import { uniqueId, removeFromArray } from 'pulsar-pathfinding';
import App3D from '../App3D/App3D';

class EventData {
  readonly id: number = uniqueId();
  readonly element: HTMLElement;

  constructor(
    readonly selector: string,
    readonly type: string,
    readonly callback: (event: Event) => any
  ) {
    this.element = App3D.getElement(selector);
    this.element.addEventListener(type, callback, false);
  }
}

export default class EventManager {
  private events: EventData[] = [];

  add(selector: string, type: string, callback: (event: Event) => any): number {
    const data: EventData = new EventData(selector, type, callback);
    this.events.push(data);

    return data.id;
  }

  remove(removeSelector: string): void {
    const data: EventData = this.events.find(
      ({ selector }: EventData) => selector === removeSelector
    );

    if (!data) return;

    data.element.removeEventListener(data.type, data.callback);
    removeFromArray(this.events, data);
  }
}
