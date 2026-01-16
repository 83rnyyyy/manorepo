// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
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

  
  private takePlate(): HoldableItem | null{
    const plate = this.currentItems.pop() ?? null
    return plate as HoldableItem | null;
    
    
  }
  protected onComplete(player: Player): void {
    
    
    if(this.plates !== 0){
      player.pickup(this.takePlate() as HoldableItem);
    }
    this.plates--;
    
    
  }
}