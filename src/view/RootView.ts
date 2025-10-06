import { Application } from "pixi.js";
import { RootModel } from "@/model/RootModel";

export class RootView {
    constructor(
        public app: Application,
        private mount: HTMLElement,
        private model: RootModel,
    ) {}

    init(): void {
        if (!this.app.canvas.isConnected) {
            this.mount.appendChild(this.app.canvas);
        }
        this.applyCssSize();
    }

    applyCssSize(): void {
        const canvas = this.app.canvas as HTMLCanvasElement;
        Object.assign(canvas.style, {
            width: `${this.model.cssWidth}px`,
            height: `${this.model.cssHeight}px`,
            display: "block",
            margin: "20px auto",
        } as CSSStyleDeclaration);
    }
}
