import { getCustomRepository, Repository } from 'typeorm'
import { User } from '../entities/User'
import { UserRepository } from '../repositories/UserRepository'

export class UserService {
    private userRepository: Repository<User>

    constructor() {
        this.userRepository = getCustomRepository(UserRepository)
    }

    async create(name: string) {
        const user = this.userRepository.create({
            name
        })

        this.userRepository.save(user)
        return user
    }

    async read() {
        const users = this.userRepository.find()
        return users
    }
}