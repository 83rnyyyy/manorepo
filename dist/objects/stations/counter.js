// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
import { PlateItem } from "../recipes/plate.js";
export class Counter extends Station {
    hasItem = false;
    heldItem;
    isPlate = false;
    promptText = '';
    prompt() {
        return this.promptText;
    }
    tick(dt, controller, playerWorldPos, player, three) {
        if (!this.hasItem) {
            if (player.getHeldItem()) {
                this.promptText = "Hold E to Place on Counter";
            }
            else {
                this.promptText = "";
                return;
            }
        }
        else if (player.getHeldItem())
            this.promptText = "Add Ingredient to Plate";
        else
            this.promptText = `Hold E To Pickup ${this.heldItem?.type} From Counter`;
        super.tick(dt, controller, playerWorldPos, player, three);
    }
    onComplete(player) {
        if (this.hasItem) {
            if (this.heldItem instanceof PlateItem && player.getHeldItem()) {
                const ingredient = player.removeHeldItem();
                (this.heldItem).addIngredient(ingredient);
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
            this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0.8, 1.35, 0), this.rotation);
            this.heldItem?.type;
            this.hasItem = true;
        }
        // TODO: convert ingredient -> chopped ingredient
    }
}
//# sourceMappingURL=counter.js.map