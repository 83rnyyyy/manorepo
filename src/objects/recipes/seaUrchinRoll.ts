import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";
import AssetManager from "../../utilities/assetManager.js";

export class SeaUrchinRoll extends Food{
  public readonly name = "Sea Urchin Roll" as const;
  constructor(renderer: ThreeRenderer, x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Sea Urchin Roll');  
    this.isCookable = false;
    this.isChoppable = false;
  }
  
}
