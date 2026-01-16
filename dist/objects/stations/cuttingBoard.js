// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
import RecipeManager from "../recipes/recipeManager.js";
export class CuttingBoard extends Station {
    heldItem;
    prompt(player) {
        if (this.heldItem) {
            if (this.heldItem.isChoppable)
                return `Hold E To Chop ${this.heldItem?.name}`;
            else
                return `Hold E To Pickup ${this.heldItem?.name} From Board`;
        }
        else if (player.getHeldItem()?.type == "ingredient")
            return `Hold E To Place ${player.getHeldItem().name} On Board`;
        return "";
    }
    onBegin(_ctx) {
    }
    useAnimation(three, player) {
        if (this.heldItem) {
            if (this.heldItem.isChoppable) {
                three.switchPlayerVariant("knife");
                player.startAction("Chop_Loop", 1.25);
            }
        }
    }
    onComplete(ctx, player, three) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        three.switchPlayerVariant("default");
        const playerItem = player.getHeldItem();
        if (this.heldItem) {
            if (this.heldItem.isChoppable) {
                this.heldItem.deleteObject();
                this.heldItem = RecipeManager.chopItem(this.heldItem, three);
                this.heldItem.object.removeFromParent();
                this.anchor.add(this.heldItem.object);
                const localOffset = new THREE.Vector3(0, 1, 0);
                this.heldItem.object.position.copy(localOffset);
                this.heldItem.object.rotation.set(0, 0, 0);
            }
            else if (player.getHeldItem())
                return;
            else {
                player.pickup(this.heldItem);
                this.heldItem = null;
            }
        }
        else if (playerItem && playerItem.type !== 'cookware') {
            this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1, 0), this.rotation);
        }
    }
    onCancel(three, player) {
        three.switchPlayerVariant("default");
        player.stopAction();
    }
}
//# sourceMappingURL=cuttingBoard.js.map