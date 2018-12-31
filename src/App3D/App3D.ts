import { WebGLRenderer, Scene, PerspectiveCamera, Object3D } from 'three';
import { Updater, Component } from 'pulsar-pathfinding';
import { app3DSettings } from 'types';
import { findElement } from 'util';
import GameObject from 'entities/GameObject';
import GameComponent from 'components/GameComponent';
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
    if (object instanceof Object3D) {
      parent ? parent.add(object) : this.scene.add(object);
    }

    if (object instanceof GameObject) {
      this.addGameObject(object);
    }

    if (object instanceof GameComponent || object instanceof Component) {
      this.updater.add(object);
    }
  }

  remove(object: Object3D | GameObject | GameComponent | Component): void {
    if (object instanceof GameObject) {
      this.removeGameObject(object);
    }

    if (object instanceof GameComponent || object instanceof Component) {
      this.updater.remove(object);
    }

    if (object instanceof Object3D && object.parent) {
      object.parent.remove(object);
    }
  }

  private addGameObject(object: GameObject): void {
    object.components.forEach((component: GameComponent) => (component.gameObject = object));
    this.updater.add(object);
  }

  private removeGameObject(object: GameObject): void {
    this.updater.remove(object);
    this.removeChildren(object);
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
