import { Router } from 'express'
import { UserController } from './controllers/UserController'

const routes = Router()

routes.post('/user', new UserController().create)
routes.post('/login', new UserController().login)

routes.get('/profile', new UserController().getProfile)
routes.get('/users', new UserController().users)

export default routes
