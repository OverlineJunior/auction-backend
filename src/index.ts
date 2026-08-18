import express from "express"
import config from "./config.js"
import { InMemoryUserRepository } from "./users/in-memory-user-repository.js"
import UserService from "./users/user-service.js"
import createUserRoutes from "./users/user-routes.js"

const userRepository = new InMemoryUserRepository()
const userService = new UserService(userRepository)

express()
  .use(express.json())
  .use('/api/auth', createUserRoutes(userService))
  .listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
  })
