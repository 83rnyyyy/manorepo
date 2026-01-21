// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";
import { Food } from "../../utilities/food.js";

export class Counter extends Station {

  public heldItem: Food | HoldableItem | null;
  public isPlate: boolean = false;
  public prompt(player: Player): string {
    if(!this.heldItem && player.getHeldItem()) return "Hold E to Place on Counter";
    else if (!player.getHeldItem() && !this.heldItem) return "";
    else if(player.getHeldItem() && this.heldItem?.name === 'Plate') return "Add Ingredient to Plate"; 
    else return `Hold E To Pickup ${this.heldItem?.type} From Counter`;
    
  }

  protected onBegin() {
    // optional: start animation/sfx
  }

  protected onComplete(player: Player): void {
    if(this.heldItem){
		if(this.heldItem instanceof PlateItem && player.getHeldItem()){
			const ingredient = player.removeHeldItem() as Food;
			(this.heldItem).addIngredient(ingredient);
		}
		else{
			player.pickup(this.heldItem!);
			this.heldItem = null;
		}
		
    }
    else{
		if(!player.getHeldItem()) return;
      this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0.85, 1.35, 0), this.rotation);
      this.heldItem?.type
    }
    
    // TODO: convert ingredient -> chopped ingredient
  }
}
