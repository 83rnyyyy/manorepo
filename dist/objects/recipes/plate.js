import { worldObject } from "./worldObject.js";
export class PlateItem extends worldObject {
    type = "plate";
    constructor(renderer, object, x, y, z) {
        super(x, y, z, object, renderer);
    }
}
//# sourceMappingURL=plate.js.map