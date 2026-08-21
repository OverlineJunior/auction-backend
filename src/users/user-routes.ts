import express from "express"
import z from "zod"
import validate from "../middleware/validate-middleware.js"
import type UserService from "./user-service.js"
import requireAuth from "../middleware/auth-middleware.js"

export const registerSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
})

export type RegisterSchema = z.infer<typeof registerSchema>

export default function createUserRoutes(userService: UserService) {
  const routes = express.Router()

  routes.post(
    "/register",
    validate(registerSchema),
    async (req, res) => {
      try {
        const { email, password } = req.body as RegisterSchema
        const result = await userService.register(email, password)
        res.status(201).json(result)
      } catch (err) {
        res.status(500).json({
          error: err instanceof Error ? err.message : "Internal server error",
        })
      }
    },
  )

  routes.post(
    "/login",
    validate(registerSchema),
    async (req, res) => {
      try {
        const { email, password } = req.body as RegisterSchema
        const result = await userService.login(email, password)
        res.status(200).json(result)
      } catch (err) {
        res.status(500).json({
          error: err instanceof Error ? err.message : "Internal server error",
        })
      }
    },
  )

  routes.get(
    "/me",
    requireAuth,
    async (req, res) => {
      const user = await userService.getUserById(req.userId!)
      res.json(user)
    },
  )

  return routes
}
