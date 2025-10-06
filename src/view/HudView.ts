import type { RootModel } from "@/model/RootModel";
import type { ShapeController } from "@/controller/ShapeController";
import { eventBus } from "@/app/EventEmitter";

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
    private unsubscribe: Array<() => void> = [];
    private gravityValue = 0;
    private spawnValue = 0;

    constructor(root: HTMLElement | Document = document) {
        this.root = root.querySelector<HTMLElement>(".hud")!;
        this.countEl = this.root.querySelector<HTMLInputElement>("#hud-count")!;
        this.areaEl = this.root.querySelector<HTMLInputElement>("#hud-area")!;
        this.gravityEl = document.querySelector<HTMLInputElement>("#gravity-value")!;
        this.spawnEl = document.querySelector<HTMLInputElement>("#spawn-value")!;
        this.gravityDecBtn = document.querySelector<HTMLButtonElement>("#gravity-dec")!;
        this.gravityIncBtn = document.querySelector<HTMLButtonElement>("#gravity-inc")!;
        this.spawnDecBtn = document.querySelector<HTMLButtonElement>("#spawn-dec")!;
        this.spawnIncBtn = document.querySelector<HTMLButtonElement>("#spawn-inc")!;
    }

    private disposeSubscriptions(): void {
        for (const dispose of this.unsubscribe) {
            dispose();
        }
        this.unsubscribe = [];
    }

    update(count: number, areaPx2: number): void {
        this.countEl.value = String(count);
        this.areaEl.value = Math.round(areaPx2).toLocaleString();
    }

    bind(model: RootModel, shapes: ShapeController): void {
        this.disposeSubscriptions();

        this.unsubscribe = [
            eventBus.on("model:gravityChanged", (v) => {
                this.gravityValue = v;
                this.gravityEl.value = v.toFixed(0);
            }),
            eventBus.on("model:spawnRateChanged", (v) => {
                this.spawnValue = v;
                this.spawnEl.value = v.toFixed(1);
            }),
            eventBus.on("shapes:statsChanged", ({ count, area }) => this.update(count, area)),
        ];

        this.gravityValue = model.gravity;
        this.spawnValue = model.spawnPerSecond;
        this.gravityEl.value = this.gravityValue.toFixed(0);
        this.spawnEl.value = this.spawnValue.toFixed(1);

        const { count, area } = shapes.getStats();
        this.update(count, area);

        this.gravityDecBtn.onclick = () =>
            eventBus.emit("hud:request:setGravity", Math.max(50, this.gravityValue - 10));
        this.gravityIncBtn.onclick = () =>
            eventBus.emit("hud:request:setGravity", this.gravityValue + 10);
        this.spawnDecBtn.onclick = () =>
            eventBus.emit("hud:request:setSpawnRate", Math.max(0, this.spawnValue - 1));
        this.spawnIncBtn.onclick = () =>
            eventBus.emit("hud:request:setSpawnRate", this.spawnValue + 1);
    }
}
