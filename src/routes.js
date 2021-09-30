import { Router } from 'express';

import AuthController from './controllers/AuthController.js';
import UsersController from './controllers/UsersController.js';
import PetsController from './controllers/PetsController.js';

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

routes.post('/register-user', UsersController.create);
routes.put(
    '/update-user',
    AuthController.validateSession,
    UsersController.update
);
routes.post('/delete-user', 
    //AuthController.validateSession, 
    UsersController.delete
);

//pets
routes.post('/register-pet', PetsController.create);

routes.put('/update-pet', PetsController.update);

routes.post('/delete-pet', PetsController.delete);

routes.get('/show-user-pets', PetsController.showPets);

routes.get('/search-pets-by', PetsController.searchBy);

routes.get('/search-pet-info', PetsController.searchPetInfo);

export { routes };
