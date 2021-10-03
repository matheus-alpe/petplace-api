import { readFileSync, writeFileSync} from 'fs';
import { createResponsabiltyTerm, getPetsByProperty, getUserByProperty } from '../db.js';

const path = new URL('../../__mocks__/pets.json', import.meta.url);


function validateInputs(responsabilityTerm){
    return new Promise(async function(resolve){
        let erros = {};
        console.log(responsabilityTerm);
        let tempUser = await getUserByProperty(responsabilityTerm.donator_id, 'id');
        if (!tempUser) {
            erros['donator_id'] = 'id do doador não existe';
        } 

console.log(erros);
console.log(tempUser);
        tempUser = await getUserByProperty(responsabilityTerm.adopter_id, 'id');
        if (!tempUser) {
            erros['adopter_id'] = 'id do adotador não existe';
        }

console.log(tempUser);
        let tempPet = await getPetsByProperty(responsabilityTerm.pet_id, 'id');
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
        const { responsabilityTerm } = req.body;
        
        responsabilityTerm.id = new Date().toISOString().replace(/[^\w\s]/gi, '');

        const erros = await validateInputs(responsabilityTerm);
        console.log(erros);
        if(erros) return res.status(403).send({erros});


        await createResponsabiltyTerm(responsabilityTerm);
        res.status(200).send({ responsabilityTerm });
    },

    
}