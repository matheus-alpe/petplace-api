import JWT from 'jsonwebtoken';
import { authenticateUser, getPetsByProperty, getUserByProperty } from '../db.js';

const SECRET = 'TEST';

export default {
    async authenticate(req, res) {
        const { email, password } = req.body;

        let result = await authenticateUser(email, password);

        if (!result)
            return res
                .status(403)
                .send({ message: 'E-mail ou Senha incorreto.' });

        const user = { ...result };

        const token = JWT.sign(user, SECRET, {
            expiresIn: 7200,
        });

        res.status(200).send({
            message: 'Login efetuado com sucesso',
            token,
            user,
        });

        return;
    },

    validateSession(req, res, next) {
        const token = req.headers.authorization
            ? req.headers.authorization.split(' ')[1]
            : null;

        if (!token) {
            res.status(401).send({
                message: 'Sua sessão é inválida.',
            });
            return;
        }

        JWT.verify(token, SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send({
                    message: 'Sua sessão está expirada.'
                });
            }

            req.data = decoded;

            next();
        });
    },

    loadSession(req, res) {
        const token = req.headers.authorization.split(' ')[1];

        JWT.verify(token, SECRET, async (err, decoded) => {
            try {
                if (err) {
                    return res.status(401).send({
                        message: 'Sua sessão é inválida ou está expirada',
                    });
                }
    
                const tempUser = await getUserByProperty(decoded.id, 'id');
                if (!tempUser) {
                    return res.status(401).send({
                        message: 'Sua sessão é inválida ou está expirada',
                    });
                }

                const pets = await getPetsByProperty(tempUser.id, 'user_id') || [];

                res.status(200).send({
                    token,
                    user: { ...tempUser },
                    pets
                });
            } catch (error) {
                res.status(401).send({
                    message: 'Sua sessão é inválida ou está expirada',
                });
            }
        });
    },
};
