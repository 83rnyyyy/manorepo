import Canvas from "./core/canvas.js";
import { Game } from "./core/game.js";


/**
 * This just starts the program.
 */
class Driver {
  constructor() {
    Canvas.setup();

    new Game();
  }
}

new Driver();
