import type { RootModel } from "@/model/RootModel";
import type { ShapeController } from "@/controller/ShapeController";

export class HudView {
    private root: HTMLElement;
    private countEl: HTMLInputElement;
    private areaEl: HTMLInputElement;
    private gravityEl: HTMLInputElement;
    private spawnEl: HTMLInputElement;
    private gravityDecBtn: HTMLButtonElement;
    private gravityIncBtn: HTMLButtonElement;
    private spawnDecBtn: HTMLButtonElement;
    private spawnIncBtn: HTMLButtonElement;

    constructor(root: HTMLElement | Document = document) {
        this.root = root.querySelector<HTMLElement>(".hud")!;
        this.countEl = this.root.querySelector("#hud-count") as HTMLInputElement;
        this.areaEl = this.root.querySelector("#hud-area") as HTMLInputElement;
        this.gravityEl = document.getElementById("gravity-value") as HTMLInputElement;
        this.spawnEl = document.getElementById("spawn-value") as HTMLInputElement;
        this.gravityDecBtn = document.getElementById("gravity-dec") as HTMLButtonElement;
        this.gravityIncBtn = document.getElementById("gravity-inc") as HTMLButtonElement;
        this.spawnDecBtn = document.getElementById("spawn-dec") as HTMLButtonElement;
        this.spawnIncBtn = document.getElementById("spawn-inc") as HTMLButtonElement;
    }

    update(count: number, areaPx2: number): void {
        this.countEl.value = String(count);
        this.areaEl.value = Math.round(areaPx2).toLocaleString();
    }

    bind(model: RootModel, shapes: ShapeController): void {
        model.onGravityChanged.on((v) => (this.gravityEl.value = v.toFixed(0)));
        model.onSpawnRateChanged.on((v) => (this.spawnEl.value = v.toFixed(1)));
        shapes.onStatsChanged.on(({ count, area }) => this.update(count, area));

        this.gravityEl.value = model.gravity.toFixed(1);
        this.spawnEl.value = model.spawnPerSecond.toFixed(1);

        this.gravityDecBtn.onclick = () => model.setGravity(Math.max(50, model.gravity - 10));
        this.gravityIncBtn.onclick = () => model.setGravity(model.gravity + 10);
        this.spawnDecBtn.onclick = () => model.setSpawnRate(Math.max(0, model.spawnPerSecond - 1));
        this.spawnIncBtn.onclick = () => model.setSpawnRate(model.spawnPerSecond + 1);
    }
}
