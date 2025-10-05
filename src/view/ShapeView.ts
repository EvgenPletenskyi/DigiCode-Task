import { Container, Graphics } from "pixi.js";
import type { IShapeModel } from "@/model/ShapeModel";

export class ShapeView extends Container {
    private gfx: Graphics;

    constructor(public readonly model: IShapeModel) {
        super();

        this.gfx = new Graphics();
        this.addChild(this.gfx);

        this.position.set(model.x, model.y);
        this.drawShape();
    }

    private drawShape(): void {
        const { type, radius, color, sides = 3 } = this.model;

        switch (type) {
            case "circle":
                this.gfx.circle(0, 0, radius);
                break;

            case "triangle":
                this.drawPolygon(3, radius);
                break;

            case "hexagon":
                this.drawPolygon(6, radius);
                break;

            case "polygon":
                this.drawPolygon(sides, radius);
                break;
        }

        this.gfx.fill({ color });
    }

    private drawPolygon(sides: number, radius: number): void {
        const step = (Math.PI * 2) / sides;
        this.gfx.moveTo(radius, 0);

        for (let i = 1; i < sides; i++) {
            const x = Math.cos(step * i) * radius;
            const y = Math.sin(step * i) * radius;
            this.gfx.lineTo(x, y);
        }

        this.gfx.closePath();
    }

    setPosition(x: number, y: number): void {
        this.model.x = x;
        this.model.y = y;
        this.position.set(x, y);
    }

    activate(): void {
        this.visible = true;
    }

    detach(): void {
        this.visible = false;
    }

    updateShapePosition(): void {
        this.setPosition(this.model.x, this.model.y);
    }
}
