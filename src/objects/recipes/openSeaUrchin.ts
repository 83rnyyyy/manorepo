import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";

export class OpenedSeaUrchinItem extends Food{
  public readonly name = "Opened Sea Urchin" as const;
  constructor(renderer: ThreeRenderer, x:number, y:number, z:number) {
    super(renderer,x,y,z, 'Opened Sea Urchin');  
    this.isCookable = false;
    this.isChoppable = false;
  }
  
}
