import { Station } from "./station.js";
export class Sink extends Station {
    prompt() {
        return "Hold E to wash";
    }
    useAnimation(three) {
    }
    onComplete() {
    }
    onCancel(three, player) {
    }
}
//# sourceMappingURL=sink.js.map