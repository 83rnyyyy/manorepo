import { Food } from "../../utilities/food.js";
export class PanItem extends Food {
    name = "pan";
    itemInPan = null;
    panState;
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
    }
}
//# sourceMappingURL=pan.js.map