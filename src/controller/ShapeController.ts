import { Application } from "pixi.js";
import type { RootModel } from "@/model/RootModel";
import { ShapeFactory, type ShapeEntity } from "@/factory/ShapeFactory";
import { ShapeModelUtils, type ShapeKey } from "@/model/ShapeModel";
import { ShapePool } from "@/pool/ShapePool";
import { eventBus } from "@/app/EventEmitter";

export class ShapeController {
    private factory = new ShapeFactory();
    private pool = new ShapePool();
    private active: ShapeEntity[] = [];

    constructor(
        private app: Application,
        private model: RootModel,
    ) {}

    private emitStats(): void {
        eventBus.emit("shapes:statsChanged", this.getStats());
    }

    private wireInteractions(e: ShapeEntity): void {
        e.view.off("pointertap");
        e.view.on("pointertap", () => this.onShapeClicked(e));
    }

    private onShapeClicked(target: ShapeEntity): void {
        const type = target.model.type;
        const idx = this.active.indexOf(target);
        if (idx !== -1) {
            this.active.splice(idx, 1);
            this.pool.recycle(target);
        }

        for (const e of this.active) {
            if (e.model.type === type) {
                e.model.color = ShapeModelUtils.getRandomColor();
                e.view.refreshAppearance();
            }
        }
        this.emitStats();
    }

    addShape(type?: ShapeKey): void {
        const t = type ?? this.factory.pickRandomType();
        const e = this.obtainOrCreate(t);

        const r = e.model.radius;
        const offset = e.model.spawnOffset ?? 12;
        const minX = r;
        const maxX = this.model.baseWidth - r;
        const x = Math.random() * (maxX - minX) + minX;
        const y = -r - offset;

        this.finalizeShape(e, x, y);
    }

    addShapeAt(x: number, y: number): void {
        const type = this.factory.pickRandomType();
        const e = this.obtainOrCreate(type);
        this.finalizeShape(e, x, y);
    }

    private obtainOrCreate(type: ShapeKey): ShapeEntity {
        const e = this.pool.tryObtain(type) ?? this.factory.create(type);
        e.model.radius = ShapeModelUtils.getRandomRadius();
        e.model.color = ShapeModelUtils.getRandomColor();

        if (e.model.type === "ellipse") {
            const ratio = 0.6 + Math.random() * 0.6;
            e.model.ry = Math.max(1, Math.round(e.model.radius * ratio));
        }

        return e;
    }

    private finalizeShape(e: ShapeEntity, x: number, y: number): void {
        e.model.x = x;
        e.model.y = y;

        e.view.setPosition(x, y);
        e.view.refreshAppearance();
        e.view.visible = true;

        this.wireInteractions(e);
        this.active.push(e);
        this.app.stage.addChild(e.view);
        this.emitStats();
    }

    update(dt: number): void {
        let changed = false;

        for (let i = this.active.length - 1; i >= 0; i--) {
            const e = this.active[i];
            e.model.y += this.model.gravity * dt;

            if (e.model.y - e.model.radius > this.model.baseHeight) {
                this.active.splice(i, 1);
                this.pool.recycle(e);
                changed = true;
                continue;
            }
            e.view.updateShapePosition();
        }

        if (changed) this.emitStats();
    }

    getStats(): { count: number; area: number } {
        let area = 0;
        for (const e of this.active) {
            area += e.view.getArea();
        }
        return { count: this.active.length, area };
    }
}
