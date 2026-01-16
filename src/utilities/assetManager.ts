import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export type Assets = 'Plate' | 'Pan' | 'Rice' | 'Empty Pot' | 'Salmon Fish' | 'Chopped Salmon' |'Salmon Roll' | 'Uncooked Filled Pot' | 'Cooked Filled Pot';
type AssetLibrary = Partial<Record<Assets, THREE.Object3D>>;

export default class AssetManager {
  private static manager = new THREE.LoadingManager();
  private static loader = new GLTFLoader(AssetManager.manager);
  private static library: AssetLibrary = {}; 

  public static onProgress?: (url: string, loaded: number, total: number) => void;
  public static onError?: (url: string) => void;

  public static init() {
    AssetManager.manager.onProgress = (url, loaded, total) =>
    AssetManager.onProgress?.(url, loaded, total);
    AssetManager.manager.onError = (url) => AssetManager.onError?.(url);
  }
  public static async addAllAssets(){
    await Promise.all([
      this.addPrefab("Plate", "/public/Environment/glTF/Environment_Plate.gltf"),
      this.addPrefab("Rice", "/public/FoodIngredient_Rice.glb"),
      this.addPrefab("Salmon Fish", "/public/FoodIngredient_SalmonFish.glb"),
      this.addPrefab("Chopped Salmon", "/public/FoodIngredient_Salmon.glb"),
      this.addPrefab("Salmon Roll", "/public/Food_SalmonRoll.glb"),
      this.addPrefab('Empty Pot', "/public/Environment_Pot_1_Empty.glb"),
      this.addPrefab('Cooked Filled Pot',"/public/Environment_Pot_1_Filled.glb"),
      this.addPrefab('Uncooked Filled Pot', "/public/Environment/glTF/Environment_Pot_1_Filled.gltf"),
    ]);
  }

  public static async addPrefab(key: Assets, url: string): Promise<void> {
    if (AssetManager.library[key]) return;

    const gltf = await new Promise<any>((resolve, reject) => {
      AssetManager.loader.load(url, resolve, undefined, reject);
    });

    AssetManager.library[key] = gltf.scene as THREE.Object3D;
  }

  public static create(key: Assets): THREE.Object3D {
    const prefab = AssetManager.library[key];
    if (!prefab) throw new Error(`Prefab not loaded: ${key}`);
    return prefab.clone(true);
  }
}