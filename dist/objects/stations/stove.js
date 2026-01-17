// objects/stations/stove.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Stove extends Station {
    hasItem = true;
    heldItem;
    cookwareLoc = [2.7, 1.6, -8.69];
    prompt(player) {
        if (!player.getHeldItem() && this.hasItem)
            if (this.heldItem?.name == "pot" && this.heldItem.potState == this.heldItem.uncooked)
                return "Hold E to cook rice";
            else
                return "Hold E to pick up";
        else if (player.getHeldItem() && player.getHeldItem()?.name == "pot" || player.getHeldItem()?.name == "pan")
            return "Hold E to place Item";
        return "Hold E to cook";
    }
    tick(dt, controller, playerWorldPos, player, three) {
        if (this.heldItem) {
            if (this.heldItem.name == "pot" && this.heldItem.potState == this.heldItem.empty) {
                if (player.getHeldItem() && player.getHeldItem().name != "Rice")
                    return;
            }
        }
        super.tick(dt, controller, playerWorldPos, player, three);
    }
    onComplete(player) {
        if (this.hasItem) {
            if (this.heldItem?.name == "pot") {
                const pot = this.heldItem;
                const playerItem = player.getHeldItem();
                if (pot.potState == pot.uncooked) {
                    console.log("here");
                    pot.swapToFilledCooked();
                    return;
                }
                else if (playerItem && playerItem.type === "ingredient" && !pot.itemInPot && playerItem.isCookable) {
                    pot.swapToFilledUncooked();
                    pot.itemInPot = player.removeHeldItem();
                    return;
                }
                // else if(pot.potState === pot.cooked){
                // 	player.pickup(pot.itemInPot!);
                // 	pot.itemInPot = null;
                // }
                else {
                    console.log(this.heldItem);
                    player.pickup(this.heldItem);
                    this.heldItem = null;
                    this.hasItem = false;
                }
                ;
            }
        }
        else {
            if (player.getHeldItem() && !(player.getHeldItem()?.name === "pot" || player.getHeldItem()?.name === "pan"))
                return;
            this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1.65, -1.1), this.rotation);
            this.hasItem = true;
        }
        // TODO: cook item in pan/pot
    }
}
//# sourceMappingURL=stove.js.map