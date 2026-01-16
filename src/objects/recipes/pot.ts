// objects/items/potItem.ts
import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Cookware } from "../../utilities/cookware.js";
import AssetManager from "../../utilities/assetManager.js";
import { Food } from "../../utilities/food.js";

export class PotItem extends Cookware {
    public readonly name = "pot" as const;

    private emptyModel: THREE.Object3D = AssetManager.create("Empty Pot");
    private filledCookedModel: THREE.Object3D = AssetManager.create("Cooked Filled Pot");
    private filledUncookedModel: THREE.Object3D = AssetManager.create('Uncooked Filled Pot');
    public readonly empty: number = 0;
    public readonly uncooked:number = 1;
    public readonly cooked:number = 2;
    public itemInPot: Food | null = null;
    public potState:number = this.empty;
    constructor(
        renderer: ThreeRenderer,
        x: number,
        y: number,
        z: number
    ) {
        // IMPORTANT: stable root object that never changes
        const root = new THREE.Group();
        root.name = "PotRoot";

        super(renderer, root, x, y, z);
        // attach both to the root, toggle visibility
        this.object.add(this.emptyModel);
        this.object.add(this.filledUncookedModel);
        this.object.add(this.filledCookedModel);

        this.setFilled(this.empty);
    }

    

    private setFilled(state: number) {
        if(state === this.empty){
            
            this.emptyModel.visible = true;
            this.filledCookedModel.visible = false;
            this.filledUncookedModel.visible = false;

        }
        else if(state === this.uncooked){
        
        this.emptyModel.visible = false;
            this.filledCookedModel.visible = false;
            this.filledUncookedModel.visible = true;
        }
        else{
        this.emptyModel.visible = false;
        this.filledCookedModel.visible = true;
        this.filledUncookedModel.visible = false;
        }
        this.potState = state;
        
    }

    public swapToFilledUncooked() {
        this.setFilled(this.uncooked);
    }

    public swapToFilledCooked(){
        this.setFilled(this.cooked);
    }

    public swapToEmpty() {
        this.setFilled(this.empty);
    }
}