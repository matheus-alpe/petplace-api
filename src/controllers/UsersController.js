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
        
        tempUser = await getUserByProperty(user.cnpj, 'cnpj')
        if (tempUser && tempUser.cnpj) {
            erros['cnpj'] = 'já cadastrado.';
        }
        
        tempUser = await getUserByProperty(user.cpf, 'cpf')
        if (tempUser && tempUser.cpf) {
            erros['cpf'] = 'já cadastrado.';
        }
        
        if (erros.email || erros.cpf || erros.cnpj) {
            resolve(erros);
        };
        resolve();
    });
}

function validateID({id}){
    return new Promise(async function (resolve) {
        let erros = {};
        
        let tempUser = getUserByProperty (id,'id');
        if(!tempUser || !id) {
            erros['id'] = 'User id não existe ou é inválida';
            resolve(erros);
        }
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
        if(user.cpf) user.cpf = user.cpf.replace(/[^\w\s]/gi, '')
        if(user.cnpj) user.cnpj = user.cnpj.replace(/[^\w\s]/gi, '')
        if(user.cep) user.cep = user.cep.replace(/[^\w\s]/gi, '')
        if(user.cellphone) user.cellphone = user.cellphone.replace(/[^\w\s]/gi, '')
        if(user.telephone) user.telephone = user.telephone.replace(/[^\w\s]/gi, '')

        const erros = await validateInputs(user);
        if (erros) {
            return res.status(403).send({ erros });
        }

        await setNewUser(user);
        res.status(200).send({ ok: true });
    },

    async update(req, res) {
        if(res.statusCode == 200){
            const { user } = req.body;

            const erros = await validateID(user);
            if(erros) res.status(404).send({erros});
            else{
                delete user.iat;
                delete user.exp;

                await updateUser(user);
                res.status(200).send({ user });
            }
        }
        
    },

    async delete(req, res) {
        if(res.statusCode == 200){
            const { user } = req.body;

            const erros = await validateID(user);
            if(erros) res.status(404).send({erros});
            else{
                await deleteUser(user);
                res.status(200).send({ ok: true });
            }
        }
    },

    async findUser(req, res) {
        if(res.statusCode == 200){
            const { id } = req.body;

            const userResult = await getUserByProperty(id, 'id');
            if (!userResult) {
                res.status(404).send({ message: 'user não encontrado' });
            } else {
                delete userResult.password;
                res.status(200).send({ ok: true, userInfo: userResult });
            }
        }
    }
};
