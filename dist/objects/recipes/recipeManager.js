import AssetManager from "../../utilities/assetManager.js";
import { ChoppedSalmonItem } from "./choppedSalmon.js";
import { TentacleItem } from "./tentacle.js";
import { OpenedSeaUrchinItem } from "./openSeaUrchin.js";
import { ChoppedCucumberItem } from "./choppedCucumber.js";
const recipes = {
    salmonFish: "Chopped Salmon",
    octopus: "Octopus Tentacle",
    closedSeaUrchin: "Open Sea Urchin",
    cucumber: "Chopped Cucumber",
};
export default class RecipeManager {
    static chopItem(food, render) {
        const product = recipes[food.name];
        if (product) {
            const productObject = AssetManager.create(product);
            switch (product) {
                case 'Chopped Salmon':
                    return new ChoppedSalmonItem(render, productObject, 0, 0, 0);
                case 'Octopus Tentacle':
                    return new TentacleItem(render, productObject, 0, 0, 0);
                case 'Open Sea Urchin':
                    return new OpenedSeaUrchinItem(render, productObject, 0, 0, 0);
                case 'Chopped Cucumber':
                    return new ChoppedCucumberItem(render, productObject, 0, 0, 0);
            }
        }
        return null;
    }
    static deleteObject() {
    }
}
//# sourceMappingURL=recipeManager.js.map