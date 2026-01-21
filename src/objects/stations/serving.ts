import { Hud } from "../../core/hud.js";
import { ThreeRenderer } from "../../core/render.js";
import { Assets } from "../../utilities/assetManager.js";
import { Food } from "../../utilities/food.js";
import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";
import RecipeManager from "../recipes/recipeManager.js";
import { SalmonRollItem } from "../recipes/salmonRoll.js";
import { SeaUrchinRoll } from "../recipes/seaUrchinRoll.js";
import { Foods } from "../types.js";
import { Plates } from "./plates.js";
import { Sink } from "./sink.js";

import { Station } from "./station.js";

export class Serving extends Station{
    private sinkStation: Sink;
    private hud: Hud;
    public orders: Assets[] = [];
    private readonly MAX_ORDERS: number = 4;
    private readonly FOOD_OPTIONS: Assets[] = ['Salmon Roll', 'Sea Urchin Roll', 'Octopus Nigiri', 'Salmon Nigiri', 'Octopus Tentacle'];
    constructor(anchor: any, sinkStation: Sink, hud:Hud){
        super(anchor);
        this.sinkStation = sinkStation;
        this.hud = hud;
    }
    public override prompt(player?: Player): string {
        if(player?.getHeldItem() && player.getHeldItem()?.name ==='Plate'){
            const plateItem = (player.getHeldItem() as PlateItem).heldIngredients[0];
            console.log(plateItem)
            for(let i = 0; i < this.orders.length; i++){
                if(plateItem?.name === this.orders[i]) return `Hold E to Serve ${this.orders[i]} to customers`;
            }
        }
        return ""
        
    }

    protected override onComplete(player: Player, three: ThreeRenderer): void {
        if(player?.getHeldItem() && player.getHeldItem()?.name ==='Plate'){
            const plateItem = (player.getHeldItem() as PlateItem).heldIngredients[0];
            for(let i = 0; i < this.orders.length; i++){
                if(plateItem?.name === this.orders[i]){
                    const plate = player.removeHeldItem() as PlateItem;
                    plate.clearIngredients();
                    this.sinkStation.addPlate(plate);
                    this.createNewOrder();
                    this.hud.addScore();
                    this.hud.addServed();
                    return;
                }
            }
        }
    }
    public createNewOrder(){
        while (this.orders.length < this.MAX_ORDERS){
            this.orders.push(this.FOOD_OPTIONS[Math.floor(Math.random() * this.FOOD_OPTIONS.length)] as Assets);
        }
        const recipes: string[] = [];
        for(let i = 0; i < this.orders.length; i++){
            recipes.push(RecipeManager.getRecipeStringForProduct(this.orders[i]!)!)
        }
        this.hud.setOrders(this.orders, recipes);
        
    }


}
