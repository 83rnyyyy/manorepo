// objects/items/plateItem.ts
import * as THREE from "three";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";

export class SalmonFishItem extends Food{
  public readonly name = "salmonFish" as const;
  constructor(renderer: ThreeRenderer, object: THREE.Object3D ,x:number, y:number, z:number) {
    super(renderer,object,x,y,z);  
    this.isChoppable = true;
    this.isCookable = false;
  }

  
}