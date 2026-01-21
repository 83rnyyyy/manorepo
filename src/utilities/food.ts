import * as THREE from "three";
import { ThreeRenderer } from "../core/render.js";
import { HoldableItem } from "./holdableItem.js";
import { Assets } from "./assetManager.js";

export abstract class Food extends HoldableItem{
    public readonly type = 'ingredient' as const;
    public isChoppable: boolean;
    public isCookable: boolean;

    constructor(renderer: ThreeRenderer ,x:number, y:number, z:number, name: Assets){
        super(renderer, x, y, z, name);
    }
}
