import { Food } from "../../utilities/food.js";
export class SalmonFishItem extends Food {
    name = "salmonFish";
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
        this.isChoppable = true;
        this.isCookable = false;
    }
}
//# sourceMappingURL=salmonFish.js.map