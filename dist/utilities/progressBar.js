// ui/ProgressUI.ts
export class ProgressBar {
    root;
    bar;
    label;
    constructor() {
        this.root = document.createElement("div");
        this.root.style.position = "fixed";
        this.root.style.left = "50%";
        this.root.style.bottom = "64px";
        this.root.style.transform = "translateX(-50%)";
        this.root.style.width = "240px";
        this.root.style.padding = "10px";
        this.root.style.background = "rgba(0,0,0,0.55)";
        this.root.style.borderRadius = "10px";
        this.root.style.display = "none";
        this.label = document.createElement("div");
        this.label.style.color = "white";
        this.label.style.fontFamily = "system-ui, Arial";
        this.label.style.fontSize = "14px";
        this.label.style.marginBottom = "8px";
        const track = document.createElement("div");
        track.style.height = "10px";
        track.style.background = "rgba(255,255,255,0.2)";
        track.style.borderRadius = "999px";
        track.style.overflow = "hidden";
        this.bar = document.createElement("div");
        this.bar.style.height = "100%";
        this.bar.style.width = "0%";
        this.bar.style.background = "white";
        track.appendChild(this.bar);
        this.root.appendChild(this.label);
        this.root.appendChild(track);
        document.body.appendChild(this.root);
    }
    show(text) {
        console.log("asdasdasd");
        this.root.style.display = "block";
        this.label.textContent = text;
    }
    setProgress(p) {
        const pct = Math.max(0, Math.min(1, p)) * 100;
        this.bar.style.width = `${pct}%`;
    }
    hide() {
        this.root.style.display = "none";
        this.bar.style.width = "0%";
    }
}
//# sourceMappingURL=progressBar.js.map