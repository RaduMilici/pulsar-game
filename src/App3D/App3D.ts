import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { Updater, Component } from 'pulsar-pathfinding';
import { GameObject } from '../entities';
import { GameComponent } from '../components';
import { app3DSettings } from '../types';
import Render from './Render.component';

export default class App3D {
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly container: HTMLElement;

  readonly scene: Scene = new Scene();
  readonly updater: Updater = new Updater();

  constructor(settings: app3DSettings) {
    this.camera = App3D.createCamera(settings);
    this.container = App3D.getContainer(settings.containerSelector);
    this.renderer = App3D.createRenderer(settings);
    this.container.appendChild(this.renderer.domElement);
    this.updater.onUpdateComplete = new Render(this);
  }

  start(): boolean {
    return this.updater.start();
  }

  stop(): boolean {
    return this.updater.stop();
  }

  add(object: GameObject | GameComponent | Component): void {
    if (object instanceof GameObject) {
      object.components.forEach((component: GameComponent) => {
        component.gameObject = object;
      });
      this.updater.add(object);
      this.scene.add(object);
    }

    if (object instanceof GameComponent || object instanceof Component) {
      this.updater.add(object);
    }
  }

  remove(object: GameObject | GameComponent | Component): void {
    if (object instanceof GameObject) {
      this.updater.remove(object);
      this.scene.remove(object);
    }

    if (object instanceof GameComponent || object instanceof Component) {
      this.updater.remove(object);
    }
  }

  private static getContainer(selector: string): HTMLElement | null {
    const container: HTMLElement | null = document.querySelector(selector);

    if (container === null) {
      console.error(`Can't find container with selector ${selector}`);
    }

    return container;
  }

  private static createCamera({
    camera,
    renderer,
  }: app3DSettings): PerspectiveCamera {
    const { fov, near, far } = camera;
    const { width, height } = renderer;
    return new PerspectiveCamera(fov, width / height, near, far);
  }

  private static createRenderer({ renderer }: app3DSettings): WebGLRenderer {
    const { width, height, antialias } = renderer;
    const webGLRenderer: WebGLRenderer = new WebGLRenderer({ antialias });
    webGLRenderer.setSize(width, height);
    return webGLRenderer;
  }
}
