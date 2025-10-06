import { Application } from "pixi.js";
import type { RootModel } from "@/model/RootModel";
import { ShapeFactory, type ShapeEntity } from "@/factory/ShapeFactory";
import { ShapeModelUtils, type ShapeKey } from "@/model/ShapeModel";
import { ShapePool } from "@/pool/ShapePool";
import { EventEmitter } from "@/app/EventEmitter";

export class ShapeController {
    private factory = new ShapeFactory();
    private pool = new ShapePool();
    private active: ShapeEntity[] = [];

    readonly onStatsChanged = new EventEmitter<{ count: number; area: number }>();

    constructor(
        private app: Application,
        private model: RootModel,
    ) {}

    private emitStats(): void {
        this.onStatsChanged.emit(this.getStats());
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
            target.model.onScreen = false;
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
        let e = this.pool.tryObtain(t);

        if (!e) {
            e = this.factory.create(t);
        }

        e.model.radius = ShapeModelUtils.getRandomRadius();
        e.model.color = ShapeModelUtils.getRandomColor();

        if (e.model.type === "ellipse") {
            const ratio = 0.6 + Math.random() * 0.6;
            e.model.ry = Math.max(1, Math.round(e.model.radius * ratio));
        }

        const r = e.model.radius;
        const offset = e.model.spawnOffset ?? 12;
        const minX = r,
            maxX = this.model.baseWidth - r;
        const x = Math.random() * (maxX - minX) + minX;
        const y = -r - offset;

        e.model.x = x;
        e.model.y = y;
        e.model.onScreen = true;

        e.view.setPosition(x, y);
        e.view.refreshAppearance();
        e.view.visible = true;

        this.wireInteractions(e);
        this.active.push(e);
        this.app.stage.addChild(e.view);

        this.emitStats();
    }

    addShapeAt(x: number, y: number): void {
        const type = this.factory.pickRandomType();
        let e = this.pool.tryObtain(type) ?? this.factory.create(type);

        e.model.radius = ShapeModelUtils.getRandomRadius();
        e.model.color = ShapeModelUtils.getRandomColor();

        if (e.model.type === "ellipse") {
            const ratio = 0.6 + Math.random() * 0.6;
            e.model.ry = Math.max(1, Math.round(e.model.radius * ratio));
        }

        e.model.x = x;
        e.model.y = y;
        e.model.onScreen = true;

        e.view.setPosition(x, y);
        e.view.refreshAppearance();
        e.view.visible = true;

        this.wireInteractions(e);
        this.active.push(e);
        this.app.stage.addChild(e.view);
        this.onStatsChanged.emit(this.getStats());
    }

    update(dt: number): void {
        let changed = false;

        for (let i = this.active.length - 1; i >= 0; i--) {
            const e = this.active[i];
            e.model.y += this.model.gravity * dt;

            if (e.model.y - e.model.radius > this.model.baseHeight) {
                this.active.splice(i, 1);
                e.model.onScreen = false;
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
