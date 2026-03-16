import type { Context } from "hono";
import { userService } from "./service";
import { getDb, type Env } from "../../database/db";
import {
  responseCreated,
  responseNotFound,
  responseOK,
} from "../utils/response";

class UserController {
  createUser = async (c: Context<{ Bindings: Env }>) => {
    const db = getDb(c.env);
    const body = await c.req.json();
    const newUser = await userService.addUser(db, body);
    return responseCreated(c, "User created successfully", newUser);
  };

  getUsers = async (c: Context<{ Bindings: Env }>) => {
    const db = getDb(c.env);
    const users = await userService.getUsers(db);
    return responseOK(c, "Users retrieved successfully", users);
  };

  getUserById = async (c: Context<{ Bindings: Env }>) => {
    const db = getDb(c.env);
    const id = Number(c.req.param("id"));
    const user = await userService.getUserById(db, id);
    if (!user) {
      return responseNotFound(c, "User not found");
    }
    return responseOK(c, "User retrieved successfully", user);
  };

  updateUser = async (c: Context<{ Bindings: Env }>) => {
    const db = getDb(c.env);
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const updatedUser = await userService.updateUser(db, id, body);
    if (!updatedUser) {
      return responseNotFound(c, "User not found");
    }
    return responseOK(c, "User updated successfully", updatedUser);
  };

  removeUser = async (c: Context<{ Bindings: Env }>) => {
    const db = getDb(c.env);
    const id = Number(c.req.param("id"));
    await userService.removeUser(db, id);
    return responseOK(c, "User removed successfully");
  };
}

export const userController = new UserController();
