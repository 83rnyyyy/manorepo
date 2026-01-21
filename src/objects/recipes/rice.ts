import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";

export class RiceItem extends Food{
  public readonly name = "Rice" as const;
  constructor(renderer: ThreeRenderer ,x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Rice');  
    this.isChoppable = false;
    this.isCookable = false;
  }

  
}
