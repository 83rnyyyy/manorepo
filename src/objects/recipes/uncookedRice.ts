import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";

export class UncookedRiceItem extends Food{
  public readonly name = "Uncooked Rice" as const;
  constructor(renderer: ThreeRenderer,x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Uncooked Rice');  
    this.isCookable = true;
    this.isChoppable = false;
  }
  
}
