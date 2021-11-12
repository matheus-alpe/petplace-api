import { createResponsibilityTerm, updateResponsibilityTerm, archiveTerms, updatePet } from '../db.js';

export default {
    
    async create(req,res){
        if(res.statusCode == 200){
            try {
                const { responsibilityTerm } = req.body;
                responsibilityTerm.id = new Date().toISOString().replace(/[^\w\s]/gi, '');

                await createResponsibilityTerm(responsibilityTerm);
                res.status(200).send({ responsibilityTerm });
            } catch (error) {
                res.status(404).send({ error });
            }
        }
    },

    async update(req,res){
        if(res.statusCode == 200){
            try {
                const { responsibilityTerm } = req.body;

                await updateResponsibilityTerm(responsibilityTerm);
                if (responsibilityTerm.status === 'aprovado') {
                    await archiveTerms(responsibilityTerm);

                    const pet = Object.assign({}, responsibilityTerm.petInfo);
                    const pastOwnerId = pet.user_id;
                    pet.adoptable = 0;
                    pet.adopted = 1;
                    pet.user_id = responsibilityTerm.info.id;
                    pet.past_owners_id = pastOwnerId;
                    if (pet.birthday) {
                        pet.birthday = pet.birthday.split('T')[0]
                    }
                    
                    console.log(pet);
                    await updatePet(pet);
                }

                res.status(200).send({ ok: true, responsibilityTerm });
            } catch (error) {
                res.status(404).send({ error });
            }
        }        
    },

    async archive(req,res){
        if(res.statusCode == 200){
            try {
                const { responsibilityTerm } = req.body;

                await archiveTerms(responsibilityTerm);
                res.status(200).send({ ok: true });
            } catch (error) {
                res.status(404).send({ error });
            }
        }
    },
    
}