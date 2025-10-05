import type { ShapeController } from "@/controller/ShapeController";
import type { RootModel } from "@/model/RootModel";

export class RootController {
    private running = false;
    private last = 0;

    private spawnAccumulator = 0;

    constructor(
        private shapes: ShapeController,
        private model: RootModel,
    ) {}

    start() {
        if (this.running) return;
        this.running = true;
        this.last = performance.now();
        this.loop();
    }

    stop() {
        this.running = false;
    }

    private loop = () => {
        if (!this.running) return;

        const now = performance.now();
        const dtMs = now - this.last;
        const dt = dtMs / 1000; // у секундах
        this.last = now;

        this.shapes.update(dtMs);

        this.spawnAccumulator += dt * this.model.spawnPerSecond;
        while (this.spawnAccumulator >= 1) {
            this.shapes.addShape(this.pickType());
            this.spawnAccumulator -= 1;
        }

        requestAnimationFrame(this.loop);
    };

    private pickType(): "circle" | "triangle" | "hexagon" {
        const bag = ["circle", "triangle", "hexagon"] as const;
        return bag[(Math.random() * bag.length) | 0];
    }
}
