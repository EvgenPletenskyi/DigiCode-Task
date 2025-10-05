import { BaseShapeView } from "./BaseShapeView";

export class CircleView extends BaseShapeView {
    protected draw(): void {
        this.gfx.circle(0, 0, this.model.radius);
    }
}
