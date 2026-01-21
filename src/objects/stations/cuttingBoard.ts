// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { Food } from "../../utilities/food.js";
import RecipeManager from "../recipes/recipeManager.js";

export class CuttingBoard extends Station {
	private heldItem: Food | null;
	public prompt(player: Player): string {
		const playerItem = player.getHeldItem();
		if (this.heldItem) {
			if (this.heldItem.isChoppable) return `Hold E To Chop ${this.heldItem?.name}`;
			else return `Hold E To Pickup ${this.heldItem?.name} From Board`;
		}
		else if (playerItem) {
			if (playerItem?.type === 'cookware') return '';
			else return `Hold E To Place ${playerItem!.name} On Board`;

		}
		else return "";

	}

	protected onBegin() {

	}
	protected override useAnimation(three: ThreeRenderer, player: Player): void {
		if (this.heldItem) {
			if (this.heldItem.isChoppable) {
				three.switchPlayerVariant("knife");
				player.startAction("Chop_Loop", 1.25);
			}

		}

	}
	protected onComplete(player: Player, three: ThreeRenderer): void {
		const p = new THREE.Vector3();
		const playerItem = player.getHeldItem();
		if (this.heldItem) {
			if (this.heldItem.isChoppable) {
				this.heldItem.deleteObject();
				this.heldItem = RecipeManager.chopItem(this.heldItem, three);
				this.heldItem!.object.removeFromParent();
				this.anchor.add(this.heldItem!.object);

				const localOffset = new THREE.Vector3(0, 1, 0)
				this.heldItem!.object.position.copy(localOffset);
				this.heldItem!.object.rotation.set(0, 0, 0);
			}
			else if (player.getHeldItem()) return;
			else {
				player.pickup(this.heldItem);
				this.heldItem = null;
			}
		}
		else if (playerItem && playerItem.type !== 'cookware') {
			this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1, 0), this.rotation) as Food;
		}


	}

	protected override onCancel(three: ThreeRenderer, player: Player): void {
		three.switchPlayerVariant("default");
		player.stopAction();

	}
}
