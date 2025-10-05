import { BaseShapeView } from "./BaseShapeView";

export class PolygonView extends BaseShapeView {
    protected draw(): void {
        const R = this.model.radius;
        const n = this.model.sides ?? 3;
        const step = (Math.PI * 2) / n;

        this.gfx.moveTo(R, 0);
        for (let i = 1; i < n; i++) {
            this.gfx.lineTo(Math.cos(step * i) * R, Math.sin(step * i) * R);
        }
        this.gfx.closePath();
    }
}
