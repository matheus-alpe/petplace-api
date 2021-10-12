import { readFileSync, writeFileSync} from 'fs';
import { changeOwners, checkPetOwner, createResponsibilityTerm, getPetsByProperty, getPropertyFromPet, getPropertyFromUser, getUserByProperty } from '../db.js';

const path = new URL('../../__mocks__/pets.json', import.meta.url);


function validateInputs(responsibilityTerm){
    return new Promise(async function(resolve){
        let erros = {};
        let tempUser = await getUserByProperty(responsibilityTerm.donator_cpf, 'cpf');
        if (!tempUser) {
            erros['donator_cpf'] = 'cpf do doador não existe';
        } 

        tempUser = await getUserByProperty(responsibilityTerm.adopter_cpf, 'cpf');
        if (!tempUser) {
            erros['adopter_cpf'] = 'cpf do adotador não existe';
        }

        let tempPet = await getPetsByProperty(responsibilityTerm.pet_id, 'id');
        if (!tempPet) {
            erros['pet_id'] = 'id do pet não existe';
        }

        tempUser = await checkPetOwner(responsibilityTerm);
        if(!tempUser){
            erros['wrong_owner'] = 'pet não pertence ao dono de cpf passado';
        }

        if (erros.donator_cpf || erros.adopter_cpf || erros.pet_id || erros.wrong_owner){
            resolve(erros);
        }else{
            //transforming JSON to string and getting cpf from pet owner then comparing to adopter_cpf
            tempPet = await getPropertyFromPet('user_id', responsibilityTerm.pet_id);
            tempPet = JSON.stringify(tempPet);
            tempPet = tempPet.substring(12, tempPet.length-2 );
            tempUser = await getPropertyFromUser('cpf', tempPet);
            tempUser = JSON.stringify(tempUser);
            tempUser = tempUser.substring(7, tempUser.length-1 );
            if( tempUser == responsibilityTerm.adopter_cpf){
                erros['owner_is_adopter'] = 'pet pertence ao usuário do cpf que quer adotar';
            }
            if(erros.owner_is_adopter) resolve(erros);
        }
        

        resolve();
    });
}

function cpfToID(value){
    return new Promise(async function(resolve){
        let tempUser = await getUserByProperty(value,'cpf');

        resolve(tempUser);
    });
}

export default {
    
    async create(req,res){
        if(res.statusCode == 200){

            const { responsibilityTerm } = req.body;
            responsibilityTerm.id = new Date().toISOString().replace(/[^\w\s]/gi, '');

            const erros = await validateInputs(responsibilityTerm);
            if(erros) return res.status(403).send({erros});


            await createResponsibilityTerm(responsibilityTerm);
            res.status(200).send({ responsibilityTerm });
        }
    },

    async exchange(req,res){
        if(res.statusCode == 200){
            const { responsibilityTerm } = req.body;

            const erros = await validateInputs(responsibilityTerm);
            if(erros) return res.status(403).send({erros});

            let adopter = await cpfToID(responsibilityTerm.adopter_cpf); 
            let donator = await cpfToID(responsibilityTerm.donator_cpf);

            await changeOwners(responsibilityTerm.pet_id, adopter, donator);
            res.status(200).send({ ok: true });
        }
    }
    
}