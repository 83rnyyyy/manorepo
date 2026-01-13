// objects/items/plateItem.ts
import * as THREE from "three";
import { HoldableItem } from "../../utilities/holdableItem.js";
export class PlateItem extends HoldableItem {
    type = "plate";
    heldIngredients = [];
    ingredientSocket = new THREE.Object3D();
    slots = [
        new THREE.Vector3(0.00, 0.05, 0.00),
        new THREE.Vector3(0.12, 0.05, 0.00),
        new THREE.Vector3(-0.12, 0.05, 0.00),
        new THREE.Vector3(0.00, 0.05, 0.12),
        new THREE.Vector3(0.00, 0.05, -0.12),
    ];
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.object.add(this.ingredientSocket);
        this.ingredientSocket.position.set(0, 0, 0);
    }
    clearIngredients() {
        for (const ingredient of this.heldIngredients) {
            ingredient.object.removeFromParent();
            ingredient.object.traverse((o) => {
                o.geometry?.dispose?.();
                const m = o.material;
                if (Array.isArray(m))
                    m.forEach((x) => x.dispose?.());
                else
                    m?.dispose?.();
            });
        }
        this.heldIngredients.length = 0;
    }
    addIngredient(item) {
        const i = this.heldIngredients.length;
        let slot;
        if (this.slots[i]) {
            slot = this.slots[i];
        }
        else {
            slot = this.slots[this.slots.length - 1];
        }
        item.object.removeFromParent();
        this.ingredientSocket.add(item.object);
        item.object.position.copy(slot);
        item.object.rotation.set(0, 0, 0);
        this.heldIngredients.push(item);
    }
}
//# sourceMappingURL=plate.js.map