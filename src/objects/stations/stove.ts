// objects/stations/stove.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { PotItem } from "../recipes/pot.js";
import { Controller } from "../../core/controller.js";
import { Food } from "../../utilities/food.js";

export class Stove extends Station {
    public hasItem = true;
    public heldItem: HoldableItem | null;
    public cookwareLoc:number[] = [2.7,1.6,-8.69];
  
  
  	public prompt(player:Player): string {
    	if(!player.getHeldItem() && this.hasItem)
			if(this.heldItem?.name == "pot" && (this.heldItem as PotItem).potState == (this.heldItem as PotItem).uncooked) return "Hold E to cook rice";
			else return "Hold E to pick up";
      	else if(player.getHeldItem() && player.getHeldItem()?.name == "pot" || player.getHeldItem()?.name == "pan") return "Hold E to place Item";
      	return "Hold E to cook";
  	}

  
  
  public override tick(dt: number,
    controller: Controller,
    playerWorldPos: THREE.Vector3,
    
    player: Player,
    three:ThreeRenderer){
        if(this.heldItem){
          if(this.heldItem.name == "pot" && (this.heldItem as PotItem).potState == (this.heldItem as PotItem).empty){
        	if(player.getHeldItem() && player.getHeldItem()!.name != "Rice") return;
          }
        }
        super.tick(dt, controller, playerWorldPos, player, three);
    }
	protected onComplete(player:Player): void {
		
		if(this.hasItem){
			if(this.heldItem?.name == "pot"){
				const pot = this.heldItem as PotItem;
				const playerItem = player.getHeldItem();
				if(pot.potState == pot.uncooked){
					console.log("here");
					pot.swapToFilledCooked();
					return;
				}
				else if(playerItem && playerItem.type === "ingredient" && !pot.itemInPot && (playerItem as Food).isCookable){
					pot.swapToFilledUncooked();
					pot.itemInPot = player.removeHeldItem() as Food;
					return;
				}
				// else if(pot.potState === pot.cooked){
				// 	player.pickup(pot.itemInPot!);
				// 	pot.itemInPot = null;
				// }
				else {
					console.log(this.heldItem);
					player.pickup(this.heldItem!);
					
					this.heldItem = null;
					this.hasItem = false;
				};
			}
			
			
			}
		else{
			if(player.getHeldItem() && (player.getHeldItem()?.name != "pot" || player.getHeldItem()?.name != "pan")) return;

			this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1.5, -1.1), this.rotation);
			this.hasItem = true;
		}
    // TODO: cook item in pan/pot
  	}
}