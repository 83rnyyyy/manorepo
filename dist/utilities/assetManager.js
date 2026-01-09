// import * as THREE from "three";
// import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils.js";
// type Manifest = {
//   glbs?: Record<string, string>;     // key -> url
//   textures?: Record<string, string>; // key -> url
// };
// export default class AssetManager {
//   private manager = new THREE.LoadingManager();
//   private gltfLoader = new GLTFLoader(this.manager);
//   private textureLoader = new THREE.TextureLoader(this.manager);
//   private glbs = new Map<string, GLTF>();
//   private textures = new Map<string, THREE.Texture>();
//   // optional hooks (for a loading screen)
//   public onProgress?: (url: string, loaded: number, total: number) => void;
//   public onError?: (url: string) => void;
//   constructor() {
//     this.manager.onProgress = (url, loaded, total) => this.onProgress?.(url, loaded, total);
//     this.manager.onError = (url) => this.onError?.(url);
//   }
//   public async preloadAll(manifest: Manifest): Promise<void> {
//     const tasks: Promise<void>[] = [];
//     if (manifest.glbs) {
//       for (const [key, url] of Object.entries(manifest.glbs)) {
//         tasks.push(this.preloadGLB(key, url));
//       }
//     }
//     if (manifest.textures) {
//       for (const [key, url] of Object.entries(manifest.textures)) {
//         tasks.push(this.preloadTexture(key, url));
//       }
//     }
//     await Promise.all(tasks);
//   }
//   public async preloadGLB(key: string, url: string): Promise<void> {
//     if (this.glbs.has(key)) return;
//     const gltf = await this.gltfLoader.loadAsync(url);
//     this.glbs.set(key, gltf);
//   }
//   public async preloadTexture(key: string, url: string): Promise<void> {
//     if (this.textures.has(key)) return;
//     const tex = await this.textureLoader.loadAsync(url);
//     this.textures.set(key, tex);
//   }
//   public getGLB(key: string): GLTF {
//     const gltf = this.glbs.get(key);
//     if (!gltf) throw new Error(`GLB not loaded: ${key}`);
//     return gltf;
//   }
//   public getTexture(key: string): THREE.Texture {
//     const tex = this.textures.get(key);
//     if (!tex) throw new Error(`Texture not loaded: ${key}`);
//     return tex;
//   }
//   /** Use this for items/characters you want to place multiple times */
//   public instantiateModel(key: string): THREE.Object3D {
//     const src = this.getGLB(key).scene;
//     // SkeletonUtils.clone handles skinned/rigged models safely (also fine for non-skinned)
//     return SkeletonUtils.clone(src) as THREE.Object3D;
//   }
//   /** Convenience: clone + add to scene + apply transform */
//   public spawnModel(
//     key: string,
//     scene: THREE.Scene,
//     opts?: {
//       position?: THREE.Vector3;
//       rotation?: THREE.Euler;
//       scale?: THREE.Vector3 | number;
//       name?: string;
//     }
//   ): THREE.Object3D {
//     const obj = this.instantiateModel(key);
//     if (opts?.name) obj.name = opts.name;
//     if (opts?.position) obj.position.copy(opts.position);
//     if (opts?.rotation) obj.rotation.copy(opts.rotation);
//     if (typeof opts?.scale === "number") obj.scale.setScalar(opts.scale);
//     else if (opts?.scale) obj.scale.copy(opts.scale);
//     scene.add(obj);
//     return obj;
//   }
// }
//# sourceMappingURL=assetManager.js.map