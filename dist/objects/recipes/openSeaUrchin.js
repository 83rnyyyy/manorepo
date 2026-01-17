import { Food } from "../../utilities/food.js";
export class OpenedSeaUrchinItem extends Food {
    name = "openedSeaUrchin";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isCookable = false;
        this.isChoppable = false;
    }
}
//# sourceMappingURL=openSeaUrchin.js.map