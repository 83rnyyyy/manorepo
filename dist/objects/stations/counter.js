// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Counter extends Station {
    hasItem = false;
    heldItem;
    isPlate = false;
    prompt(player) {
        if (!this.hasItem)
            return "Hold E to Place on Counter";
        else if (player.getHeldItem() && this.heldItem?.type === 'plate')
            return "Add Ingredient to Plate";
        else
            return `Hold E To Pickup ${this.heldItem?.type} From Counter`;
    }
    onBegin(_ctx) {
        // optional: start animation/sfx
    }
    onComplete(ctx, player) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        if (this.hasItem) {
            if (player.getHeldItem() && this.heldItem?.type === 'plate') {
                const ingredient = player.removeHeldItem();
                this.heldItem.addIngredient(ingredient);
            }
            else {
                player.pickup(this.heldItem);
                this.heldItem = null;
                this.hasItem = false;
            }
        }
        else {
            if (!player.getHeldItem())
                return;
            this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0.85, 1.35, 0), this.rotation);
            this.heldItem?.type;
            this.hasItem = true;
        }
        // TODO: convert ingredient -> chopped ingredient
    }
}
//# sourceMappingURL=counter.js.map