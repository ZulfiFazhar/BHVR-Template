import { Hono } from "hono";
import { userController } from "./userController";

const userRoute = new Hono();

userRoute.get("/", userController.getUsers);
userRoute.post("/", userController.createUser);
userRoute.get("/:id", userController.getUserById);
userRoute.put("/:id", userController.updateUser);
userRoute.delete("/:id", userController.removeUser);

export default userRoute;
