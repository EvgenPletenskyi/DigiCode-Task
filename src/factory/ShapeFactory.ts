import { IShapeModel, ShapeModelUtils, generateShapeId, type ShapeKey } from "@/model/ShapeModel";
import { BaseShapeView } from "@/view/shapes/BaseShapeView";
import { CircleView } from "@/view/shapes/CircleView";
import { PolygonView } from "@/view/shapes/PolygonView";
import { EllipseView } from "@/view/shapes/EllipseView";
import { CloudView } from "@/view/shapes/CloudView";

export interface ShapeEntity {
    model: IShapeModel;
    view: BaseShapeView;
}
type ViewCtor = new (model: IShapeModel) => BaseShapeView;

export class ShapeFactory {
    private registry: Record<ShapeKey, ViewCtor> = {
        poly3: PolygonView,
        poly4: PolygonView,
        poly5: PolygonView,
        poly6: PolygonView,
        circle: CircleView,
        ellipse: EllipseView,
        random: CloudView,
    };

    create(kind: ShapeKey, radius?: number, color?: number): ShapeEntity {
        const finalRadius = radius ?? ShapeModelUtils.getRandomRadius();
        const finalColor = color ?? ShapeModelUtils.getRandomColor();

        const model: IShapeModel = {
            id: generateShapeId(),
            type: kind, // зберігаємо ключ як type для дебагу
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: finalRadius,
            color: finalColor,
            onScreen: false,
            spawnOffset: 12,
        };

        // спеціальні параметри під вид:
        if (kind.startsWith("poly")) {
            const sides = Number(kind.replace("poly", "")) || 3;
            model.sides = Math.max(3, Math.min(12, sides));
        } else if (kind === "ellipse") {
            // рандомне співвідношення сторін 0.6–1.2
            const ratio = 0.6 + Math.random() * 0.6;
            model.ry = Math.max(1, Math.round(model.radius * ratio));
        }

        const Ctor = this.registry[kind];
        console.log("Creating shape:", kind, "Ctor =", Ctor);
        const view = new Ctor(model);
        return { model, view };
    }

    pickRandomKind(): ShapeKey {
        const keys = Object.keys(this.registry) as ShapeKey[];
        return keys[(Math.random() * keys.length) | 0];
    }
}
