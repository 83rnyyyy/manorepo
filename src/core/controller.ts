

/**
 * Tracks mouse position, gets buttonstates and able to add buttons to buttonstates
 */
export class Controller {
	private buttonStates = new Map<string, boolean>();

	
	private mouseTracked = false;

	public trackMouse(canvas: HTMLCanvasElement) {
		const shouldSkipMouseTracking = this.mouseTracked || !canvas;

		if (shouldSkipMouseTracking) return;
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

	public addButton(button: string) {
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

	public trackPointer(el: HTMLElement) {
		el.addEventListener("pointerdown", (e) => {
			if (e.button === 0) this.buttonStates.set("mouseLeft", true);
		});
		el.addEventListener("pointerup", (e) => {
			if (e.button === 0) this.buttonStates.set("mouseLeft", false);
		});
		}

	// public get mousePos(): Coordinates {
	// 	return this.mouse;
	// }
}
