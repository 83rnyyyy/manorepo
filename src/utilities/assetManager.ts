import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export type Assets = 'Uncooked Rice' |'Pot'|'Octopus Nigiri'|'Salmon Nigiri' |'Sea Urchin Roll'|'Cucumber' | 'Chopped Cucumber' | 'Plate' | 'Pan' | 'Rice' | 'Empty Pot' | 'Salmon Fish' | 'Chopped Salmon' | 'Salmon Roll' | 'Uncooked Filled Pot' | 'Cooked Filled Pot' | 'Octopus' | 'Octopus Tentacle' | 'Opened Sea Urchin' | 'Closed Sea Urchin' | 'Seaweed';
type AssetLibrary = Partial<Record<Assets, THREE.Object3D>>;

export default class AssetManager {
  private static manager = new THREE.LoadingManager();
  private static loader = new GLTFLoader(AssetManager.manager);
  private static library: AssetLibrary = {};

  public static onProgress?: (url: string, loaded: number, total: number) => void;
  public static onError?: (url: string) => void;

  // prevents double-loading if you call it twice by accident
  private static loadAllPromise: Promise<void> | null = null;
  private static readonly ASSETS: [Assets, string][] = [
    // core items
    ["Plate", "/public/Environment/glTF/Environment_Plate.gltf"],
    ["Empty Pot", "/public/Environment_Pot_1_Empty.glb"],
    ["Pan", "/public/Environment_Pan.glb"],
    ["Rice", "/public/FoodIngredient_Rice.glb"],
    ["Salmon Fish", "/public/FoodIngredient_SalmonFish.glb"],
    ["Chopped Salmon", "/public/FoodIngredient_Salmon.glb"],
    ["Salmon Roll", "/public/Food_SalmonRoll.glb"],
    ["Cooked Filled Pot", "/public/Environment_Pot_1_Filled.glb"],
    ["Uncooked Filled Pot", "/public/Environment/glTF/Environment_Pot_1_Filled.gltf"],
    ["Octopus", "/public/FoodIngredient_Octopus.glb"],
    ["Octopus Tentacle", "/public/FoodIngredient_Tentacle.glb"],
    ["Opened Sea Urchin", "/public/Food/glTF/FoodIngredient_SeaUrchinOpen.gltf"],
    ["Closed Sea Urchin", "/public/Food/glTF/FoodIngredient_SeaUrchin.gltf"],
    ["Seaweed", "/public/Food/glTF/FoodIngredient_Nori.gltf"],
    ["Cucumber", "/public/Food/glTF/FoodIngredient_Cucumber.gltf"],
    ["Chopped Cucumber", "/public/Food/glTF/FoodIngredient_SlicedCucumber.gltf"],
    ["Sea Urchin Roll", "/public/Food_SeaUrchinRoll.glb"],
    ["Salmon Nigiri", "/public/Food_SalmonNigiri.glb"],
    ["Octopus Nigiri", "/public/Food_OctopusNigiri.glb"],
    ["Uncooked Rice", "/public/FoodIngredient_UncookedRice.glb"],

    // OPTIONAL: if "Pot" is meant to be the same as "Empty Pot", you can map it:
    // ["Pot", "/public/Environment_Pot_1_Empty.glb"],
  ];

  public static getLoadingManager(): THREE.LoadingManager {
    return AssetManager.manager;
  }

  public static init() {
    THREE.Cache.enabled = true;

    AssetManager.manager.onProgress = (url, loaded, total) =>
      AssetManager.onProgress?.(url, loaded, total);

    AssetManager.manager.onError = (url) => AssetManager.onError?.(url);
  }

  public static async loadAllAssets(): Promise<void> {
    if (this.loadAllPromise) return this.loadAllPromise;

    this.loadAllPromise = (async () => {
      const MAX_PARALLEL = 4;

      for (let i = 0; i < this.ASSETS.length; i += MAX_PARALLEL) {
        const chunk = this.ASSETS.slice(i, i + MAX_PARALLEL);
        await Promise.all(chunk.map(([key, url]) => this.addPrefab(key, url)));
      }
    })();

    return this.loadAllPromise;
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
