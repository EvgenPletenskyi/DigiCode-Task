export type ShapeKey = "poly3" | "poly4" | "poly5" | "poly6" | "circle" | "ellipse" | "random";

let shapeIdCounter = 0;
export const generateShapeId = () => ++shapeIdCounter;

export interface IShapeModel {
    id: number;
    // для сумісності можна тримати type, але фабрика працює з ShapeKey
    type: string;

    x: number;
    y: number;

    /** базовий радіус (для кола/багатокутника/еліпса як rx) */
    radius: number;

    /** для полігонів: кількість сторін */
    sides?: number;

    /** для еліпса: вертикальний радіус */
    ry?: number;

    color: number;
    onScreen?: boolean;
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
        // приємна палітра, добре видно на темному фоні
        const palette = [0xff595e, 0xffca3a, 0x8ac926, 0x1982c4, 0x6a4c93];
        return palette[(Math.random() * palette.length) | 0];
    }
}
