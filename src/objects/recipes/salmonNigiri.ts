import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";
import AssetManager from "../../utilities/assetManager.js";

export class SalmonNigiriItem extends Food{
  public readonly name = "Salmon Nigiri" as const;
  constructor(renderer: ThreeRenderer,x:number, y:number, z:number) {
    super(renderer, x,y,z, 'Salmon Nigiri');  
    this.isCookable = false;
    this.isChoppable = false;
  }
  
}
