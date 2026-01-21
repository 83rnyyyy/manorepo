import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";
import AssetManager from "../../utilities/assetManager.js";

export class TentacleItem extends Food{
  public readonly name = "Octopus Tentacle" as const;
  constructor(renderer: ThreeRenderer,x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Octopus Tentacle');  
    this.isCookable = false;
    this.isChoppable = false;
  }
  
}
