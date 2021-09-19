import { create } from 'domain';
import { readFileSync, writeFileSync} from 'fs';
import { setNewPet, getPetByProperty, updatePet, deletePet } from '../db.js';

const path = new URL('../../__mocks__/pets.json', import.meta.url);

function getPets(){
    return JSON.parse(readFileSync(path));
}

function findPetByProperty(value, property) {
    return getPets().find((pet) => pet[property] === value);
}

export default {
    read(req, res){
        const pet=findPetByProperty(req.params.id, 'id');
        res.status(200).send({data: pet});
    },

    async create(req,res){
        const { pet } = req.body;

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
    }
}




