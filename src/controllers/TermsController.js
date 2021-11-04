import { createResponsibilityTerm, updateResponsibilityTerm, archiveTerms } from '../db.js';

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