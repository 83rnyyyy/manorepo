import Canvas from "./core/canvas.js";
import { Game } from "./core/game.js";
import AssetManager from "./utilities/assetManager.js";


/**
 * This just starts the program.
 */
class Driver {
  async start() {
    Canvas.setup();
    AssetManager.init();
    await AssetManager.addAllAssets();
    new Game();
  }
}

new Driver().start();