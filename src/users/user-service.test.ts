import { describe, it } from "node:test"
import assert from "node:assert/strict"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import UserService from "./user-service.js"
import { InMemoryUserRepository } from "./in-memory-user-repository.js"
import config from "../config.js"
import type { AuthJwtPayload } from "../middleware/auth-middleware.js"

describe("User Service", () => {
  describe("register()", () => {
    it("successfully registers a new user", async () => {
      const userRepo = new InMemoryUserRepository()
      const userService = new UserService(userRepo)
      const rawPassword = "password123"

      const result = await userService.register("test@example.com", rawPassword)
      assert.equal(result.user.email, "test@example.com")
      assert.ok(result.user.id, "User ID should be returned")
      assert.ok(result.token, "Token should be returned")

      const savedUser = await userRepo.findById(result.user.id)
      assert.ok(savedUser, "User should exist in repository")
    })

    it("hashes the password before saving", async () => {
      const userRepo = new InMemoryUserRepository()
      const userService = new UserService(userRepo)
      const rawPassword = "password123"

      const result = await userService.register("test@example.com", rawPassword)

      const savedUser = await userRepo.findById(result.user.id)
      assert.equal(
        await bcrypt.compare(rawPassword, savedUser!.passwordHash),
        true,
      )
    })

    it("normalizes email (trims and converts to lowercase)", async () => {
      const userRepo = new InMemoryUserRepository()
      const userService = new UserService(userRepo)

      const { user } = await userService.register(
        "  TEST@EXAMPLE.COM ",
        "password123",
      )

      const savedUser = await userRepo.findById(user.id)
      assert.equal(savedUser!.email, "test@example.com")
    })

    it("returns sanitized user data", async () => {
      const userRepo = new InMemoryUserRepository()
      const userService = new UserService(userRepo)

      const { user } = await userService.register("test@example.com", "password123")
      assert.equal(
        "passwordHash" in user,
        false,
        "passwordHash should not be returned",
      )
    })

    it("returns a valid jwt token", async () => {
      const userRepo = new InMemoryUserRepository()
      const userService = new UserService(userRepo)
    
      const { user, token } = await userService.register(
        "test@example.com",
        "password123",
      )
    
      const payload = jwt.verify(token, config.jwt.secret) as AuthJwtPayload
      assert.equal(payload.userId, user.id)
    })

    it("throws an error when registering with an existing email", async () => {
      const userRepo = new InMemoryUserRepository()
      const userService = new UserService(userRepo)
      
      await userService.register("test@example.com", "password123")
      await assert.rejects(userService.register("test@example.com", "password123"))
    })
  })
})
