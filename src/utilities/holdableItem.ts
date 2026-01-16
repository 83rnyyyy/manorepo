// objects/items/holdableItem.ts
import * as THREE from "three";
import { ThreeRenderer } from "../core/render.js";
import { worldObject } from "../objects/recipes/worldObject.js";


export type ItemType = "ingredient" | "cookware";
export type ItemName = "plate" | "pan" | "Rice" | "salmonFish" | "choppedSalmon" | "pot";

export abstract class HoldableItem extends worldObject{
  public abstract readonly name: ItemName;
  public abstract readonly type: ItemType;

  // pickup interaction radius (world distance)
  public pickupRadius = 0.9;

  constructor(renderer: ThreeRenderer, object: THREE.Object3D ,x:number, y:number, z:number) {
    super(x,y,z,object,renderer);
  }

  public getWorldPos(out = new THREE.Vector3()): THREE.Vector3 {
    return this.object.getWorldPosition(out);
  }

  public setWorldPos(pos: THREE.Vector3) {
    this.object.position.copy(pos);
  }

  public onPickup() {}
  public onDrop() {}
}