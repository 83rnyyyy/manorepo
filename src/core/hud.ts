// ui/hud.ts
export class Hud {
  private root: HTMLDivElement;
  private ordersList: HTMLUListElement;

  private scoreText: HTMLDivElement;
  private servedText: HTMLDivElement;
  private score: number = 0;
  private served: number = 0;

  constructor(parent: HTMLElement = document.body) {
    // main container
    this.root = document.createElement("div");
    this.root.style.position = "fixed";
    this.root.style.left = "12px";
    this.root.style.top = "12px";
    this.root.style.zIndex = "9999";
    this.root.style.padding = "10px 12px";
    this.root.style.borderRadius = "10px";
    this.root.style.background = "rgba(0,0,0,0.55)";
    this.root.style.color = "white";
    this.root.style.fontFamily = "system-ui, Arial";
    this.root.style.fontSize = "14px";
    this.root.style.minWidth = "240px";
    this.root.style.pointerEvents = "none";

    // title
    const title = document.createElement("div");
    title.textContent = "Orders";
    title.style.fontWeight = "700";
    title.style.marginBottom = "6px";
    this.root.appendChild(title);

    // score line
    this.scoreText = document.createElement("div");
    this.scoreText.textContent = "Score: 0";
    this.scoreText.style.marginBottom = "2px";
    this.root.appendChild(this.scoreText);

    // served line
    this.servedText = document.createElement("div");
    this.servedText.textContent = "Served: 0";
    this.servedText.style.marginBottom = "8px";
    this.root.appendChild(this.servedText);

    // list
    this.ordersList = document.createElement("ul");
    this.ordersList.style.margin = "0";
    this.ordersList.style.paddingLeft = "18px";
    this.ordersList.style.lineHeight = "1.4";
    this.root.appendChild(this.ordersList);

    parent.appendChild(this.root);
  }

  public addScore() {
    this.score += 20;
    this.scoreText.textContent = `Score: ${this.score}`;
  }

  public addServed() {
    this.served++;
    this.servedText.textContent = `Served: ${this.served}`;
  }
  public checkScore(targetScore: number){
    return this.score >= targetScore;
  }
  public setOrders(orders: string[], recipe: string[]) {
    this.ordersList.innerHTML = "";

    if (orders.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No orders";
      li.style.opacity = "0.8";
      this.ordersList.appendChild(li);
      return;
    }

    for (let i = 0; i < orders.length; i++) {
      const li = document.createElement("li");
      li.textContent = orders[i] +' - ' + recipe[i];
      this.ordersList.appendChild(li);
    }
  }

  public destroy() {
    this.root.remove();
  }
}
