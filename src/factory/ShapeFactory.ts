import { ShapeView } from "@/view/ShapeView";
import { IShapeModel, ShapeType, ShapeModelUtils, generateShapeId } from "@/model/ShapeModel";

export interface ShapeEntity {
    model: IShapeModel;
    view: ShapeView;
}

export class ShapeFactory {
    create(type: ShapeType, radius?: number, color?: number): ShapeEntity {
        const finalRadius = radius ?? ShapeModelUtils.getRandomRadius();
        const finalColor = color ?? ShapeModelUtils.getRandomColor();

        const model: IShapeModel = {
            id: generateShapeId(),
            type,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: finalRadius,
            color: finalColor,
            onScreen: false,
            spawnOffset: 12,
        };

        const view = new ShapeView(model);

        return { model, view };
    }
}
