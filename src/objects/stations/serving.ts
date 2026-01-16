import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";

import { Station } from "./station.js";

export class Serving extends Station{
    public override prompt(player?: Player): string {
        if(player?.getHeldItem()){
            
        }
        return ""
        
    }

    protected override onComplete(player: Player, three: ThreeRenderer): void {
        
    }


}