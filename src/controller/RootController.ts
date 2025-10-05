// src/controller/RootController.ts
import type { Application } from "pixi.js";
import type { ShapeController } from "@/controller/ShapeController";
import type { RootModel } from "@/model/RootModel";

export class RootController {
    private running = false;
    private spawnAccumulator = 0;

    constructor(
        private app: Application,
        private shapes: ShapeController,
        private model: RootModel,
    ) {}

    start() {
        if (this.running) return;
        this.running = true;
        this.app.ticker.add(this.onTick);
    }

    private onTick = (ticker: any) => {
        const dt = ticker.deltaMS / 1000;
        this.shapes.update(dt);

        this.spawnAccumulator += dt * this.model.spawnPerSecond;

        while (this.spawnAccumulator >= 1) {
            this.shapes.addShape();
            this.spawnAccumulator -= 1;
        }
    };
}
