// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";
import { HoldableItem } from "../../utilities/holdableItem.js";

export class Plates extends Station {
  public plates: number = 3;
  public plateLocations: number[][] = [
    [-0.85,1.5,-8.69],
    [-0.85,1.6,-8.69],
    [-0.85,1.7,-8.69]
  ];
  public currentItems: PlateItem[] = [];
   
  public prompt(): string{
    return "Hold E to Grab Plates";
  }

  protected onBegin(_ctx: StationContext) {
    
  }
  private takePlate(): HoldableItem | null{
    const plate = this.currentItems.pop() ?? null
    return plate as HoldableItem | null;
    
    
  }
  protected onComplete(ctx: StationContext, player: Player): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    
    if(this.plates !== 0){
      player.pickup(this.takePlate() as HoldableItem);
    }
    this.plates--;
    
    
  }
}