import { Food } from "../../utilities/food.js";
export class CucumberItem extends Food {
    name = "cucumber";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isCookable = false;
        this.isChoppable = true;
    }
}
//# sourceMappingURL=cucumber.js.map