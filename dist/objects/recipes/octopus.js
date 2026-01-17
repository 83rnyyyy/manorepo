import { Food } from "../../utilities/food.js";
export class OctopusItem extends Food {
    name = "octopus";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isCookable = false;
        this.isChoppable = true;
    }
}
//# sourceMappingURL=octopus.js.map