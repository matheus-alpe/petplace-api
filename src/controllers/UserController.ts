import { Request, Response } from 'express'
import { UserService } from '../services/UserService'

export class UserController {
    async create(request: Request, response: Response): Promise<Response> {
        const { name } = request.body
        
        const userService = new UserService()
        const user = await userService.create(name)
        return response.json(user)
    }

    async read(_, response: Response): Promise<Response> {
        const userService = new UserService()
        const users = await userService.read()
        return response.json(users)
    }
}