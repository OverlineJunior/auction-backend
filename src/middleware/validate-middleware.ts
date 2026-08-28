import type { NextFunction, Request, Response } from "express"
import { prettifyError, type ZodType } from "zod"

export default function validate(schema: ZodType) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body)

		if (!result.success) {
			return res.status(400).json({
				error: "Validation failed",
				details: prettifyError(result.error),
			})
		}

		req.body = result.data

		return next()
	}
}
