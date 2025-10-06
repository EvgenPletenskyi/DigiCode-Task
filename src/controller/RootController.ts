import type { Application } from "pixi.js";
import type { ShapeController } from "@/controller/ShapeController";
import type { RootModel } from "@/model/RootModel";
import { HudView } from "@/view/HudView";
import { eventBus } from "@/app/EventEmitter";

export class RootController {
    private spawnAccumulator = 0;
    private hud: HudView;
    private unsubscribe: Array<() => void> = [];

    constructor(
        private app: Application,
        private shapes: ShapeController,
        public readonly model: RootModel,
    ) {
        this.hud = new HudView(document);
        this.hud.bind(this.model, this.shapes);

        this.registerEventHandlers();
    }

    start(): void {
        this.app.ticker.add(this.onTick);
        this.initInteractions();
    }

    private registerEventHandlers(): void {
        for (const dispose of this.unsubscribe) {
            dispose();
        }

        this.unsubscribe = [
            eventBus.on("hud:request:setGravity", (value) => this.model.setGravity(value)),
            eventBus.on("hud:request:setSpawnRate", (value) => this.model.setSpawnRate(value)),
        ];
    }

    private initInteractions(): void {
        this.app.stage.hitArea = this.app.screen;

        this.app.stage.on("pointerdown", (event) => {
            if (event.target === this.app.stage) {
                this.shapes.addShapeAt(event.global.x, event.global.y);
            }
        });
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
