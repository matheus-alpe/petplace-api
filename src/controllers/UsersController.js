import { readFileSync, writeFileSync } from 'fs';
import { deleteUser, getUserByProperty, setNewUser, updateUser } from '../db.js'

const path = new URL('../../__mocks__/users.json', import.meta.url);

function getUsers() {
    return JSON.parse(readFileSync(path));
}

function findUserByProperty(value, property) {
    return getUsers().find((user) => user[property] === value);
}

function validateInputs(user) {
    return new Promise(async function (resolve) {
        let erros = {};
        let tempUser = await getUserByProperty(user.email, 'email')

        if (tempUser && tempUser.email) {
            erros['email'] = 'já cadastrado.';
        }

        tempUser = await getUserByProperty(user.cpf, 'cpf')
        if (tempUser && tempUser.cpf) {
            erros['cpf'] = 'já cadastrado.';
        }

        if (erros.email || erros.cpf) {
            resolve(erros);
        };
        resolve();
    });
}

export default {
    read(req, res) {
        const user = findUserByProperty(req.params.id, 'id');
        res.status(200).send({ data: user });
    },

    async create(req, res) {
        const { user } = req.body;

        user.id = new Date().toISOString().replace(/[^\w\s]/gi, '')
        user.cpf = user.cpf.replace(/[^\w\s]/gi, '')
        delete user.confirmation

        const erros = await validateInputs(user);
        if (erros) {
            return res.status(403).send({ erros });
        }

        await setNewUser(user);
        res.status(200).send({ ok: true });
    },

    async update(req, res) {
        const { user } = req.body;

        if (!user.id) {
            return res.status(404);
        }

        delete user.iat;
        delete user.exp;

        await updateUser(user);
        res.status(200).send({ user });
    },

    async delete(req, res) {
        const { user } = req.body;

        if (!user.id) {
            return res.status(404);
        }

        await deleteUser(user);
        res.status(200).send({ ok: true });
    }
};
