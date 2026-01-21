// objects/items/plateItem.ts
import * as THREE from "three";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { ThreeRenderer } from "../../core/render.js";
import { Cookware } from "../../utilities/cookware.js";
import RecipeManager from "./recipeManager.js";
import { Food } from "../../utilities/food.js";
import AssetManager, { Assets } from "../../utilities/assetManager.js";

export class PlateItem extends Cookware{
	public readonly name = "Plate" as const;
	public heldIngredients: Food[] = [];
	private crafting = false;
	private ingredientSocket = new THREE.Object3D();
	private slots = [
		new THREE.Vector3(0.00, 0.1, 0.00),
		new THREE.Vector3(0.12, 0.05, 0.00),
		new THREE.Vector3(-0.12, 0.05, 0.00),
		new THREE.Vector3(0.00, 0.05, 0.12),
		new THREE.Vector3(0.00, 0.05, -0.12),
	];
	constructor(renderer: ThreeRenderer,x:number, y:number, z:number) {
		super(renderer,x,y,z, 'Plate'); 
		this.object.add(this.ingredientSocket); 
    	this.ingredientSocket.position.set(0, 0, 0);
 
	}
	public clearIngredients() {
		for (let ingredient of this.heldIngredients) {
			ingredient.deleteObject();
		}
		this.heldIngredients.length = 0;
		this.crafting = false;
	}

	public addIngredient(item: Food){
		if(this.crafting && this.heldIngredients.length >=1) return;
		else{
			const i = this.heldIngredients.length;
			let slot;
			if (this.slots[i]){
				slot = this.slots[i];
			}
			else{
				slot = this.slots[this.slots.length - 1];
			}
			item.object.removeFromParent();
			this.ingredientSocket.add(item.object);
			item.object.position.copy(slot!);
			item.object.rotation.set(0, 0, 0);
			this.heldIngredients.push(item);
			console.log(this.heldIngredients);
			if(!this.crafting){
				this.tryAutoCraft();
			}
		} 
		
		
		
	}

	private tryAutoCraft() {
    if (this.crafting) return; 
    if (this.heldIngredients.length < 2) return;

    // build ingredient list
    const ingredientNames = this.heldIngredients.map((i) => i.name as Assets);

    // ask recipe manager for crafted dish
    const crafted = RecipeManager.craftFromPlate(ingredientNames, this.renderer);
    if (!crafted) return;
	console.log(crafted);
	// replace ingredients with crafted dish
    this.clearIngredients();
	this.crafting = true;
	this.addIngredient(crafted);
	
    
  }

}
