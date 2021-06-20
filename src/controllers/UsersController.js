import { readFileSync, writeFileSync } from 'fs';

const path = new URL('../../__mocks__/users.json', import.meta.url);

function getUsers() {
    return JSON.parse(readFileSync(path));
}

function findUserByProperty(value, property) {
    return getUsers().find((user) => user[property] === value);
}

function valideInputs(user) {
    let erros = [];
    if (findUserByProperty(user.email, 'email')) {
        erros.push('Email já cadastrado.');
    }

    if (findUserByProperty(user.cpf, 'cpf')) {
        erros.push('CPF já cadastrado.');
    }

    return erros.length && erros;
}

export default {
    read(req, res) {
        const user = findUserByProperty(req.params.id, 'id');
        res.status(200).send({ data: user });
    },

    create(req, res) {
        const { user } = req.body;
        user.id = new Date().toISOString().replace(/[^\w\s]/gi, '')

        let erros = valideInputs(user);
        if (erros) {
            return res.status(403).send({ message: erros });
        }

        const users = getUsers();
        users.push(user)
        writeFileSync(path, JSON.stringify(users, null, 4));
    },

    update(req, res) {
        const { user } = req.body;

        const users = getUsers();
        const index = users.findIndex((u) => u.id === user.id);

        if (index === -1) {
            return res.status(418);
        }

        delete user.iat;
        delete user.exp;

        users.splice(index, 1, user);

        writeFileSync(path, JSON.stringify(users, null, 4));
        res.status(200).send({ user });
    },
};
