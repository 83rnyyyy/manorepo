import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";

export class TentacleItem extends Food{
  public readonly name = "octopusTentacle" as const;
  constructor(renderer: ThreeRenderer, object: THREE.Object3D ,x:number, y:number, z:number) {
    super(renderer,object,x,y,z);  
    this.isCookable = false;
    this.isChoppable =false;
  }
  
}