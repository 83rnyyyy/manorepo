import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default class AssetManager {
    static manager = new THREE.LoadingManager();
    static loader = new GLTFLoader(AssetManager.manager);
    static library = {};
    static onProgress;
    static onError;
    static init() {
        AssetManager.manager.onProgress = (url, loaded, total) => AssetManager.onProgress?.(url, loaded, total);
        AssetManager.manager.onError = (url) => AssetManager.onError?.(url);
    }
    static async addAllAssets() {
        await Promise.all([
            this.addPrefab("Plate", "/public/Environment/glTF/Environment_Plate.gltf"),
            this.addPrefab("Rice", "/public/FoodIngredient_Rice.glb"),
            this.addPrefab("Salmon Fish", "/public/FoodIngredient_SalmonFish.glb"),
            this.addPrefab("Chopped Salmon", "/public/FoodIngredient_Salmon.glb"),
            this.addPrefab("Salmon Roll", "/public/Food_SalmonRoll.glb"),
            this.addPrefab('Empty Pot', "/public/Environment_Pot_1_Empty.glb"),
            this.addPrefab('Cooked Filled Pot', "/public/Environment_Pot_1_Filled.glb"),
            this.addPrefab('Uncooked Filled Pot', "/public/Environment/glTF/Environment_Pot_1_Filled.gltf"),
            this.addPrefab('Pan', "/public/Environment_Pan.glb"),
            this.addPrefab('Octopus', "/public/FoodIngredient_Octopus.glb"),
            this.addPrefab("Octopus Tentacle", "/public/FoodIngredient_Tentacle.glb"),
            this.addPrefab("Open Sea Urchin", "/public/Food/glTF/FoodIngredient_SeaUrchinOpen.gltf"),
            this.addPrefab("Closed Sea Urchin", "/public/Food/glTF/FoodIngredient_SeaUrchin.gltf"),
            this.addPrefab("Seaweed", "public/Food/glTF/FoodIngredient_Nori.gltf"),
            this.addPrefab("Cucumber", "public/Food/glTF/FoodIngredient_Cucumber.gltf"),
            this.addPrefab("Chopped Cucumber", "public/Food/glTF/FoodIngredient_SlicedCucumber.gltf"),
        ]);
    }
    static async addPrefab(key, url) {
        if (AssetManager.library[key])
            return;
        const gltf = await new Promise((resolve, reject) => {
            AssetManager.loader.load(url, resolve, undefined, reject);
        });
        AssetManager.library[key] = gltf.scene;
    }
    static create(key) {
        const prefab = AssetManager.library[key];
        if (!prefab)
            throw new Error(`Prefab not loaded: ${key}`);
        return prefab.clone(true);
    }
}
//# sourceMappingURL=assetManager.js.map