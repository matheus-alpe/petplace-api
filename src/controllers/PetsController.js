import { readFileSync, writeFileSync} from 'fs';
import { setNewPet, getPetsByProperty, updatePet, deletePet, showUserPets, getPropertyFromPet, checkIfColumn } from '../db.js';

const path = new URL('../../__mocks__/pets.json', import.meta.url);

function getPets(){
    return JSON.parse(readFileSync(path));
}

function findPetByProperty(value, property) {
    return getPets().find((pet) => pet[property] === value);
}

function validateIfColumn(value){
    return new Promise(async function(resolve){
        let erros = {};
        let tempAux = await checkIfColumn(value);
        if(!tempAux){
            erros['coluna_inexistente'] = 'Nome da coluna passada como parâmetro não existe no banco de dados';
        }

        if(erros.coluna_inexistente){
            resolve(erros);
        }
        resolve();
    });
}

export default {
    read(req, res){
        const pet=findPetByProperty(req.params.id, 'id');
        res.status(200).send({data: pet});
    },

    async create(req,res){
        const { pet } = req.body;

        pet.id = new Date().toISOString().replace(/[^\w\s]/gi, '');

        await setNewPet(pet);
        res.status(200).send({ ok: true });
    },

    async update(req,res){
        const { pet } = req.body;

        if(!pet.id) return res.status(404);

        await updatePet(pet);
        res.status(200).send({ pet });
    },

    async delete(req,res) {
        const { pet } = req.body;

        if(!pet.id) return res.status(404);

        await deletePet(pet);
        res.status(200).send({ ok: true });
    },



    async showPets(req,res){
        const { user } = req.body;

        let TempList = await showUserPets(user);
        res.status(200).send({ TempList });
    },

    async searchBy(req,res){
        const { property, value } = req.body;

        const erros = await validateIfColumn(property);
        console.log(erros);
        if (erros){
            res.status(403).send({ erros });
        }else{
            let TempList = await getPetsByProperty(property, value);
            res.status(200).send({ TempList });
        }
        
    },

    async searchPetInfo(req,res){
        const { property, id } = req.body;

        const erros = await validateIfColumn(property);
        console.log(erros);
        if (erros){
            res.status(403).send({ erros });
        }else{
            const response = await getPropertyFromPet(property,id);
            res.status(200).send({ response });
        }        
    },
}




