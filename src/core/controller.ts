

/**
 * Tracks mouse position, gets buttonstates and able to add buttons to buttonstates
 */
export class Controller {
	private buttonStates:Map<string,boolean> = new Map<string, boolean>();
	public addButton(button: string): void {
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

	public getButtonState(button: string): boolean {
		return this.buttonStates.get(button) ?? false;
	}

}
