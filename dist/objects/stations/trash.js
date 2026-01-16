// objects/stations/trash.ts (optional but common)
import * as THREE from "three";
import { Station } from "./station.js";
import { PlateItem } from "../recipes/plate.js";
import { PotItem } from "../recipes/pot.js";
export class Trash extends Station {
    prompt() {
        return "Hold E to throw away";
    }
    onComplete(ctx, player) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Trash complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        if (player.getHeldItem()) {
            const heldItem = player.getHeldItem();
            if (heldItem instanceof PlateItem) {
                (heldItem).clearIngredients();
            }
            else if (heldItem instanceof PotItem) {
                const pot = heldItem;
                pot.swapToEmpty();
            }
            else {
                player.deleteHeldItem();
            }
        }
        // TODO: delete item in player's hands
    }
}
//# sourceMappingURL=trash.js.map