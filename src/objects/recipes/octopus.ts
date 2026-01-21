import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";
import AssetManager from "../../utilities/assetManager.js";

export class OctopusItem extends Food{
  public readonly name = "Octopus" as const;
  constructor(renderer: ThreeRenderer, x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Octopus');  
    this.isCookable = false;
    this.isChoppable = true;
  }
  
}
