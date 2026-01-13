// objects/stations/stove.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Stove extends Station {
    hasItem = true;
    heldItem;
    cookwareLoc = [2.7, 1.6, -8.69];
    prompt(player) {
        if (!player.getHeldItem() && this.hasItem)
            if (this.heldItem?.type == "pot" && this.heldItem.potState == this.heldItem.uncooked)
                return "Hold E to cook rice";
            else
                return "Hold E to pick up";
        else if (player.getHeldItem() && player.getHeldItem()?.type == "pot" || player.getHeldItem()?.type == "pan")
            return "Hold E to place Item";
        return "Hold E to cook";
    }
    onBegin(_ctx) {
        // optional: start cooking animation/sfx
    }
    tick(dt, controller, playerWorldPos, ctx, player, three) {
        if (this.heldItem) {
            if (this.heldItem.type == "pot" && this.heldItem.potState == this.heldItem.empty) {
                if (player.getHeldItem() && player.getHeldItem().type != "Rice")
                    return;
            }
        }
        super.tick(dt, controller, playerWorldPos, ctx, player, three);
    }
    onComplete(ctx, player) {
        if (this.hasItem) {
            if (this.heldItem?.type == "pot") {
                const pot = this.heldItem;
                ;
                if (pot.potState == pot.uncooked) {
                    pot.swapToFilledCooked();
                    return;
                }
                else if (player.getHeldItem() && player.getHeldItem()?.type == "Rice") {
                    pot.swapToFilledUncooked();
                    player.removeHeldItem();
                    return;
                }
                else {
                    player.pickup(this.heldItem);
                    this.heldItem = null;
                    this.hasItem = false;
                }
            }
        }
        else {
            if (player.getHeldItem())
                return;
            this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1.5, -1.1), this.rotation);
            this.hasItem = true;
        }
        // TODO: cook item in pan/pot
    }
}
//# sourceMappingURL=stove.js.map