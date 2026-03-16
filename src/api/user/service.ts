import { userRepository } from "./repository";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { NewUser } from "../../database/schema";

class UserService {
  async addUser(db: DrizzleD1Database, data: NewUser) {
    return await userRepository.add(db, data);
  }

  async getUsers(db: DrizzleD1Database) {
    return await userRepository.getAll(db);
  }

  async getUserById(db: DrizzleD1Database, id: number) {
    return await userRepository.findById(db, id);
  }

  async updateUser(db: DrizzleD1Database, id: number, data: Partial<NewUser>) {
    return await userRepository.update(db, id, data);
  }

  async removeUser(db: DrizzleD1Database, id: number) {
    return await userRepository.remove(db, id);
  }
}

export const userService = new UserService();
