import Canvas from "./core/canvas.js";
import { Game } from "./core/game.js";
import RecipeManager from "./objects/recipes/recipeManager.js";
import AssetManager from "./utilities/assetManager.js";
import { LoadingScreen } from "./core/loadingScreen.js";

class Driver {
  async start() {
    Canvas.setup();

    const loading = new LoadingScreen();
    loading.show();
    loading.setStatus("Starting...");

    AssetManager.init();
    RecipeManager.init();

    AssetManager.onProgress = (url, loaded, total) => {
      const p = total > 0 ? loaded / total : 0;
      loading.setProgress01(p);

      const file = url.split("/").pop() ?? url;
      loading.setStatus(`Loading (${loaded}/${total}) ${file}`);
    };

    AssetManager.onError = (url) => {
      loading.setStatus("ERROR: " + url);
    };


    loading.setStatus("Loading core assets...");
    await AssetManager.loadAllAssets();


    const game = new Game();
    await game.ready;


    loading.setProgress01(1);
    loading.setStatus("Done!");
    loading.hide();

    // load remaining in background
  }
}

new Driver().start();
