import express from "express"
import z from "zod"
import { AppError } from "../errors.js"
import requireAuth from "../middleware/auth-middleware.js"
import validate from "../middleware/validate-middleware.js"
import type UserService from "./user-service.js"

export const registerSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
})

export type RegisterSchema = z.infer<typeof registerSchema>

export default function createUserRoutes(userService: UserService) {
	const routes = express.Router()

	const handleError = (res: express.Response, err: unknown) => {
		if (err instanceof AppError) {
			return res.status(err.status).json({ error: err.message })
		}
		return res.status(500).json({ error: "Internal server error" })
	}

	routes.post("/register", validate(registerSchema), async (req, res) => {
		try {
			const { email, password } = req.body as RegisterSchema
			const result = await userService.register(email, password)
			res.status(201).json(result)
		} catch (err) {
			handleError(res, err)
		}
	})

	routes.post("/login", validate(registerSchema), async (req, res) => {
		try {
			const { email, password } = req.body as RegisterSchema
			const result = await userService.login(email, password)
			res.status(200).json(result)
		} catch (err) {
			handleError(res, err)
		}
	})

	routes.get("/me", requireAuth, async (req, res) => {
		try {
			const user = await userService.getUserById(req.userId!)
			res.json(user)
		} catch (err) {
			handleError(res, err)
		}
	})

	return routes
}
