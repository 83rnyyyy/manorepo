import { Station } from "./station.js";
export class Plates extends Station {
    plates = 3;
    plateLocations = [
        [-0.85, 1.5, -8.69],
        [-0.85, 1.6, -8.69],
        [-0.85, 1.7, -8.69]
    ];
    currentItems = [];
    prompt() {
        return "Hold E to Grab Plates";
    }
    takePlate() {
        const plate = this.currentItems.pop() ?? null;
        return plate;
    }
    onComplete(player) {
        if (this.plates !== 0) {
            player.pickup(this.takePlate());
        }
        this.plates--;
    }
}
//# sourceMappingURL=plates.js.map