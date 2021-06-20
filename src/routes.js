import { Router } from 'express';

import AuthController from './controllers/AuthController.js';
import UsersController from './controllers/UsersController.js';

const routes = Router();

routes.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to Node.js API 😁' });
});

routes.post('/login', AuthController.authenticate);
routes.get(
    '/load-session',
    AuthController.validateSession,
    AuthController.loadSession
);

routes.get('/users/:id', AuthController.validateSession, UsersController.read);
routes.put(
    '/update-user',
    AuthController.validateSession,
    UsersController.update
);

export { routes };
