import { Station } from "./station.js";
import { FridgeMenu } from "../../utilities/fridgeMenu.js";
import { RiceItem } from "../recipes/rice.js";
import { SalmonFishItem } from "../recipes/salmonFish.js";
import AssetManager from "../../utilities/assetManager.js";
import { OctopusItem } from "../recipes/octopus.js";
import { SeaweedItem } from "../recipes/seaweed.js";
import { ClosedSeaUrchinItem } from "../recipes/closedSeaUrchin.js";
import { CucumberItem } from "../recipes/cucumber.js";
export class Fridge extends Station {
    suppressPrompt = false;
    menu;
    player = null;
    three;
    items = [
        { id: "Rice", iconSrc: "/public/riceIcon.png" },
        { id: "Salmon", iconSrc: "/public/SalmonIcon.png" },
        { id: "SeaUrchin", iconSrc: "/public/closedSeaUrchin.jpg" },
        { id: "Octopus", iconSrc: "/public/octopus.png" },
        { id: "Seaweed", iconSrc: "/public/seaweed.png" },
        { id: "Cucumber", iconSrc: "/public/cucumber.png" },
    ];
    constructor(anchor, three) {
        super(anchor);
        this.three = three;
        this.menu = new FridgeMenu(this.items);
        this.menu.setOnClose((picked) => {
            this.suppressPrompt = false;
            if (this.player)
                this.player.movementDisabled = false;
            if (picked && this.player) {
                if (picked === "Rice") {
                    const obj = AssetManager.create("Rice");
                    const item = new RiceItem(this.three, obj, 0, 0, 0);
                    this.player.pickup(item);
                }
                else if (picked === "Salmon") {
                    const obj = AssetManager.create('Salmon Fish');
                    const item = new SalmonFishItem(this.three, obj, 0, 0, 0);
                    this.player.pickup(item);
                }
                else if (picked === "Octopus") {
                    const obj = AssetManager.create('Octopus');
                    const item = new OctopusItem(this.three, obj, 0, 0, 0);
                    this.player.pickup(item);
                }
                else if (picked == "Seaweed") {
                    const obj = AssetManager.create('Seaweed');
                    const item = new SeaweedItem(this.three, obj, 0, 0, 0);
                    this.player.pickup(item);
                }
                else if (picked == "SeaUrchin") {
                    const obj = AssetManager.create('Closed Sea Urchin');
                    const item = new ClosedSeaUrchinItem(this.three, obj, 0, 0, 0);
                    this.player.pickup(item);
                }
                else if (picked == "Cucumber") {
                    const obj = AssetManager.create('Cucumber');
                    const item = new CucumberItem(this.three, obj, 0, 0, 0);
                    this.player.pickup(item);
                }
            }
        });
    }
    // capture current player each frame + block prompt/opening when holding
    tick(dt, controller, playerWorldPos, player, three) {
        this.player = player;
        const inside = this.containsPoint(playerWorldPos);
        const holdingItem = player.getHeldItem() !== null;
        // hide prompt when holding item near fridge OR when menu open
        this.suppressPrompt = (inside && holdingItem) || this.menu.isOpen();
        // if menu is open, don't run station cancel/progress logic
        if (this.menu.isOpen())
            return;
        // prevent starting fridge if holding something
        if (holdingItem) {
            super.cancel(three, player);
            return;
        }
        // normal station behaviour (progress bar -> onComplete)
        super.tick(dt, controller, playerWorldPos, player, three);
    }
    prompt() {
        if (this.suppressPrompt)
            return "";
        return "Press E to open fridge";
    }
    onComplete(player, _three) {
        this.suppressPrompt = true;
        this.player = player;
        player.movementDisabled = true;
        this.menu.open();
    }
    onCancel(_three, _player) {
        if (this.menu.isOpen())
            return;
        this.suppressPrompt = false;
    }
}
//# sourceMappingURL=fridge.js.map