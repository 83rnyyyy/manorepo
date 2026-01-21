/**
 * Tracks mouse position, gets buttonstates and able to add buttons to buttonstates
 */
export class Controller {
    buttonStates = new Map();
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
}
//# sourceMappingURL=controller.js.map