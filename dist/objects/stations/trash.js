import { Station } from "./station.js";
import { PlateItem } from "../recipes/plate.js";
import { PotItem } from "../recipes/pot.js";
export class Trash extends Station {
    prompt() {
        return "Hold E to throw away";
    }
    onComplete(player) {
        if (player.getHeldItem()) {
            const heldItem = player.getHeldItem();
            if (heldItem instanceof PlateItem) {
                (heldItem).clearIngredients();
            }
            else if (heldItem instanceof PotItem) {
                const pot = heldItem;
                pot.swapToEmpty();
            }
            else {
                player.deleteHeldItem();
            }
        }
    }
}
//# sourceMappingURL=trash.js.map