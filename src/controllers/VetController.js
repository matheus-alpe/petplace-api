import { getPetsByProperty, createVetHistory, updateVetHistory, deleteVetHistory, getVetHistoryByProperty, showPetVetHistory } from '../db.js';

const path = new URL('../../__mocks__/pets.json', import.meta.url);


function validateInputs(value){
    return new Promise(async function(resolve){
        let erros = {};
        let tempPet;
        
        if(value.pet_id){ //checks if the object passed was a vetHistory or a pet object
            tempPet = await getPetsByProperty(value.pet_id, 'id');
        }else{
            tempPet = await getPetsByProperty(value.id,'id'); 
        } 

        if (!tempPet) {
            erros['pet_id'] = 'id do pet não existe';
        }
        if (erros.pet_id){
            resolve(erros);
        }        

        resolve();
    });
}

function validateID(vetHistory){
    return new Promise(async function(resolve){
        let erros = {};

        let tempVetHistory = await getVetHistoryByProperty(vetHistory.id,'id');
        if (!tempVetHistory){
            erros['id'] = 'id do histórico veterinário não existe';
        }
        if(erros.id) resolve(erros);

        resolve();
    });
}

export default {
    
    async create(req,res){
        if(res.statusCode == 200){

            const { vetHistory } = req.body;
            vetHistory.id = new Date().toISOString().replace(/[^\w\s]/gi, '');

            const erros = await validateInputs(vetHistory);
            if(erros) return res.status(403).send({erros});


            await createVetHistory(vetHistory);
            res.status(200).send({ vetHistory });
        }
    },

    async update(req,res){
        if(res.statusCode == 200){
            const { vetHistory } = req.body;

            const erros = await validateID(vetHistory);
            if(erros) return res.status(403).send({erros});


            await updateVetHistory(vetHistory);
            res.status(200).send({ ok: true });
        }
    },

    async delete(req,res){
        if(res.statusCode == 200){
            const{ vetHistory } = req.body;

            const erros = await validateID(vetHistory);
            if(erros) return res.status(403).send({erros});

            await deleteVetHistory(vetHistory);
            res.status(200).send({ ok: true });
        }
    },

    async showAllFromPet(req,res){
        if(res.statusCode == 200){
            const{ pet } = req.body;

            const erros = await validateInputs(pet);
            if(erros) return res.status(403).send({erros});

            let vetHistory = await showPetVetHistory(pet);
            res.status(200).send({ vetHistory });
        }
    }
    
}