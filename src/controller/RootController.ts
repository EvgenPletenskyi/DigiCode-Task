// src/controller/RootController.ts
import type { Application } from "pixi.js";
import type { ShapeController } from "@/controller/ShapeController";
import type { RootModel } from "@/model/RootModel";
import { HudView } from "@/view/HudView";

export class RootController {
    private running = false;
    private spawnAccumulator = 0;
    private hud: HudView;

    constructor(
        private app: Application,
        private shapes: ShapeController,
        private model: RootModel,
    ) {
        this.hud = new HudView(document); // або передай mount, якщо треба
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.app.ticker.add(this.onTick);
    }

    stop() {
        if (!this.running) return;
        this.running = false;
        this.app.ticker.remove(this.onTick);
    }

    private onTick = (ticker: any) => {
        const dt = (ticker.deltaMS ?? 16.6667) / 1000;

        // фізика
        this.shapes.update(dt);

        // спавн
        this.spawnAccumulator += dt * this.model.spawnPerSecond;
        while (this.spawnAccumulator >= 1) {
            this.shapes.addShape();
            this.spawnAccumulator -= 1;
        }

        // HUD
        const { count, area } = this.shapes.getStats();
        this.hud.update(count, area);
    };
}
