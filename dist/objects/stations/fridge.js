import { Station } from "./station.js";
import { FridgeMenu } from "../../utilities/fridgeMenu.js";
import { RiceItem } from "../recipes/rice.js";
import { SalmonFishItem } from "../recipes/salmonFish.js";
export class Fridge extends Station {
    ricePrefab;
    salmonPrefab;
    suppressPrompt = false;
    menu;
    player = null;
    three;
    items = [
        { id: "Rice", iconSrc: "/public/riceIcon.png" },
        { id: "Salmon", iconSrc: "/public/SalmonIcon.png" },
    ];
    constructor(anchor, ricePrefab, salmonPrefab, three) {
        super(anchor);
        this.ricePrefab = ricePrefab;
        this.salmonPrefab = salmonPrefab;
        this.three = three;
        this.menu = new FridgeMenu(this.items);
        this.menu.setOnClose((picked) => {
            this.suppressPrompt = false;
            if (this.player)
                this.player.movementDisabled = false;
            if (picked && this.player) {
                if (picked === "Rice") {
                    const obj = this.ricePrefab.clone(true);
                    const item = new RiceItem(this.three, obj, 0, 0, 0);
                    this.player.pickup(item);
                }
                if (picked === "Salmon") {
                    const obj = this.salmonPrefab.clone(true);
                    const item = new SalmonFishItem(this.three, obj, 0, 0, 0);
                    this.player.pickup(item);
                }
            }
        });
    }
    // capture current player each frame + block prompt/opening when holding
    tick(dt, controller, playerWorldPos, ctx, player, three) {
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
        super.tick(dt, controller, playerWorldPos, ctx, player, three);
    }
    prompt() {
        if (this.suppressPrompt)
            return "";
        return "Press E to open fridge";
    }
    onBegin(_ctx) { }
    useAnimation(_three, _player) { }
    onComplete(_ctx, player, _three) {
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