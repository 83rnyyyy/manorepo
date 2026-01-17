import { Food } from "../../utilities/food.js";
export class TentacleItem extends Food {
    name = "octopusTentacle";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isCookable = false;
        this.isChoppable = false;
    }
}
//# sourceMappingURL=tentacle.js.map