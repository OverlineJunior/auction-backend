import type { PrismaClient, users as PrismaUsers } from "../generated/prisma/client.js"
import type { NewUser, User, UserRepository } from "./user-repository-interface.js"

export class PersistentUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: NewUser): Promise<User> {
    const newUser = await this.prisma.users.create({
      data: {
        email: user.email,
        password_hash: user.passwordHash,
      },
    })
    return this.toDomain(newUser)
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    })
    return user ? this.toDomain(user) : undefined
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    })
    return user ? this.toDomain(user) : undefined
  }

  // We use a different naming convention for the domain model vs. the database model.
  private toDomain(record: PrismaUsers): User {
    return {
      id: record.id,
      email: record.email,
      passwordHash: record.password_hash,
    }
  }
}
