import { api, http } from "@/lib/http";

type User = {
  id: number;
  name: string;
};

export const userService = {
  async getUsers(): Promise<User[]> {
    return http.get(api.users.getAll).json<User[]>();
  },

  async getUser(id: number): Promise<User> {
    return http.get(api.users.getOne(id)).json<User>();
  },

  async createUser(name: string): Promise<User> {
    return http
      .post(api.users.create, {
        json: { name },
      })
      .json<User>();
  },

  async updateUser(id: number, name: string): Promise<User> {
    return http
      .put(api.users.update(id), {
        json: { name },
      })
      .json<User>();
  },

  async deleteUser(id: number): Promise<void> {
    await http.delete(api.users.delete(id));
  },
};

export type { User };
