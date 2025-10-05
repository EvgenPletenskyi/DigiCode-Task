export class HudView {
    private root: HTMLElement;
    private countEl: HTMLInputElement;
    private areaEl: HTMLInputElement;

    constructor(root: HTMLElement | Document = document) {
        this.root = root.querySelector<HTMLElement>(".hud")!;
        this.countEl = this.root.querySelector("#hud-count") as HTMLInputElement;
        this.areaEl = this.root.querySelector("#hud-area") as HTMLInputElement;
    }

    update(count: number, areaPx2: number): void {
        this.countEl.value = String(count);

        this.areaEl.value = Math.round(areaPx2).toLocaleString();
    }
}
