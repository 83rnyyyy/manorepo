// ThreeRenderer.ts
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class ThreeRenderer {
  public readonly scene: THREE.Scene;
  public readonly camera: THREE.PerspectiveCamera;
  public readonly renderer: THREE.WebGLRenderer;

  public readonly controls: OrbitControls;

  private player: THREE.Object3D | null = null;
  
  // ===== NEW STUFF (added) =====
  public playerMixer: THREE.AnimationMixer;
  public playerClips: THREE.AnimationClip[] = [];
  public playerActions: Record<string, THREE.AnimationAction> = {};
  // ============================

  public async spawnPlayer(url: string, pos: THREE.Vector3): Promise<THREE.Object3D> {
    const loader = new GLTFLoader();

    // ===== NEW STUFF (added): load full gltf so we can read animations =====
    const gltf = await new Promise<any>((resolve, reject) => {
      loader.load(url, (g) => resolve(g), undefined, reject);
    });
    const playerObj: THREE.Object3D = gltf.scene;
    // =====================================================================

    playerObj.scale.setScalar(1);
    playerObj.position.copy(pos);
    this.scene.add(playerObj);
    this.playerMixer = new THREE.AnimationMixer(playerObj);
    // ===== NEW STUFF (added): build mixer + actions =====
    this.playerActions = {};
    this.playerClips = gltf.animations ?? [];

    if (this.playerClips.length > 0) {
      for (const clip of this.playerClips) {
        this.playerActions[clip.name] = this.playerMixer.clipAction(clip);
      }
    }
    // ===================================================

    this.player = playerObj;
    return playerObj;
  }

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(5, 2, 60);

    // ORBIT CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 0, 0); // will be updated after map loads if you want
    this.controls.update();

    // lights
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

  public loadGLB(url: string): Promise<THREE.Object3D> {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          this.scene.add(model);

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          model.position.sub(center);
          model.position.y += 2;

          // OPTIONAL: set orbit target to map center (after centering it's 0,0,0)
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
    this.controls.update(); // REQUIRED for damping
    this.renderer.render(this.scene, this.camera);
  }

  public destroy(): void {
    window.removeEventListener("resize", this.onResize);
    this.controls.dispose();
    this.renderer.dispose();
  }
}
