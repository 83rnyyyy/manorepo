// objects/stations/stove.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Stove extends Station {
    hasItem = true;
    heldItem;
    cookwareLoc = [2.7, 1.6, -8.69];
    player;
    prompt(player) {
        if (!player.hasHeldItem() && this.hasItem)
            return "Hold E to pick up";
        else if (player.hasHeldItem() && player.getHeldItem()?.type == "pot" || player.getHeldItem()?.type == "pan")
            return "Hold E to place Item";
        return "Hold E to cook";
    }
    onBegin(_ctx) {
        // optional: start cooking animation/sfx
    }
    onComplete(ctx, player) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Cook complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        if (this.hasItem) {
            if (player.hasHeldItem())
                return;
            player.pickup(this.heldItem);
            this.heldItem = null;
            this.hasItem = false;
        }
        else {
            this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1.5, -1.1), this.rotation);
            this.hasItem = true;
        }
        // TODO: cook item in pan/pot
    }
}
//# sourceMappingURL=stove.js.map