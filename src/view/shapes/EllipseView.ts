import { BaseShapeView } from "./BaseShapeView";

export class EllipseView extends BaseShapeView {
    protected draw(): void {
        const rx = this.model.radius;
        const ry = this.model.ry ?? rx;

        this.gfx.ellipse(0, 0, rx, ry);
    }

    getArea(): number {
        return 0;
    }
}
