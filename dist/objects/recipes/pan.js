import { Food } from "../../utilities/food.js";
export class PanItem extends Food {
    name = "pan";
    itemInPot = null;
    potState;
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
    }
}
//# sourceMappingURL=pan.js.map