export class AppError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message)
	}
}

export class AuthError extends AppError {
	constructor(message = "Invalid credentials") {
		super(401, message)
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Resource not found") {
		super(404, message)
	}
}

export class ConflictError extends AppError {
	constructor(message = "Resource already exists") {
		super(409, message)
	}
}
