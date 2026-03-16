import { Hono } from "hono";
import userRoute from "./user/route";

import { responseOK } from "./utils/response";

const app = new Hono().basePath("/api");

app.get("/name", (c) => responseOK(c, "Success", { name: "Cloudflare" }));
app.route("/users", userRoute);

export default app;
