/**
 * Tracks mouse position, gets buttonstates and able to add buttons to buttonstates
 */
export class Controller {
    buttonStates = new Map();
    mouseTracked = false;
    trackMouse(canvas) {
        const shouldSkipMouseTracking = this.mouseTracked || !canvas;
        if (shouldSkipMouseTracking)
            return;
        this.mouseTracked = true;
        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
        });
        canvas.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                this.buttonStates.set("mouseLeft", true);
            }
        });
        canvas.addEventListener("mouseup", (e) => {
            if (e.button === 0) {
                this.buttonStates.set("mouseLeft", false);
            }
        });
    }
    addButton(button) {
        this.buttonStates.set(button, false);
        document.addEventListener("keydown", (e) => {
            if (e.code === button) {
                this.buttonStates.set(button, true);
            }
        });
        document.addEventListener("keyup", (e) => {
            if (e.code === button) {
                this.buttonStates.set(button, false);
            }
        });
    }
    getButtonState(button) {
        return this.buttonStates.get(button) ?? false;
    }
    trackPointer(el) {
        el.addEventListener("pointerdown", (e) => {
            if (e.button === 0)
                this.buttonStates.set("mouseLeft", true);
        });
        el.addEventListener("pointerup", (e) => {
            if (e.button === 0)
                this.buttonStates.set("mouseLeft", false);
        });
    }
}
//# sourceMappingURL=controller.js.map