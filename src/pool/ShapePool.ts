import type { ShapeEntity } from "@/factory/ShapeFactory";
import type { ShapeKey } from "@/model/ShapeModel";

export class ShapePool {
    private buckets: Partial<Record<ShapeKey, ShapeEntity[]>> = {};

    private bucket(type: ShapeKey): ShapeEntity[] {
        return (this.buckets[type] ??= []);
    }

    tryObtain(type: ShapeKey): ShapeEntity | undefined {
        const b = this.bucket(type);
        return b.length > 0 ? b.pop()! : undefined;
    }

    recycle(e: ShapeEntity): void {
        e.view.off("pointertap");
        e.view.visible = false;
        e.view.removeFromParent();
        this.bucket(e.model.type).push(e);
    }
}
