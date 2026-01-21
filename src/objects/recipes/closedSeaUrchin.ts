import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";
import AssetManager from "../../utilities/assetManager.js";

export class ClosedSeaUrchinItem extends Food{
  public readonly name = "Closed Sea Urchin" as const;
  constructor(renderer: ThreeRenderer,x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Closed Sea Urchin');  
    this.isCookable = false;
    this.isChoppable = true;
  }
  
}
