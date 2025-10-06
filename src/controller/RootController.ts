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
        public readonly model: RootModel,
    ) {
        this.hud = new HudView(document);
        this.hud.bind(this.model, this.shapes);
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.app.ticker.add(this.onTick);
        this.initInteractions();
    }

    stop() {
        if (!this.running) return;
        this.running = false;
        this.app.ticker.remove(this.onTick);
    }

    private initInteractions(): void {
        this.app.stage.hitArea = this.app.screen;

        this.app.stage.on("pointerdown", (event) => {
            console.log("CLICK!", event.global.x, event.global.y);
            if (event.target === this.app.stage) {
                this.shapes.addShapeAt(event.global.x, event.global.y);
            }
        });
    }

    private onTick = (ticker: any) => {
        const dt = (ticker.deltaMS ?? 16.6667) / 1000;

        this.shapes.update(dt);

        this.spawnAccumulator += dt * this.model.spawnPerSecond;
        while (this.spawnAccumulator >= 1) {
            this.shapes.addShape();
            this.spawnAccumulator -= 1;
        }
    };
}
