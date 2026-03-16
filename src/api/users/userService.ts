import { userRepository } from "./userRepository";

class UserService {
  addUser(name: string) {
    const newUser = { id: userRepository.count() + 1, name };
    return userRepository.add(newUser);
  }

  getUsers() {
    return userRepository.getAll();
  }

  getUserById(id: number) {
    return userRepository.findById(id);
  }

  updateUser(id: number, name: string) {
    return userRepository.update(id, name);
  }

  removeUser(id: number) {
    return userRepository.remove(id);
  }
}

export const userService = new UserService();
