// core/loadingScreen.ts
export class LoadingScreen {
  private root: HTMLDivElement;
  private barFill: HTMLDivElement;
  private percentText: HTMLDivElement;
  private statusText: HTMLDivElement;

  private target = 0;
  private shown = false;

  constructor() {
    // full-screen overlay
    this.root = document.createElement("div");
    this.root.style.position = "fixed";
    this.root.style.left = "0";
    this.root.style.top = "0";
    this.root.style.width = "100%";
    this.root.style.height = "100%";
    this.root.style.display = "flex";
    this.root.style.flexDirection = "column";
    this.root.style.alignItems = "center";
    this.root.style.justifyContent = "center";
    this.root.style.background = "rgba(0,0,0,0.85)";
    this.root.style.zIndex = "9999";
    this.root.style.gap = "12px";
    this.root.style.fontFamily = "system-ui, Arial";
    this.root.style.color = "white";

    const title = document.createElement("div");
    title.textContent = "Loading...";
    title.style.fontSize = "28px";
    title.style.fontWeight = "700";
    this.root.appendChild(title);

    // bar container
    const bar = document.createElement("div");
    bar.style.width = "520px";
    bar.style.maxWidth = "85vw";
    bar.style.height = "18px";
    bar.style.borderRadius = "999px";
    bar.style.background = "rgba(255,255,255,0.15)";
    bar.style.overflow = "hidden";
    this.root.appendChild(bar);

    // bar fill
    this.barFill = document.createElement("div");
    this.barFill.style.height = "100%";
    this.barFill.style.width = "0%";
    this.barFill.style.background = "white";
    this.barFill.style.transition = "width 120ms linear";
    bar.appendChild(this.barFill);

    // percent text
    this.percentText = document.createElement("div");
    this.percentText.textContent = "0%";
    this.percentText.style.opacity = "0.9";
    this.percentText.style.fontSize = "14px";
    this.root.appendChild(this.percentText);

    // status text (current file)
    this.statusText = document.createElement("div");
    this.statusText.textContent = "";
    this.statusText.style.opacity = "0.75";
    this.statusText.style.fontSize = "12px";
    this.statusText.style.maxWidth = "85vw";
    this.statusText.style.textAlign = "center";
    this.root.appendChild(this.statusText);

    this.animate();
  }

  show() {
    if (this.shown) return;
    this.shown = true;
    document.body.appendChild(this.root);
  }

  hide() {
    if (!this.shown) return;
    this.shown = false;
    this.root.remove();
  }

  setProgress01(p01: number) {
    this.target = Math.max(0, Math.min(1, p01));
    const pct = Math.round(this.target * 100);
    this.percentText.textContent = `${pct}%`;
  }

  setStatus(text: string) {
    this.statusText.textContent = text;
  }

  private animate = () => {
    // simple smoothing
    if (this.shown) {
      const pct = Math.round(this.target * 100);
      this.barFill.style.width = `${pct}%`;
    }
    requestAnimationFrame(this.animate);
  };
}
