import { readFileSync, writeFileSync } from 'fs';

const path = new URL('../../__mocks__/users.json', import.meta.url);

function getUsers() {
    return JSON.parse(readFileSync(path));
}

function findUserByProperty(value, property) {
    return getUsers().find((user) => user[property] === value);
}

function valideInputs(user) {
    let erros = {};
    let tempUser = findUserByProperty(user.email, 'email')
    if (tempUser && tempUser.email) {
        erros['email'] = 'já cadastrado.';
    }

    tempUser = findUserByProperty(user.cpf, 'cpf')
    if (tempUser && tempUser.cpf) {
        erros['cpf'] = 'já cadastrado.';
    }

    return (erros.email || erros.cpf) && erros;
}

export default {
    read(req, res) {
        const user = findUserByProperty(req.params.id, 'id');
        res.status(200).send({ data: user });
    },

    create(req, res) {
        const { user } = req.body;

        user.id = new Date().toISOString().replace(/[^\w\s]/gi, '')
        user.cpf.replace(/[^\w\s]/gi, '')
        delete user.confirmation

        let erros = valideInputs(user);
        if (erros) {
            return res.status(403).send({ erros });
        }

        const users = getUsers();
        users.push(user)
        writeFileSync(path, JSON.stringify(users, null, 4));
        res.status(200).send({ ok: true });
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

    delete(req, res) {
        const { user } = req.body;

        const users = getUsers();
        const index = users.findIndex((u) => u.id === user.id);

        if (index === -1) {
            return res.status(404);
        }

        users.splice(index, 1);

        writeFileSync(path, JSON.stringify(users, null, 4));
        res.status(200);
    }
};
