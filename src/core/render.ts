// ThreeRenderer.ts (drop-in replacement)
// Keeps your existing API: spawnPlayer(url,pos), loadGLB, render, destroy.
// Adds: addPlayerVariant(name,url) and switchPlayerVariant(name)

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Variant = {
  obj: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  clips: THREE.AnimationClip[];
  actions: Record<string, THREE.AnimationAction>;
};

export class ThreeRenderer {
  public readonly scene: THREE.Scene;
  public readonly camera: THREE.PerspectiveCamera;
  public readonly renderer: THREE.WebGLRenderer;
  public readonly controls: OrbitControls;

  // NOTE: "player" is now a stable ROOT container. Your Player can move/rotate this.
  private player: THREE.Object3D | null = null;

  // ===== your existing fields =====
  public playerMixer!: THREE.AnimationMixer;
  public playerClips: THREE.AnimationClip[] = [];
  public playerActions: Record<string, THREE.AnimationAction> = {};
  // ===============================

  // ===== NEW: variants =====
  private variants: Record<string, Variant> = {};
  private activeVariant: string = "default";
  // ========================

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 2, 60);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(3, 5, 2);
    this.scene.add(dir);

    window.addEventListener("resize", this.onResize);
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.update();
  };

  private clearActionsObject(obj: Record<string, any>) {
    for (const k of Object.keys(obj)) delete obj[k];
  }

  private async loadVariant(url: string, parent: THREE.Object3D): Promise<Variant> {
    const loader = new GLTFLoader();
    const gltf = await new Promise<any>((resolve, reject) => {
      loader.load(url, (g) => resolve(g), undefined, reject);
    });

    const obj: THREE.Object3D = gltf.scene;
    obj.scale.setScalar(1);
    obj.position.set(0, 0, 0);
    obj.rotation.set(0, 0, 0);
    obj.visible = false;
    parent.add(obj);

    const mixer = new THREE.AnimationMixer(obj);
    const clips: THREE.AnimationClip[] = gltf.animations ?? [];
    const actions: Record<string, THREE.AnimationAction> = {};
    for (const clip of clips) actions[clip.name] = mixer.clipAction(clip);

    return { obj, mixer, clips, actions };
  }

  private applyVariant(name: string) {
    const next = this.variants[name];
    if (!next) throw new Error(`Variant "${name}" not loaded`);

    // hide current, show next
    const cur = this.variants[this.activeVariant];
    if (cur) cur.obj.visible = false;

    next.obj.visible = true;
    this.activeVariant = name;

    // swap "active" mixer/clips and mutate the SAME actions object (important)
    this.playerMixer = next.mixer;
    this.playerClips = next.clips;

    this.clearActionsObject(this.playerActions);
    Object.assign(this.playerActions, next.actions);
  }

  // ===== unchanged signature =====
  // NOTE: returns a ROOT container (stable reference) instead of the raw gltf.scene mesh.
  // Your existing movement/collision will still work; you can still find bones via root.getObjectByName(...)
  public async spawnPlayer(url: string, pos: THREE.Vector3): Promise<THREE.Object3D> {
    // create root once
    const root = new THREE.Object3D();
    root.position.copy(pos);
    this.scene.add(root);

    this.player = root;

    // load default variant into root
    this.variants = {};
    this.activeVariant = "default";
    this.variants["default"] = await this.loadVariant(url, root);

    // show default + expose mixer/actions like before
    this.applyVariant("default");

    return root;
  }

  // ===== NEW: load additional player model variants into the same root =====
  public async addPlayerVariant(name: string, url: string): Promise<void> {
    if (!this.player) throw new Error("Call spawnPlayer(...) before addPlayerVariant(...)");
    if (this.variants[name]) return; // already loaded

    this.variants[name] = await this.loadVariant(url, this.player);
  }

  // ===== NEW: switch between already-loaded variants =====
  public switchPlayerVariant(name: string): void {
    if (!this.variants[name]) throw new Error(`Variant "${name}" not loaded`);
    if (name === this.activeVariant) return;
    this.applyVariant(name);
  }

  public loadGLB(url: string): Promise<THREE.Object3D> {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          this.scene.add(model);

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());

          model.position.sub(center);
          model.position.y += 2;

          this.controls.target.set(0, 0, 0);
          this.controls.update();

          resolve(model);
        },
        undefined,
        reject
      );
    });
  }

  public render(): void {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public destroy(): void {
    window.removeEventListener("resize", this.onResize);
    this.controls.dispose();
    this.renderer.dispose();
  }
}
