import { Container, Graphics } from "pixi.js";
import type { IShapeModel } from "@/model/ShapeModel";

export abstract class BaseShapeView extends Container {
    protected gfx = new Graphics();

    constructor(public model: IShapeModel) {
        super();
        this.addChild(this.gfx);
        this.refreshAppearance();
        this.setPosition(model.x, model.y);

        this.eventMode = "static";
        this.cursor = "pointer";
    }

    setPosition(x: number, y: number): void {
        this.model.x = x;
        this.model.y = y;
        this.position.set(x, y);
    }
    updateShapePosition(): void {
        this.setPosition(this.model.x, this.model.y);
    }

    activate(): void {
        this.visible = true;
    }
    detach(): void {
        this.visible = false;
        this.removeFromParent();
    }
    dispose(): void {
        this.removeFromParent();
        this.destroy({ children: true });
    }

    /** Малюємо path у draw(), а потім застосовуємо стилі */
    refreshAppearance(): void {
        const color = this.model.color ?? 0xff00ff;
        this.gfx.clear();
        this.draw(); // сформували path
        this.gfx.fill({ color });
    }

    protected abstract draw(): void;
}
