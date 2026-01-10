export class FridgeMenu {
    items;
    openFlag = false;
    onClose = null;
    overlay;
    panel;
    grid;
    closeBtn;
    selectedId = null;
    constructor(items) {
        this.items = items;
    }
    setOnClose(fn) {
        this.onClose = fn;
    }
    isOpen() {
        return this.openFlag;
    }
    ensureUI() {
        if (this.overlay)
            return;
        this.overlay = document.createElement("div");
        this.overlay.style.position = "fixed";
        this.overlay.style.left = "0";
        this.overlay.style.top = "0";
        this.overlay.style.width = "100vw";
        this.overlay.style.height = "100vh";
        this.overlay.style.display = "none";
        this.overlay.style.alignItems = "center";
        this.overlay.style.justifyContent = "center";
        this.overlay.style.background = "rgba(0,0,0,0.65)";
        this.overlay.style.zIndex = "9999";
        this.panel = document.createElement("div");
        this.panel.style.position = "relative";
        this.panel.style.width = "640px";
        this.panel.style.maxWidth = "92vw";
        this.panel.style.padding = "18px";
        this.panel.style.borderRadius = "14px";
        this.panel.style.background = "rgba(20,20,20,0.95)";
        this.panel.style.boxShadow = "0 10px 40px rgba(0,0,0,0.6)";
        this.closeBtn = document.createElement("button");
        this.closeBtn.textContent = "✕";
        this.closeBtn.style.position = "absolute";
        this.closeBtn.style.top = "10px";
        this.closeBtn.style.right = "10px";
        this.closeBtn.style.width = "36px";
        this.closeBtn.style.height = "36px";
        this.closeBtn.style.borderRadius = "10px";
        this.closeBtn.style.border = "none";
        this.closeBtn.style.cursor = "pointer";
        this.closeBtn.style.fontSize = "18px";
        this.grid = document.createElement("div");
        this.grid.style.display = "grid";
        this.grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(90px, 1fr))";
        this.grid.style.gap = "14px";
        this.grid.style.marginTop = "20px";
        this.panel.appendChild(this.closeBtn);
        this.panel.appendChild(this.grid);
        this.overlay.appendChild(this.panel);
        document.body.appendChild(this.overlay);
        this.closeBtn.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        });
        this.overlay.addEventListener("pointerdown", (e) => {
            if (e.target === this.overlay)
                this.close();
        });
        window.addEventListener("keydown", (e) => {
            if (!this.openFlag)
                return;
            if (e.key === "Escape")
                this.close();
        });
    }
    open() {
        this.ensureUI();
        this.openFlag = true;
        this.selectedId = null;
        this.grid.innerHTML = "";
        for (const item of this.items) {
            const btn = document.createElement("button");
            btn.style.border = "none";
            btn.style.borderRadius = "12px";
            btn.style.padding = "10px";
            btn.style.background = "rgba(255,255,255,0.06)";
            btn.style.cursor = "pointer";
            const img = document.createElement("img");
            img.src = item.iconSrc;
            img.alt = item.id;
            img.style.width = "64px";
            img.style.height = "64px";
            img.style.objectFit = "contain";
            img.style.display = "block";
            img.style.margin = "0 auto";
            btn.appendChild(img);
            btn.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectedId = item.id;
                this.close();
            });
            this.grid.appendChild(btn);
        }
        this.overlay.style.display = "flex";
    }
    close() {
        if (!this.openFlag)
            return;
        this.openFlag = false;
        this.overlay.style.display = "none";
        const picked = this.selectedId;
        this.selectedId = null;
        this.onClose?.(picked);
    }
}
//# sourceMappingURL=fridgeMenu.js.map