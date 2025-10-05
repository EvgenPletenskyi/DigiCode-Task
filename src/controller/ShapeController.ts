import type { RootModel } from "@/model/RootModel";
import { ShapeFactory, type ShapeEntity } from "@/factory/ShapeFactory";
import { Application } from "pixi.js";
import { ShapeModelUtils } from "@/model/ShapeModel";

export class ShapeController {
    private factory: ShapeFactory;
    private active: ShapeEntity[] = [];
    private pool: ShapeEntity[] = [];

    constructor(
        private app: Application,
        private display: RootModel,
    ) {
        this.factory = new ShapeFactory();
    }

    private obtain(type: "circle" | "triangle" | "hexagon"): ShapeEntity {
        if (this.pool.length > 0) {
            const e = this.pool.pop()!;

            e.model.vx = 0;
            e.model.vy = 0;
            e.model.radius = ShapeModelUtils.getRandomRadius();
            e.model.color = ShapeModelUtils.getRandomColor();
            e.view.activate();

            return e;
        }

        const entity = this.factory.create(type);

        entity.model.radius = ShapeModelUtils.getRandomRadius();
        entity.model.color = ShapeModelUtils.getRandomColor();

        return entity;
    }

    private recycle(e: ShapeEntity): void {
        e.view.detach();
        this.pool.push(e);
    }

    addShape(type: "circle" | "triangle" | "hexagon"): void {
        const e = this.obtain(type);

        const r = e.model.radius;
        const offset = e.model.spawnOffset ?? 12;
        const minX = r;
        const maxX = this.display.baseWidth - r;
        const x = Math.random() * (maxX - minX) + minX;
        const y = -r - offset;

        e.model.vx = 0;
        e.model.vy = 0;
        e.view.setPosition(x, y);

        this.active.push(e);
        this.app.stage.addChild(e.view);
    }

    update(dtMs: number): void {
        const dt = dtMs / 1000;
        const g = this.display.gravity;
        const H = this.display.baseHeight;

        for (let i = this.active.length - 1; i >= 0; i--) {
            const e = this.active[i];

            e.model.vy += g * dt;
            e.model.y += e.model.vy * dt;

            if (e.model.y - e.model.radius > H) {
                this.active.splice(i, 1);
                this.recycle(e);
                continue;
            }

            e.view.updateShapePosition();
        }
    }
}
