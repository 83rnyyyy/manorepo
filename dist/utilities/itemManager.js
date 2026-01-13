// objects/items/itemManager.ts
import * as THREE from "three";
export class ItemManager {
    items = [];
    add(item) {
        this.items.push(item);
    }
    remove(item) {
        const idx = this.items.indexOf(item);
        if (idx >= 0)
            this.items.splice(idx, 1);
    }
    update(_dt, controller, player) {
        // Only try pickup when key is down
        if (!controller.getButtonState("KeyE"))
            return;
        if (player.getHeldItem())
            return;
        const p = player.getWorldPos(new THREE.Vector3());
        // closest item within radius
        let best = null;
        let bestDist = Infinity;
        for (const it of this.items) {
            const ip = it.getWorldPos(new THREE.Vector3());
            const d = p.distanceTo(ip);
            if (d <= it.pickupRadius && d < bestDist) {
                bestDist = d;
                best = it;
            }
        }
        if (!best)
            return;
        player.pickup(best);
        this.remove(best);
    }
}
//# sourceMappingURL=itemManager.js.map