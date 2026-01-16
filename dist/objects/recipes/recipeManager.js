import AssetManager from "../../utilities/assetManager.js";
import { ChoppedSalmonItem } from "./choppedSalmon.js";
const recipes = {
    salmonFish: "Chopped Salmon"
};
export default class RecipeManager {
    static chopItem(food, render) {
        const product = recipes[food.name];
        if (product) {
            const productObject = AssetManager.create(product);
            switch (product) {
                case 'Chopped Salmon':
                    return new ChoppedSalmonItem(render, productObject, 0, 0, 0);
            }
        }
        return null;
    }
    static deleteObject() {
    }
}
//# sourceMappingURL=recipeManager.js.map