// objects/items/holdableItem.ts
import * as THREE from "three";
export class HoldableItem {
    object;
    // pickup interaction radius (world distance)
    pickupRadius = 0.9;
    constructor(object) {
        this.object = object;
    }
    getWorldPos(out = new THREE.Vector3()) {
        return this.object.getWorldPosition(out);
    }
    setWorldPos(pos) {
        this.object.position.copy(pos);
    }
    onPickup() { }
    onDrop() { }
}
//# sourceMappingURL=holdableItem.js.map