// objects/items/plateItem.ts
import * as THREE from "three";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { worldObject } from "./worldObject.js";
import { ThreeRenderer } from "../../core/render.js";

export class PlateItem extends worldObject{
  public readonly type = "plate" as const;
  constructor(renderer: ThreeRenderer, object: THREE.Object3D,x:number, y:number, z:number) {
    super(x,y,z,object,renderer);  
  }

  
}
