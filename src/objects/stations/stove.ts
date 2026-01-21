// objects/stations/stove.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { Controller } from "../../core/controller.js";
import { Food } from "../../utilities/food.js";
import { PotItem } from "../recipes/pot.js";
import RecipeManager from "../recipes/recipeManager.js";

export class Stove extends Station {
    public hasItem = true;
    public heldItem: HoldableItem | null;
    public cookwareLoc:number[] = [2.7,2.1,-8.69]
  
  
  	public prompt(player:Player): string {
    	if(!player.getHeldItem() && this.hasItem)
			if(this.heldItem?.name == "Pot" && (this.heldItem as PotItem).potState == (this.heldItem as PotItem).uncooked) return "Hold E to cook rice";
			else return "Hold E to pick up";
      	else if(player.getHeldItem() && player.getHeldItem()?.name == "Pot") return "Hold E to place Item";
      	return "Hold E to cook";
  	}

  protected onBegin() {
    // optional: start cooking animation/sfx
  }
  
  public override tick(dt: number,
   
    playerWorldPos: THREE.Vector3,
    player: Player,
    three:ThreeRenderer){
		const playerItem = player.getHeldItem();
		if(!this.heldItem || !playerItem || playerItem?.type !== 'ingredient' || !(playerItem as Food).isCookable)return;
      
        // if(
		// 	this.heldItem.name == "Pot" 
		// 	&& (this.heldItem as PotItem).potState == (this.heldItem as PotItem).empty 
		// 	&& (playerItem as Food).isCookable
		// ) ;
          
        
        
        
        
        super.tick(dt, playerWorldPos, player, three);
    }
	protected onComplete(player:Player, three: ThreeRenderer): void {
		
		if(this.hasItem){
			if(this.heldItem?.name == "Pot"){
				const pot = this.heldItem as PotItem;
				const playerItem = player.getHeldItem();
;				if(pot.potState == pot.uncooked){
					
					pot.swapToFilledCooked();
					const cookedItem = RecipeManager.cookItem(pot.itemInPot!, three);
					pot.itemInPot?.deleteObject();
					pot.itemInPot = cookedItem;
					return;
				}
				else if(playerItem && playerItem.type === "ingredient" && !pot.itemInPot && (playerItem as Food).isCookable){
					pot.swapToFilledUncooked();
					pot.itemInPot = player.removeHeldItem() as Food;
					return;
				}
				else if(pot.potState === pot.cooked){
					player.pickup(pot.itemInPot!);
					pot.itemInPot = null;
				}
				else {
					player.pickup(this.heldItem!);
					this.heldItem = null;
					this.hasItem = false;
				};
			}
			
			
			}
		else{
			if(player.getHeldItem() && (player.getHeldItem()?.name != "Pot")) return;
			this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1.6, -1.3), this.rotation);
			this.hasItem = true;
		}
  	}
}
