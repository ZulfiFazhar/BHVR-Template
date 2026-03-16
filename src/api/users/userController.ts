import type { Context } from "hono";
import { userService } from "./userService";

class UserController {
  createUser = async (c: Context) => {
    const { name } = await c.req.json();
    const newUser = userService.addUser(name);
    return c.json(newUser, 201);
  };

  getUsers = (c: Context) => {
    const users = userService.getUsers();
    return c.json(users);
  };

  getUserById = (c: Context) => {
    const id = Number(c.req.param("id"));
    const user = userService.getUserById(id);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json(user);
  };

  updateUser = async (c: Context) => {
    const id = Number(c.req.param("id"));
    const { name } = await c.req.json();
    const updatedUser = userService.updateUser(id, name);
    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json(updatedUser);
  };

  removeUser = (c: Context) => {
    const id = Number(c.req.param("id"));
    userService.removeUser(id);
    return c.json({ message: "User removed" });
  };
}

export const userController = new UserController();
