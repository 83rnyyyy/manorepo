import { Food } from "../../utilities/food.js";
export class RiceItem extends Food {
    name = "Rice";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isChoppable = false;
        this.isCookable = true;
    }
}
//# sourceMappingURL=rice.js.map