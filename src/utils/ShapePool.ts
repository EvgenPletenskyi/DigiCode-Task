import type { IShapeView } from "@/utils/ShapeFactory";

export class ShapePool {
    private pool: IShapeView[] = [];

    tryObtain(): IShapeView | undefined {
        return this.pool.find((e) => !e.model.active);
    }

    recycle(e: IShapeView): void {
        e.view.off("pointertap");
        e.model.active = false;

        if (!this.pool.includes(e)) {
            this.pool.push(e);
        }
    }
}
