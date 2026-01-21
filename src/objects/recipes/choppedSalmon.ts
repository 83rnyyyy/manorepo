import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";

export class ChoppedSalmonItem extends Food{
  public readonly name = "Chopped Salmon" as const;
  constructor(renderer: ThreeRenderer,x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Chopped Salmon');  
    this.isCookable = false;
    this.isChoppable = false;
  }
  
}
