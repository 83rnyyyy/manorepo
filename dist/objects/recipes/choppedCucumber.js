import { Food } from "../../utilities/food.js";
export class ChoppedCucumberItem extends Food {
    name = "choppedCucumber";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isCookable = false;
        this.isChoppable = false;
    }
}
//# sourceMappingURL=choppedCucumber.js.map