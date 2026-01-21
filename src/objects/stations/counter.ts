// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";

import { HoldableItem } from "../../utilities/holdableItem.js";
import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";
import { Food } from "../../utilities/food.js";

import { ThreeRenderer } from "../../core/render.js";

export class Counter extends Station {
  	
  	public heldItem: HoldableItem| null;
  	public isPlate: boolean = false;
   
  	public prompt(): string {
      return this.promptText;
    
    }

  public override tick(dt: number,  playerWorldPos: THREE.Vector3, player: Player, three: ThreeRenderer): void {
    if(!this.heldItem){
      if(player.getHeldItem()){
        this.promptText = "Hold E to Place on Counter";
      }
      else{
        this.promptText =  "";
        return;
      }
    }  
    else if(player.getHeldItem()) this.promptText =  "Add Ingredient to Plate"; 
    else this.promptText =  `Hold E To Pickup ${this.heldItem?.type} From Counter`;
    super.tick(dt,playerWorldPos, player, three);
  }


  protected onComplete(player: Player): void {
    
    if(this.heldItem){
		if(this.heldItem instanceof PlateItem && player.getHeldItem()){
			const ingredient = player.removeHeldItem() as HoldableItem;
			(this.heldItem).addIngredient(ingredient);
		}
		else{
			player.pickup(this.heldItem!);
			this.heldItem = null;
			
		}
		
    }
    else{
		if(!player.getHeldItem()) return;
      this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0.8, 1.35, 0), this.rotation);
      this.heldItem?.type
      
    }
    
    // TODO: convert ingredient -> chopped ingredient
  }
}