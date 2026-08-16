export interface User {
  id: number
  email: string
  passwordHash: string
}

export type CreateUser = Omit<User, 'id'>
export type UserResponse = Omit<User, 'passwordHash'>

// We have this interface because there should be 2 implementations:
// an in-memory one for testing and a persistent one for production.
export interface UserRepository {
  create(user: CreateUser): Promise<User>
  findById(id: number): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>  
}
