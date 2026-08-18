export interface User {
  id: number
  email: string
  passwordHash: string
}

export type NewUser = Omit<User, 'id'>
export type SafeUser = Omit<User, 'passwordHash'>

// We have this interface because there should be 2 implementations:
// an in-memory one for testing and a persistent one for production.
export interface UserRepository {
  create(user: NewUser): Promise<User>
  findById(id: number): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>  
}
