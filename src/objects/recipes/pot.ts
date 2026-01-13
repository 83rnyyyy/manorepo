// objects/items/potItem.ts
import * as THREE from "three";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { ThreeRenderer } from "../../core/render.js";

export class PotItem extends HoldableItem {
  public readonly type = "pot" as const;

  private emptyModel: THREE.Object3D;
  private filledUncookedModel: THREE.Object3D;
  private filledCookedModel: THREE.Object3D;
  
  public readonly empty: number = 0;
  public readonly uncooked:number = 1;
  private readonly cooked:number = 2;
  public potState:number = this.empty;
  constructor(
    renderer: ThreeRenderer,
    emptyModel: THREE.Object3D,
    filledCookedModel: THREE.Object3D,
    filledUncookedModel: THREE.Object3D,
    x: number,
    y: number,
    z: number
  ) {
    // IMPORTANT: stable root object that never changes
    const root = new THREE.Group();
    root.name = "PotRoot";

    super(renderer, root, x, y, z);

    this.emptyModel = emptyModel;
    this.filledCookedModel = filledCookedModel;
    this.filledUncookedModel = filledUncookedModel;

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
      console.log("asdas")
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
