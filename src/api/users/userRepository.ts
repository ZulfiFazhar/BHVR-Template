type User = {
  id: number;
  name: string;
};

class UserRepository {
  private data: User[] = [];

  getAll(): User[] {
    return this.data;
  }

  findById(id: number): User | undefined {
    return this.data.find((user) => user.id === id);
  }

  add(user: User): User {
    this.data.push(user);
    return user;
  }

  update(id: number, name: string): User | null {
    const user = this.data.find((user) => user.id === id);
    if (user) {
      user.name = name;
      return user;
    }
    return null;
  }

  remove(id: number): void {
    const index = this.data.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }

  count(): number {
    return this.data.length;
  }
}

export const userRepository = new UserRepository();
