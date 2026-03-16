import { Hono } from "hono";
import userRoute from "./users/userRoute";

const app = new Hono().basePath("/api");

app.get("/name", (c) => c.json({ name: "Cloudflare" }));
app.route("/users", userRoute);

export default app;
