import { BaseShapeView } from "./BaseShapeView";

/** Проста «хмаринка»: кілька кіл різного радіуса в одному path */
export class CloudView extends BaseShapeView {
    protected draw(): void {
        const R = this.model.radius;
        const r1 = R * 0.9,
            r2 = R * 0.7,
            r3 = R * 0.8,
            r4 = R * 0.6;

        this.gfx.circle(-R * 0.6, 0, r1);
        this.gfx.circle(0, -R * 0.3, r2);
        this.gfx.circle(R * 0.5, -R * 0.1, r3);
        this.gfx.circle(R * 0.1, R * 0.35, r4);
    }

    getArea(): number {
        const R = this.model.radius;
        const r1 = R * 0.9,
            r2 = R * 0.7,
            r3 = R * 0.8,
            r4 = R * 0.6;
        return Math.PI * (r1 ** 2 + r2 ** 2 + r3 ** 2 + r4 ** 2);
    }
}
