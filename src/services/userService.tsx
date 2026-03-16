import { api, http } from "@/lib/http";
import type { ApiResponse } from "@/types/apiResponse";
import type { User, NewUser } from "@/database/schema";

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await http
      .get(api.users.getAll)
      .json<ApiResponse<User[]>>();
    return response.data!;
  },

  async getUser(id: number): Promise<User> {
    const response = await http
      .get(api.users.getOne(id))
      .json<ApiResponse<User>>();
    return response.data!;
  },

  async createUser(data: NewUser): Promise<User> {
    const response = await http
      .post(api.users.create, {
        json: data,
      })
      .json<ApiResponse<User>>();
    return response.data!;
  },

  async updateUser(id: number, data: Partial<NewUser>): Promise<User> {
    const response = await http
      .put(api.users.update(id), {
        json: data,
      })
      .json<ApiResponse<User>>();
    return response.data!;
  },

  async deleteUser(id: number): Promise<void> {
    await http.delete(api.users.delete(id));
  },
};

export type { User };
