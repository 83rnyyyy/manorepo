// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";

export class Counter extends Station {
  public hasItem = false;
  public heldItem: HoldableItem | null;
  public isPlate: boolean = false;
  public prompt(player: Player): string {
    if(!this.hasItem) return "Hold E to Place on Counter";
    else if(player.getHeldItem() && this.heldItem?.type === 'plate') return "Add Ingredient to Plate"; 
    else return `Hold E To Pickup ${this.heldItem?.type} From Counter`;
    
  }

  protected onBegin(_ctx: StationContext) {
    // optional: start animation/sfx
  }

  protected onComplete(ctx: StationContext, player: Player): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    if(this.hasItem){
      if(player.getHeldItem() && this.heldItem?.type === 'plate'){
        const ingredient = player.removeHeldItem() as HoldableItem;
        (this.heldItem as PlateItem).addIngredient(ingredient);
      }
      else{
        player.pickup(this.heldItem!);
        this.heldItem = null;
        this.hasItem = false;	
      }
		
    }
    else{
      if(!player.getHeldItem()) return;
      this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0.85, 1.35, 0), this.rotation);
      this.heldItem?.type
      this.hasItem = true;
    }
    
    // TODO: convert ingredient -> chopped ingredient
  }
}