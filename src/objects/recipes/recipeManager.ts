import * as THREE from "three";
import { Food } from "../../utilities/food.js";
import { ItemName } from "../../utilities/holdableItem.js";
import AssetManager, { Assets } from "../../utilities/assetManager.js";
import { Foods } from "../types.js";

import { ThreeRenderer } from "../../core/render.js";
import { ChoppedSalmonItem } from "./choppedSalmon.js";

const recipes: Partial<Record<ItemName, Assets>> = {
    salmonFish: "Chopped Salmon"
}

export default class RecipeManager{
    public static chopItem(food: Food, render: ThreeRenderer): Foods | null{
        const product = recipes[food.name];
        if(product){
            const productObject = AssetManager.create(product);
            switch(product) {
                case 'Chopped Salmon':
                    return new ChoppedSalmonItem(render, productObject, 0,0,0);
            }
        }
        
        return null;
    }
    private static deleteObject(){
        
    }
}