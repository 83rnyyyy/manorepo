// objects/items/plateItem.ts
import * as THREE from "three";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";
import AssetManager from "../../utilities/assetManager.js";

export class SalmonFishItem extends Food{
  public readonly name = "Salmon Fish" as const;
  constructor(renderer: ThreeRenderer,x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Salmon Fish');  
    this.isChoppable = true;
    this.isCookable = false;
  }

  
}
