import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";
import AssetManager from "../../utilities/assetManager.js";

export class CucumberItem extends Food{
  public readonly name = "Cucumber" as const;
  constructor(renderer: ThreeRenderer ,x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Cucumber');  
    this.isCookable = false;
    this.isChoppable = true;
  }
  
}
