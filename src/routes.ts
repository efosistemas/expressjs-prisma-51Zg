import { Router } from 'express'
import { UserController } from './controllers/UserController'

const routes = Router()

routes.post('/user', new UserController().create)
routes.get('/users', new UserController().users)
routes.post('/login', new UserController().login)

export default routes
