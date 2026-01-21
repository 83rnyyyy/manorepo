import * as THREE from "three";
import { Food } from "../../utilities/food.js";
import AssetManager, { Assets } from "../../utilities/assetManager.js";
import { Foods } from "../types.js";
import { ChoppedSalmonItem } from "./choppedSalmon.js";
import { ThreeRenderer } from "../../core/render.js";
import { ClosedSeaUrchinItem } from "./closedSeaUrchin.js";
import { ChoppedCucumberItem } from "./choppedCucumber.js";
import { TentacleItem } from "./tentacle.js";
import { OpenedSeaUrchinItem } from "./openSeaUrchin.js";
import { SalmonRollItem } from "./salmonRoll.js";
import { SeaUrchinRoll } from "./seaUrchinRoll.js";
import { SalmonNigiriItem } from "./salmonNigiri.js";
import { OctopusItem } from "./octopus.js";
import { OctopusNigiriItem } from "./octopusNigiri.js";
import { RiceItem } from "./rice.js";


const choppedRecipes: Partial<Record<Assets, Assets>> = {
	'Salmon Fish': "Chopped Salmon",
	'Closed Sea Urchin': "Opened Sea Urchin",
	'Cucumber': "Chopped Cucumber",
	'Octopus': "Octopus Tentacle"
};
const cookedRecipes: Partial<Record<Assets, Assets>> = {
	'Uncooked Rice': 'Rice'
}

export default class RecipeManager {
	private static recipes: Map<string, Assets> = new Map();
	private static reverseRecipes: Map<Assets, string> = new Map();


	public static chopItem(food: Food, render: ThreeRenderer): Foods | null {
		const product = choppedRecipes[food.name as Assets];
		if (!product) return null;


		switch (product) {
			case "Chopped Salmon":
				return new ChoppedSalmonItem(render, 0, 0, 0);
			case "Opened Sea Urchin":
				return new OpenedSeaUrchinItem(render, 0, 0, 0);
			case "Chopped Cucumber":
				return new ChoppedCucumberItem(render,  0, 0, 0);
			case "Octopus Tentacle":
				return new TentacleItem(render, 0, 0, 0);

		}

		return null;
	}
	public static cookItem(food: Food, render: ThreeRenderer): Foods | null{
		const product = cookedRecipes[food.name as Assets];
		if (!product) return null;

		const productObject = AssetManager.create(product);

		switch (product) {
			case "Rice":
				return new RiceItem(render, 0, 0, 0);

		}
		return null;
	}


	public static init() {
		this.addRecipe(["Rice", "Chopped Salmon", "Chopped Cucumber", "Seaweed"] as Assets[], "Salmon Roll");
		this.addRecipe(["Rice", "Seaweed", "Opened Sea Urchin"] as Assets[], "Sea Urchin Roll");
		this.addRecipe(["Rice", "Seaweed", "Chopped Salmon"] as Assets[], "Salmon Nigiri");
		this.addRecipe(["Rice", "Seaweed", "Octopus Tentacle"] as Assets[], "Octopus Nigiri");
	}

	public static craftFromPlate(items: Assets[], render: ThreeRenderer): Food | null {
		const key = this.makeRecipeKey(items);
		const product = this.recipes.get(key);
		if (!product) return null;


		switch (product) {
			case "Salmon Roll":
				return new SalmonRollItem(render, 0, 0, 0);
			case "Sea Urchin Roll":
				return new SeaUrchinRoll(render,  0, 0, 0);
			case "Salmon Nigiri":
				return new SalmonNigiriItem(render, 0, 0, 0);
			case "Octopus Nigiri":
				return new OctopusNigiriItem(render, 0, 0, 0);
			default:
				return null;
		}
	}

	private static makeRecipeKey(items: Assets[]): string {
		const counts = new Map<Assets, number>();

		for (const item of items) {
			counts.set(item, (counts.get(item) ?? 0) + 1);
		}

		return [...counts.entries()]
			.sort(([a], [b]) => String(a).localeCompare(String(b)))
			.map(([name, count]) => `${name}:${count}`)
			.join("|");
	}
	private static addRecipe(ingredients: Assets[], output: Assets) {
		const key = this.makeRecipeKey(ingredients);
		this.recipes.set(key, output);
		this.reverseRecipes.set(output, key);
	}
	public static getRecipeStringForProduct(product: Assets): string | null {
		const key = this.reverseRecipes.get(product);
		if (!key) return null;

		// key looks like: "rice:2|seaweed:1"
		const parts = key.split("|").map((piece) => {
			const [name, countStr] = piece.split(":");
			const count = Number(countStr);

			return count > 1 ? `${name} x${count}` : name;
		});

		return parts.join(" + ");
	}

}
