import { IShapeModel, ShapeKey, ShapeModelUtils, generateShapeId } from "@/model/ShapeModel";
import { BaseShapeView } from "@/view/shapes/BaseShapeView";
import { CircleView } from "@/view/shapes/CircleView";
import { EllipseView } from "@/view/shapes/EllipseView";
import { PolygonView } from "@/view/shapes/PolygonView";
import { CloudView } from "@/view/shapes/CloudView";

export interface ShapeEntity {
    model: IShapeModel;
    view: BaseShapeView;
}

type ViewCtor = new (model: IShapeModel) => BaseShapeView;

export class ShapeFactory {
    private registry: Record<ShapeKey, ViewCtor> = {
        circle: CircleView,
        ellipse: EllipseView,
        poly3: PolygonView,
        poly4: PolygonView,
        poly5: PolygonView,
        poly6: PolygonView,
        random: CloudView,
    };

    create(type: ShapeKey, radius?: number, color?: number): ShapeEntity {
        const finalRadius = radius ?? ShapeModelUtils.getRandomRadius();
        const finalColor = color ?? ShapeModelUtils.getRandomColor();

        const model: IShapeModel = {
            id: generateShapeId(),
            type,
            x: 0,
            y: 0,
            radius: finalRadius,
            color: finalColor,
            onScreen: false,
            spawnOffset: 12,
        };

        if (type.startsWith("poly")) {
            model.sides = Number(type.replace("poly", "")) || 3;
        } else if (type === "ellipse") {
            const ratio = 0.6 + Math.random() * 0.6;
            model.ry = Math.max(1, Math.round(model.radius * ratio));
        }

        const Ctor = this.registry[type];
        const view = new Ctor(model);
        return { model, view };
    }

    pickRandomType(): ShapeKey {
        const keys = Object.keys(this.registry) as ShapeKey[];
        return keys[(Math.random() * keys.length) | 0];
    }
}
