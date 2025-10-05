export type ShapeType = "circle" | "triangle" | "hexagon" | "polygon";

let nextId = 1;
export function generateShapeId(): number {
    return nextId++;
}

export interface IShapeModel {
    id: number;
    type: ShapeType;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: number;
    sides?: number;
    onScreen?: boolean;
    spawnOffset?: number;
}

export class ShapeModelUtils {
    static minRadius = 24;
    static maxRadius = 35;

    static getRandomRadius(): number {
        return Math.random() * (this.maxRadius - this.minRadius) + this.minRadius;
    }

    static getRandomColor(): number {
        const hue = Math.random();
        const saturation = 0.6 + Math.random() * 0.4;
        const lightness = 0.4 + Math.random() * 0.2;
        const [r, g, b] = this.hslToRgb(hue, saturation, lightness);
        return (r << 16) | (g << 8) | b;
    }

    private static hslToRgb(h: number, s: number, l: number): [number, number, number] {
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => {
            const k = (n + h * 12) % 12;
            const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
            return Math.round(color * 255);
        };
        return [f(0), f(8), f(4)];
    }
}
