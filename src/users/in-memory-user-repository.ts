import type { CreateUser, User, UserRepository } from "./user-repository-interface.js"

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async create(user: CreateUser): Promise<User> {
    const newUser: User = { id: this.users.length + 1, ...user }
    this.users.push(newUser)
    return newUser
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id)
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email)
  }
}
