import { PrismaPg } from "@prisma/adapter-pg"
import express from "express"
import config from "./config.js"
import { PrismaClient } from "./generated/prisma/client.js"
import { PersistentUserRepository } from "./users/persistent-user-repository.js"
import createUserRoutes from "./users/user-routes.js"
import UserService from "./users/user-service.js"

const adapter = new PrismaPg(config.databaseUrl)
const client = new PrismaClient({ adapter })
const userRepository = new PersistentUserRepository(client)
const userService = new UserService(userRepository)

express()
	.use(express.json())
	.use("/api/auth", createUserRoutes(userService))
	.listen(config.port, () => {
		console.log(`Server running on port ${config.port}`)
	})
