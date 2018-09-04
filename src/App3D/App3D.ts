import { WebGLRenderer, Scene, PerspectiveCamera, Object3D } from 'three';
import { Updater, Component } from 'pulsar-pathfinding';
import { GameObject } from '../entities';
import { GameComponent } from '../components';
import { app3DSettings } from '../types';
import Render from './Render';
import Dispose from './Dispose';

export default class App3D {
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly container: HTMLElement;

  readonly scene: Scene = new Scene();
  readonly updater: Updater = new Updater();

  constructor(readonly settings: app3DSettings) {
    this.camera = App3D.createCamera(settings);
    this.container = App3D.getElement(settings.containerSelector);
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

  clear(): void {
    this.updater.clear();
    this.removeSceneChildren();
    new Dispose(this.scene);
  }

  add(object: GameObject | GameObject[] | GameComponent | Component, parent?: GameObject): void {
    if (object instanceof GameObject) {
      object.updater = this.updater;
      object.components.forEach((component: GameComponent) => {
        component.updater = this.updater;
        component.gameObject = object;
        this.updater.add(component);
      });
      object.start();

      if (parent) {
        parent.add(object);
      } else if (!object.parent) {
        this.scene.add(object);
      }
    }

    if (object instanceof GameComponent || object instanceof Component) {
      object.updater = this.updater;
      this.updater.add(object);
    }
  }

  remove(object: Object3D | GameObject | GameComponent | Component): void {
    if (object instanceof GameObject) {
      this.updater.remove(object);
    }

    if (object instanceof GameComponent || object instanceof Component) {
      this.updater.remove(object);
    }

    if (object instanceof Object3D) {
      this.scene.remove(object);
    }
  }

  static getElement(selector: string): HTMLElement | null {
    const container: HTMLElement | null = document.querySelector(selector);

    if (container === null) {
      console.error(`Can't find container with selector ${selector}`);
    }

    return container;
  }

  private static createCamera({ camera, renderer }: app3DSettings): PerspectiveCamera {
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

  private removeSceneChildren(): void {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      this.remove(this.scene.children[i]);
    }
  }
}
