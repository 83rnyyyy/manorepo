// objects/items/potItem.ts
import * as THREE from "three";
import { HoldableItem } from "../../utilities/holdableItem.js";
export class PotItem extends HoldableItem {
    type = "pot";
    emptyModel;
    filledUncookedModel;
    filledCookedModel;
    empty = 0;
    uncooked = 1;
    cooked = 2;
    potState = this.empty;
    constructor(renderer, emptyModel, filledCookedModel, filledUncookedModel, x, y, z) {
        // IMPORTANT: stable root object that never changes
        const root = new THREE.Group();
        root.name = "PotRoot";
        super(renderer, root, x, y, z);
        this.emptyModel = emptyModel;
        this.filledCookedModel = filledCookedModel;
        this.filledUncookedModel = filledUncookedModel;
        // attach both to the root, toggle visibility
        this.object.add(this.emptyModel);
        this.object.add(this.filledUncookedModel);
        this.object.add(this.filledCookedModel);
        this.setFilled(this.empty);
    }
    setFilled(state) {
        if (state === this.empty) {
            this.emptyModel.visible = true;
            this.filledCookedModel.visible = false;
            this.filledUncookedModel.visible = false;
        }
        else if (state === this.uncooked) {
            this.emptyModel.visible = false;
            this.filledCookedModel.visible = false;
            this.filledUncookedModel.visible = true;
        }
        else {
            console.log("asdas");
            this.emptyModel.visible = false;
            this.filledCookedModel.visible = true;
            this.filledUncookedModel.visible = false;
        }
        this.potState = state;
    }
    swapToFilledUncooked() {
        this.setFilled(this.uncooked);
    }
    swapToFilledCooked() {
        this.setFilled(this.cooked);
    }
    swapToEmpty() {
        this.setFilled(this.empty);
    }
}
//# sourceMappingURL=pot.js.map