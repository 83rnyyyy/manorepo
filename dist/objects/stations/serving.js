import { Station } from "./station.js";
export class Serving extends Station {
    prompt(player) {
        if (player?.getHeldItem()) {
        }
        return "";
    }
    onComplete(player, three) {
    }
}
//# sourceMappingURL=serving.js.map