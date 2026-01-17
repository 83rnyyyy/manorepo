import { Food } from "../../utilities/food.js";
export class ClosedSeaUrchinItem extends Food {
    name = "closedSeaUrchin";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isCookable = false;
        this.isChoppable = true;
    }
}
//# sourceMappingURL=closedSeaUrchin.js.map