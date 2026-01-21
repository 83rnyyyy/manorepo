// objects/items/holdableItem.ts
import * as THREE from "three";
export class HoldableItem {
    object;
    x;
    y;
    z;
    vel = new THREE.Vector3(0, 0, 0);
    radius = 0.35;
    moving = false;
    pickupRadius = 2;
    scale = 1;
    constructor(renderer, object, x, y, z) {
        this.object = object;
        this.x = x;
        this.y = y;
        this.z = z;
        this.object.position.set(x, y, z);
        this.object.scale.setScalar(this.scale);
        // keep gameplay radii in sync with visuals
        this.radius *= this.scale;
        this.pickupRadius *= this.scale;
        renderer.scene.add(this.object);
    }
    deleteObject() {
        this.object.removeFromParent();
        this.object.traverse((o) => {
            o.geometry?.dispose?.();
            const m = o.material;
            if (Array.isArray(m))
                m.forEach((x) => x.dispose?.());
            else
                m?.dispose?.();
        });
    }
}
//# sourceMappingURL=holdableItem.js.map