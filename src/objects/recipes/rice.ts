// objects/items/plateItem.ts
import * as THREE from "three";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { ThreeRenderer } from "../../core/render.js";

export class RiceItem extends HoldableItem{
  public readonly type = "Rice" as const;
  constructor(renderer: ThreeRenderer, object: THREE.Object3D ,x:number, y:number, z:number) {
    super(renderer,object,x,y,z);  
  }

  
}