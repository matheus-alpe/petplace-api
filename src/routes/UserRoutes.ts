import { Router } from 'express'
import { UserController } from '../controllers/UserController'

const routes = Router()

const userController = new UserController()

routes.get("/users", userController.read);
routes.post("/users", userController.create);

export { routes }