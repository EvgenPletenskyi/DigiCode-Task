import type { Application } from "pixi.js";
import { RootModel } from "@/model/RootModel";
import { RootView } from "@/view/RootView";

export class ViewportController {
    private onResize = () => this.applyScale();

    constructor(
        private app: Application,
        private view: RootView,
        private model: RootModel,
    ) {}

    init(): void {
        this.app.renderer.resize(this.model.baseWidth, this.model.baseHeight);

        window.addEventListener("resize", this.onResize);
        this.applyScale();
    }

    dispose(): void {
        window.removeEventListener("resize", this.onResize);
    }

    private applyScale(): void {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = Math.min(vw / this.model.baseWidth, vh / this.model.baseHeight, 1);

        this.model.setScale(scale);
        this.view.applyCssSize();
    }
}
