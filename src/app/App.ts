import { Application } from "pixi.js";
import { RootModel } from "@/model/RootModel";
import { RootView } from "@/view/RootView";
import { ViewportController } from "@/controller/ViewportController";
import { ShapeController } from "@/controller/ShapeController";
import { RootController } from "@/controller/RootController";

export class App {
    async init(mountId = "app"): Promise<void> {
        const mount = (document.getElementById(mountId) || document.body) as HTMLElement;
        const model = new RootModel();

        const app = new Application();
        await app.init({
            width: model.baseWidth,
            height: model.baseHeight,
            background: model.background,
            resolution: model.resolution,
            antialias: model.antialias,
        });

        app.stage.eventMode = "static";

        //  DEV PIXI  //
        // globalThis.__PIXI_APP__ = app;

        const view = new RootView(app, mount, model);
        view.init();

        const viewport = new ViewportController(app, view, model);
        viewport.init();

        const shapes = new ShapeController(app, model);

        const root = new RootController(app, shapes, model);
        root.start();
    }
}
