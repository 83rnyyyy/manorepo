import { HoldableItem } from "./holdableItem.js";
export class Food extends HoldableItem {
    type = 'ingredient';
    isChoppable;
    isCookable;
    constructor(renderer, object, x, y, z) {
        super(renderer, object, x, y, z);
    }
}
//# sourceMappingURL=food.js.map