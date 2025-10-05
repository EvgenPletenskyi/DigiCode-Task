import { App } from "@/app/App";

const app = new App();
app.init("app").catch((err) => {
    console.error("App init failed:", err);
});
