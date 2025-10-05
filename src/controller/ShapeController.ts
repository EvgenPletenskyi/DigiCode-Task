import { Application } from "pixi.js";
import type { RootModel } from "@/model/RootModel";
import { ShapeFactory, type ShapeEntity } from "@/factory/ShapeFactory";
import { ShapeModelUtils, type ShapeKey } from "@/model/ShapeModel";

export class ShapeController {
    private factory = new ShapeFactory();
    private active: ShapeEntity[] = [];
    private pool: ShapeEntity[] = [];

    constructor(
        private app: Application,
        private model: RootModel,
    ) {}

    /** Взяти з пулу або створити нову (тип задається ключем фабрики) */
    private obtain(kind: ShapeKey): ShapeEntity {
        if (this.pool.length > 0) {
            const e = this.pool.pop()!;

            e.model.radius = ShapeModelUtils.getRandomRadius();
            e.model.color = ShapeModelUtils.getRandomColor();

            e.view.refreshAppearance();
            e.view.activate();

            return e;
        }

        return this.factory.create(kind);
    }

    /** Прибрати зі сцени та покласти в пул */
    private recycle(e: ShapeEntity): void {
        e.view.detach();
        this.pool.push(e);
    }

    /** Додати фігуру згори екрана (якщо kind не заданий — випадковий) */
    addShape(kind?: ShapeKey): void {
        const k = kind ?? this.factory.pickRandomKind();
        const e = this.obtain(k);

        const r = e.model.radius;
        const offset = e.model.spawnOffset ?? 12;
        const minX = r;
        const maxX = this.model.baseWidth - r;
        const x = Math.random() * (maxX - minX) + minX;
        const y = -r - offset;

        e.view.setPosition(x, y);
        e.model.onScreen = true;

        this.active.push(e);
        this.app.stage.addChild(e.view);
    }

    /** Пакетне оновлення: падіння вниз та рецикл поза екран */
    update(dt: number): void {
        const g = this.model.gravity;
        const H = this.model.baseHeight;

        for (let i = this.active.length - 1; i >= 0; i--) {
            const e = this.active[i];

            e.model.y += g * dt;

            if (e.model.y - e.model.radius > H) {
                this.active.splice(i, 1);
                e.model.onScreen = false;
                this.recycle(e);
                continue;
            }

            e.view.updateShapePosition();
        }
    }
}
