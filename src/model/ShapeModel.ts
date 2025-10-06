export type ShapeKey = "poly3" | "poly4" | "poly5" | "poly6" | "circle" | "ellipse" | "random";

let shapeIdCounter = 0;
export const generateShapeId = () => ++shapeIdCounter;

export interface IShapeModel {
    id: number;
    type: ShapeKey;

    x: number;
    y: number;

    radius: number;
    sides?: number;

    ry?: number;

    color: number;
    spawnOffset?: number;
}

export class ShapeModelUtils {
    static minRadius = 24;
    static maxRadius = 36;

    static getRandomRadius(): number {
        const lo = this.minRadius,
            hi = this.maxRadius;
        if (!(hi > 0) || !(lo > 0) || hi <= lo) return 24;
        return Math.random() * (hi - lo) + lo;
    }

    static getRandomColor(): number {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return (r << 16) + (g << 8) + b;
    }
}
