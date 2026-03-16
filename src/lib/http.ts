import ky from "ky";

export const api = {
  users: {
    getAll: "users",
    getOne: (id: number) => `users/${id}`,
    create: "users",
    update: (id: number) => `users/${id}`,
    delete: (id: number) => `users/${id}`,
  },
};

export const http = ky.create({
  prefixUrl: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // You can add common hooks here, e.g., for auth tokens
  hooks: {},
});
