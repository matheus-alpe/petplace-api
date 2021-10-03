import { readFileSync, writeFileSync} from 'fs';
import { createResponsibilityTerm, getPetsByProperty, getUserByProperty } from '../db.js';

const path = new URL('../../__mocks__/pets.json', import.meta.url);


function validateInputs(responsibilityTerm){
    return new Promise(async function(resolve){
        let erros = {};
        console.log(responsibilityTerm);
        let tempUser = await getUserByProperty(responsibilityTerm.donator_cpf, 'cpf');
        if (!tempUser) {
            erros['donator_cpf'] = 'cpf do doador não existe';
        } 

console.log(erros);
console.log(tempUser);
        tempUser = await getUserByProperty(responsibilityTerm.adopter_cpf, 'cpf');
        if (!tempUser) {
            erros['adopter_cpf'] = 'cpf do adotador não existe';
        }

console.log(tempUser);
        let tempPet = await getPetsByProperty(responsibilityTerm.pet_id, 'id');
        if (!tempPet) {
            erros['pet_id'] = 'id do pet não existe';
        }

console.log(tempPet);
        if (erros.donator_cpf || erros.adopter_cpf || erros.pet_id) resolve(erros);
        resolve();
    });
}

export default {
    
    async create(req,res){
        const { responsibilityTerm } = req.body;
        console.log(responsibilityTerm);
        responsibilityTerm.id = new Date().toISOString().replace(/[^\w\s]/gi, '');

        const erros = await validateInputs(responsibilityTerm);
        console.log(erros);
        if(erros) return res.status(403).send({erros});


        await createResponsibilityTerm(responsibilityTerm);
        res.status(200).send({ responsibilityTerm });
    },

    
}