// objects/items/holdableItem.ts
import * as THREE from "three";
import { worldObject } from "../objects/recipes/worldObject.js";
export class HoldableItem extends worldObject {
    // pickup interaction radius (world distance)
    pickupRadius = 0.9;
    constructor(renderer, object, x, y, z) {
        super(x, y, z, object, renderer);
    }
    getWorldPos(out = new THREE.Vector3()) {
        return this.object.getWorldPosition(out);
    }
    setWorldPos(pos) {
        this.object.position.copy(pos);
    }
}
//# sourceMappingURL=holdableItem.js.map