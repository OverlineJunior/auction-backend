import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config.js"
import type { SafeUser, User, UserRepository } from "./user-repository-interface.js"

const SALT_ROUNDS = 10

export default class UserService {
	constructor(private userRepo: UserRepository) {}

	/** Panics if the email is already in use. */
	async register(email: string, password: string): Promise<SafeUser> {
		const normalizedEmail = this.normalizeEmail(email)

		const existing = await this.userRepo.findByEmail(normalizedEmail)
		if (existing) throw new Error("E-mail already in use")

		const newUser = await this.userRepo.create({
			email: normalizedEmail,
			passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
		})

		return this.sanitizeUser(newUser)
	}

	/** Panics if the e-mail is not registered or the password is invalid. */
	async login(email: string, password: string): Promise<{ user: SafeUser; token: string }> {
		const normalizedEmail = this.normalizeEmail(email)

		const registeredUser = await this.userRepo.findByEmail(normalizedEmail)
		if (!registeredUser) throw new Error("Invalid credentials")

		const isPasswordValid = await bcrypt.compare(password, registeredUser.passwordHash)
		if (!isPasswordValid) throw new Error("Invalid credentials")

		const user = this.sanitizeUser(registeredUser)
		const token = this.generateToken(registeredUser.id)

		return { user, token }
	}

	async getUserById(userId: number): Promise<SafeUser> {
		const user = await this.userRepo.findById(userId)
		if (!user) throw new Error("User not found")
		return this.sanitizeUser(user)
	}

	private normalizeEmail(email: string): string {
		return email.trim().toLowerCase()
	}

	private generateToken(userId: number): string {
		return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
	}

	private sanitizeUser(user: User): SafeUser {
		return {
			id: user.id,
			email: user.email,
		}
	}
}
