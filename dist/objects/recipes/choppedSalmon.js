import { Food } from "../../utilities/food.js";
export class ChoppedSalmonItem extends Food {
    name = "choppedSalmon";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isCookable = false;
        this.isChoppable = false;
    }
}
//# sourceMappingURL=choppedSalmon.js.map