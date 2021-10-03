import { readFileSync, writeFileSync} from 'fs';
import { createResponsibilityTerm, getPetsByProperty, getUserByProperty } from '../db.js';

const path = new URL('../../__mocks__/pets.json', import.meta.url);


function validateInputs(responsibilityTerm){
    return new Promise(async function(resolve){
        let erros = {};
        console.log(responsibilityTerm);
        let tempUser = await getUserByProperty(responsibilityTerm.donator_id, 'id');
        if (!tempUser) {
            erros['donator_id'] = 'id do doador não existe';
        } 

console.log(erros);
console.log(tempUser);
        tempUser = await getUserByProperty(responsibilityTerm.adopter_id, 'id');
        if (!tempUser) {
            erros['adopter_id'] = 'id do adotador não existe';
        }

console.log(tempUser);
        let tempPet = await getPetsByProperty(responsibilityTerm.pet_id, 'id');
        if (!tempPet) {
            erros['pet_id'] = 'id do pet não existe';
        }

console.log(tempPet);
        if (erros.donator_id || erros.adopter_id || erros.pet_id) resolve(erros);
        resolve();
    });
}

export default {
    
    async create(req,res){
        const { responsibilityTerm } = req.body;
        
        responsibilityTerm.id = new Date().toISOString().replace(/[^\w\s]/gi, '');

        const erros = await validateInputs(responsibilityTerm);
        console.log(erros);
        if(erros) return res.status(403).send({erros});


        await createResponsibilityTerm(responsibilityTerm);
        res.status(200).send({ responsibilityTerm });
    },

    
}