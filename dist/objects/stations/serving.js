import { Station } from "./station.js";
export class Serving extends Station {
    prompt(player) {
        if (player?.getHeldItem()) {
        }
        return "";
    }
    onComplete(ctx, player, three) {
    }
}
//# sourceMappingURL=serving.js.map