import { Router } from 'express';

import AuthController from './controllers/AuthController.js';
import UsersController from './controllers/UsersController.js';
import PetsController from './controllers/PetsController.js';
import TermsController from './controllers/TermsController.js';
import VetController from './controllers/VetController.js';

const routes = Router();

routes.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to PetPlace API 🌻' });
});

routes.post('/login', AuthController.authenticate);
routes.get('/load-session', AuthController.validateSession, AuthController.loadSession);

routes.post('/register-user', UsersController.create);
routes.put('/update-user', AuthController.validateSession, UsersController.update);
routes.post('/delete-user', AuthController.validateSession, UsersController.delete);

//pets
routes.post('/register-pet', AuthController.validateSession, PetsController.create);

routes.put('/update-pet', AuthController.validateSession, PetsController.update);

routes.post('/delete-pet', AuthController.validateSession, PetsController.delete);

routes.get('/show-user-pets', AuthController.validateSession, PetsController.showPets);

routes.get('/search-pets-by', AuthController.validateSession, PetsController.searchBy);

routes.get('/search-pet-info', AuthController.validateSession, PetsController.searchPetInfo);


//donation process
routes.post('/create-term', AuthController.validateSession, TermsController.create);

routes.put('/change-owners', AuthController.validateSession, TermsController.exchange);

//veterinary history
routes.post('/create-vetHistory', AuthController.validateSession, VetController.create);

routes.put('/update-vetHistory', AuthController.validateSession, VetController.update);

routes.post('/delete-vetHistory', AuthController.validateSession, VetController.delete);

routes.get('/show-pet-vetHistory', AuthController.validateSession, VetController.showAllFromPet);

export { routes };
