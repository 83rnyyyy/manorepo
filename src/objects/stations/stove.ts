// objects/stations/stove.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { PotItem } from "../recipes/pot.js";
import { Controller } from "../../core/controller.js";

export class Stove extends Station {
    public hasItem = true;
    public heldItem: HoldableItem | null;
    public cookwareLoc:number[] = [2.7,1.6,-8.69]
  
  
  	public prompt(player:Player): string {
    	if(!player.getHeldItem() && this.hasItem)
			if(this.heldItem?.type == "pot" && (this.heldItem as PotItem).potState == (this.heldItem as PotItem).uncooked) return "Hold E to cook rice";
			else return "Hold E to pick up";
      	else if(player.getHeldItem() && player.getHeldItem()?.type == "pot" || player.getHeldItem()?.type == "pan") return "Hold E to place Item";
      	return "Hold E to cook";
  	}

  protected onBegin(_ctx: StationContext) {
    // optional: start cooking animation/sfx
  }
  
  public override tick(dt: number,
    controller: Controller,
    playerWorldPos: THREE.Vector3,
    ctx: StationContext,
    player: Player,
    three:ThreeRenderer){
        if(this.heldItem){
          if(this.heldItem.type == "pot" && (this.heldItem as PotItem).potState == (this.heldItem as PotItem).empty){
        	if(player.getHeldItem() && player.getHeldItem()!.type != "Rice") return;
          }
        }
        
        
        
        super.tick(dt, controller, playerWorldPos, ctx, player, three);
    }
	protected onComplete(ctx: StationContext, player:Player): void {
		
		if(this.hasItem){
			if(this.heldItem?.type == "pot"){
				const pot = this.heldItem as PotItem;
				
;				if(pot.potState == pot.uncooked){
					
					pot.swapToFilledCooked();
					return;
				}
				else if(player.getHeldItem() && player.getHeldItem()?.type == "Rice"){
					pot.swapToFilledUncooked();
					player.removeHeldItem();
					return;
				}
				else{
					player.pickup(this.heldItem!);
					this.heldItem = null;
					this.hasItem = false;
				}
			}
			
			
			}
		else{
			if(player.getHeldItem() && player.getHeldItem()?.type != "pot" || player.getHeldItem()?.type != "pan") return;
			this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1.5, -1.1), this.rotation);
			this.hasItem = true;
		}
    // TODO: cook item in pan/pot
  	}
}
