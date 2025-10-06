import { EventEmitter } from "@/app/EventEmitter";

export class RootModel {
    baseWidth = 960;
    baseHeight = 540;
    background = 0x12131a;
    resolution = Math.min(window.devicePixelRatio || 1, 2);
    antialias = true;

    scale = 1;
    cssWidth = this.baseWidth;
    cssHeight = this.baseHeight;

    gravity = 100;
    maxGravity = 500;
    spawnPerSecond = 5;

    readonly onGravityChanged = new EventEmitter<number>();
    readonly onSpawnRateChanged = new EventEmitter<number>();

    setGravity(value: number): void {
        const clamped = Math.min(this.maxGravity, Math.max(0, value));
        this.gravity = clamped;
        this.onGravityChanged.emit(clamped);
    }

    setSpawnRate(value: number): void {
        this.spawnPerSecond = value;
        this.onSpawnRateChanged.emit(value);
    }

    setScale(scale: number) {
        this.scale = scale;
        this.cssWidth = Math.round(this.baseWidth * scale);
        this.cssHeight = Math.round(this.baseHeight * scale);
    }
}
