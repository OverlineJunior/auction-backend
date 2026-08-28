import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import config from "../config.js"

declare global {
	namespace Express {
		interface Request {
			userId?: number
		}
	}
}

export interface AuthJwtPayload {
	userId: number
}

export default function requireAuth(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization
	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ message: "No bearer authorization header" })
	}

	const token = authHeader.split(" ")[1]
	if (!token) {
		return res.status(401).json({ message: "No token provided" })
	}

	try {
		const payload = jwt.verify(token, config.jwt.secret) as AuthJwtPayload
		req.userId = payload.userId
		return next()
	} catch {
		return res.status(401).json({ message: "Invalid or expired token" })
	}
}
