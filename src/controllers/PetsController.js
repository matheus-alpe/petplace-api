import { readFileSync, writeFileSync} from 'fs';
import { setNewPet, getPetsByProperty, updatePet, deletePet, showUserPets, getPropertyFromPet, checkIfColumn, getUserByProperty } from '../db.js';

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

function validateIDs(value, property){
    return new Promise(async function(resolve){
        let erros = {};
        let userExist = await getUserByProperty(value,property);
        if(!userExist){
            erros['user_id'] = 'id de usuário passada não existe';
        }

        if(erros.user_id){
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
        if(res.statusCode == 200){
            const { pet } = req.body;
            pet.id = new Date().toISOString().replace(/[^\w\s]/gi, '');
            
            const erros = await validateIDs(pet.user_id,'id');
            if (erros){
                res.status(404).send({ erros });
            }else{
                await setNewPet(pet);
                res.status(200).send({ pet });
            };
        };
    },

    async update(req,res){
        if(res.statusCode == 200){
            const { pet } = req.body;

            if(!pet.id) return res.status(404).send({message: "Id do pet não existe ou é incorreta"});
            else{
               await updatePet(pet);
                res.status(200).send({ pet }); 
            }
            
        };        
    },

    async delete(req,res) {
        if(res.statusCode == 200){
            const { pet } = req.body;

            if(!pet.id) return res.status(404).send({message: "Id do pet não existe ou é incorreta"});
            else{
                await deletePet(pet);
                res.status(200).send({ ok: true });
            }
            
        };
    },



    async showPets(req,res){
        if(res.statusCode == 200){

            const { user } = req.body;
            let pets = await showUserPets(user);
            res.status(200).send({ pets });
        }
    },

    async searchBy(req,res){
        if(res.statusCode == 200){

            const { property, value } = req.body;

            const erros = await validateIfColumn(property);
            if (erros){
                res.status(403).send({ erros });
            }else{
                let pets = await getPetsByProperty(value, property);
                res.status(200).send({ pets });
            }
        }
    },

    async searchPetInfo(req,res){
        if(res.statusCode == 200){
            try {
                const { id } = req.body;

                const response = await getPropertyFromPet(id);
                res.status(200).send({ pet: response });
            } catch (error) {
                res.status(403).send({ error });
            }
        }        
    },
}




