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
    spawnPerSecond = 5;

    setScale(scale: number) {
        this.scale = scale;
        this.cssWidth = Math.round(this.baseWidth * scale);
        this.cssHeight = Math.round(this.baseHeight * scale);
    }
}
