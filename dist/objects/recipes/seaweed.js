import { Food } from "../../utilities/food.js";
export class SeaweedItem extends Food {
    name = "seaweed";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isCookable = false;
        this.isChoppable = false;
    }
}
//# sourceMappingURL=seaweed.js.map