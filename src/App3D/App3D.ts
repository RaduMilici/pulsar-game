import { WebGLRenderer, Scene, PerspectiveCamera, Object3D } from 'three';
import { Updater, Component } from 'pulsar-pathfinding';
import { GameObject } from 'entities';
import { GameComponent } from 'components';
import { app3DSettings } from 'types';
import { findElement } from 'util';
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
    this.container = findElement(settings.containerSelector);
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
    this.removeChildren(this.scene);
    new Dispose(this.scene);
  }

  add(object: Object3D | GameObject | GameComponent | Component, parent?: Object3D | Scene): void {
    if (object instanceof GameObject) {
      object.updater = this.updater;
      object.components.forEach((component: GameComponent) => {
        component.updater = this.updater;
        component.gameObject = object;
        this.updater.add(component);
      });
      object.start();
    }

    if (object instanceof Object3D) {
      if (parent) {
        parent.add(object);
      }
    }

    if (object instanceof GameComponent || object instanceof Component) {
      object.updater = this.updater;
      this.updater.add(object);
    }
  }

  remove(object: Object3D | GameObject | GameComponent | Component): void {
    if (object instanceof GameObject) {
      this.removeChildren(object);
      this.updater.remove(object);
    }

    if (object instanceof GameComponent || object instanceof Component) {
      this.updater.remove(object);
    }

    if (object instanceof Object3D) {
      if (object.parent) {
        object.parent.remove(object);
      }
    }
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

  private removeChildren(parent: Object3D): void {
    for (let i = parent.children.length - 1; i >= 0; i--) {
      this.remove(parent.children[i]);
    }
  }
}
