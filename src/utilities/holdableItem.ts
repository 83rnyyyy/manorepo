// objects/items/holdableItem.ts
import * as THREE from "three";

export type ItemType = "plate" | "ingredient" | "pan";

export abstract class HoldableItem {
  public readonly object: THREE.Object3D;
  public abstract readonly type: ItemType;

  // pickup interaction radius (world distance)
  public pickupRadius = 0.9;

  constructor(object: THREE.Object3D) {
    this.object = object;
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
