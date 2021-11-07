import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql';

/**
 * Steps to setup database:
 * 1. Create a database called 'petplace' on your MySQL server.
 * 2. On the same level as package.json, create a file called '.env'
 * 3. In this file '.env' create two variables:
 *      DB_USER=<your-user-on-mysql>
 *      DB_PASS=<password-to-your-user>
 *      (Note: Each variables in his own line)
 * 4. After all this steps you can run the project.
 */
const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: 'petplace'
});

/**
 * Create tables if they not exist for the first time it runs.
 */
pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(`CREATE TABLE IF NOT EXISTS users (
        id varchar(255) not null primary key,
        name varchar(255) not null,
        email varchar(255) not null,
        password varchar(255) not null,
        avatar_url varchar(255) not null,
        cpf varchar(255),
        cnpj varchar(255),
        cellphone varchar(255) not null,
        telephone varchar(255),
        cep varchar(255) not null,
        birthday date,
        foundation date
        
    );`)

    connection.query(`CREATE TABLE IF NOT EXISTS pets (
        id varchar(255) not null primary key,
        avatar_url varchar(255) not null,
        name varchar(255) not null,
        age tinyint,
        sex varchar(1) not null,
        breed varchar(255) not null,
        type varchar(255) not null,
        size varchar(255),
        adoptable boolean not null, 
        adopted boolean not null,
        birthday date,
        user_id varchar(255) not null,
        constraint fk_user_id foreign key (user_id) references users (id) on delete cascade,
        past_owners_id varchar(255)
    );`)

    connection.query(`CREATE TABLE IF NOT EXISTS vetHistory (
        id varchar(255) not null primary key,
        pet_id varchar(255) not null,
        date DATE not null,
        description varchar(4000) not null,
        constraint fk_pet_id foreign key (pet_id) references pets (id) ON DELETE CASCADE
    );`)
    connection.query(`CREATE TABLE IF NOT EXISTS responsibilityTerm (
        id varchar(255) not null primary key,
        donator_identifier varchar(255),
        adopter_identifier varchar(255),      
        pet_id varchar(255) not null,
        status varchar(255) not null,
        constraint fk_pet_idT foreign key (pet_id) references pets (id) ON DELETE CASCADE
    );`)
})

export function getUserByProperty(value, property) {
    return new Promise(function (resolve) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            const query = `SELECT * FROM users WHERE ${property} = '${value}';`
            
            connection.query(query, (err, rows) => {
                connection.release();
                if (err) return;
                
                resolve(rows && rows[0]);
            });
        });
    });
}

export function getPropertyFromUser(property, id) {
    return new Promise(function(resolve,reject){
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(`SELECT ${property} FROM users WHERE id = '${id}'`, (err,rows) => {
                connection.release();
                if(err) reject(err);

                resolve(rows[0]);
            });
        });
    });
}

export function authenticateUser(email, password) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
    
            connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, rows) => {
                connection.release();
                if (err) reject(err);
                
                resolve(rows[0]);
            });
    
        });
    });
}

export function setNewUser(user) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            const { cpf,cnpj,telephone } = user;
            if(!cpf && !cnpj) throw err; //verifying if cpf or cnpj were inserted, if they were'nt error message will popup
            if(!cpf){ //checks which of cpf and cnpj was inserted
                if(telephone) {
                    connection.query(`INSERT INTO users (id, name, email, password, avatar_url, cnpj, cellphone, telephone, cep, foundation) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.avatar_url}', '${user.cnpj}', '${user.cellphone}', '${user.telephone}', '${user.cep}', '${user.foundation}')`, (err, rows) => {
                        connection.release();
                        if (err) reject(err);
                        
                        resolve(true);
                    });
                }else{
                    connection.query(`INSERT INTO users (id, name, email, password, avatar_url, cnpj, cellphone, cep, foundation) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.avatar_url}', '${user.cnpj}', '${user.cellphone}', '${user.cep}', '${user.foundation}')`, (err, rows) => {
                        connection.release();
                        if (err) reject(err);
                        
                        resolve(true);
                    });
                };                    
            }else{
                if(telephone){
                    connection.query(`INSERT INTO users (id, name, email, password, avatar_url, cpf, cellphone, telephone, cep, birthday) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.avatar_url}', '${user.cpf}', '${user.cellphone}', '${user.telephone}', '${user.cep}', '${user.birthday}')`, (err, rows) => {
                        connection.release();
                        if (err) reject(err);
                        
                        resolve(true);
                    }); 
                }else{
                    connection.query(`INSERT INTO users (id, name, email, password, avatar_url, cpf, cellphone, cep, birthday) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.avatar_url}', '${user.cpf}', '${user.cellphone}', '${user.cep}', '${user.birthday}')`, (err, rows) => {
                        connection.release();
                        if (err) reject(err);
                        
                        resolve(true);
                    }); 
                }
                
            };            
        });
    });
}

export function updateUser(user) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            if(user.cpf){ //checks if user is a institution or normal person
                if(user.telephone){
                    connection.query(`UPDATE users SET name = '${user.name}', email = '${user.email}', password = '${user.password}', avatar_url = '${user.avatar_url}', cellphone = '${user.cellphone}', telephone = '${user.telephone}', cep = '${user.cep}', birthday = '${user.birthday}' WHERE id = '${user.id}';`, (err, rows) => {
                        connection.release();
                        if (err) reject(err);
    
                        resolve(true);
                    });
                }else{
                    connection.query(`UPDATE users SET name = '${user.name}', email = '${user.email}', password = '${user.password}', avatar_url = '${user.avatar_url}', cellphone = '${user.cellphone}', cep = '${user.cep}', birthday = '${user.birthday}' WHERE id = '${user.id}';`, (err, rows) => {
                        connection.release();
                        if (err) reject(err);
    
                        resolve(true);
                    });
                }
                
            }else{
                if(user.telephone){
                    connection.query(`UPDATE users SET name = '${user.name}', email = '${user.email}', password = '${user.password}', avatar_url = '${user.avatar_url}', cellphone = '${user.cellphone}', telephone = '${user.telephone}', cep = '${user.cep}', foundation = '${user.foundation}' WHERE id = '${user.id}';`, (err, rows) => {
                        connection.release();
                        if (err) reject(err);
    
                        resolve(true);
                    });
                }else{
                    connection.query(`UPDATE users SET name = '${user.name}', email = '${user.email}', password = '${user.password}', avatar_url = '${user.avatar_url}', cellphone = '${user.cellphone}', cep = '${user.cep}', foundation = '${user.foundation}' WHERE id = '${user.id}';`, (err, rows) => {
                        connection.release();
                        if (err) reject(err);
    
                        resolve(true);
                    });
                }
                
            }
        });
    });
}

export function deleteUser({ id }) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {

            connection.query('DELETE FROM users WHERE id = ?', [id], (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}

function variablesFixPets(pet){
    let { age, sex } = pet;
    if(age){
        let petAge =JSON.stringify(age);
        petAge = petAge.charAt(1);
        pet.age= parseInt(petAge);
    }
    
    
    let petSex =JSON.stringify(sex);
    petSex = petSex.charAt(1);
    pet.sex= petSex;

    if(pet.adoptable) pet.adoptable=1;
    else pet.adoptable=0;
    if(pet.adopted) pet.adopted=1;
    else pet.adopted=0; 
    return (pet);
}

export function checkIfColumn(value){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection) => {
            if (err) throw err;

            connection.query(`SELECT DISTINCT column_name FROM information_schema.columns WHERE table_name = N'pets' AND column_name = '${value}'`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(rows[0]);
            });
        });
    });
}


export function setNewPet(pet){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) => {
            if(err) throw err;
            pet = variablesFixPets(pet);
            if(pet.age && pet.birthday){
                connection.query(`INSERT INTO pets (id, avatar_url, name, age, sex, breed, type, size, adoptable, adopted, birthday, user_id) VALUES ('${pet.id}', '${pet.avatar_url}', '${pet.name}', '${pet.age}', '${pet.sex}', '${pet.breed}', '${pet.type}', '${pet.size}', '${pet.adoptable}', '${pet.adopted}', '${pet.birthday}', '${pet.user_id}')`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(true);
                });
                return
            } else if (!pet.age && !pet.birthday){
                connection.query(`INSERT INTO pets (id, avatar_url, name, sex, breed, type, size, adoptable, adopted, user_id) VALUES ('${pet.id}', '${pet.avatar_url}', '${pet.name}', '${pet.sex}', '${pet.breed}', '${pet.type}', '${pet.size}', '${pet.adoptable}', '${pet.adopted}', '${pet.user_id}')`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(true);
                });
                return
            } else if (!pet.age){
                connection.query(`INSERT INTO pets (id, avatar_url, name, sex, breed, type, size, adoptable, adopted, birthday, user_id) VALUES ('${pet.id}', '${pet.avatar_url}', '${pet.name}', '${pet.sex}', '${pet.breed}', '${pet.type}', '${pet.size}', '${pet.adoptable}', '${pet.adopted}', '${pet.birthday}', '${pet.user_id}')`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(true);
                });
                return
            } else {
                connection.query(`INSERT INTO pets (id, avatar_url, name, age, sex, breed, type, size, adoptable, adopted, user_id) VALUES ('${pet.id}', '${pet.avatar_url}', '${pet.name}', '${pet.age}', '${pet.sex}', '${pet.breed}', '${pet.type}', '${pet.size}', '${pet.adoptable}', '${pet.adopted}', '${pet.user_id}')`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(true);
                });
                return
            }   
        });
    });
}

export function updatePet(pet) { 
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            pet = variablesFixPets(pet);

            if(pet.age && pet.birthday){
                connection.query(`UPDATE pets SET avatar_url='${pet.avatar_url}', name = '${pet.name}', age = '${pet.age}', sex = '${pet.sex}', breed = '${pet.breed}', type = '${pet.type}', size = '${pet.size}', adoptable = '${pet.adoptable}', adopted = '${pet.adopted}', birthday = '${pet.birthday}' WHERE id = '${pet.id}';`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(true);
                });
            }
            if (!pet.age && !pet.birthday){
                connection.query(`UPDATE pets SET avatar_url='${pet.avatar_url}', name = '${pet.name}', sex = '${pet.sex}', breed = '${pet.breed}', type = '${pet.type}', size = '${pet.size}', adoptable = '${pet.adoptable}', adopted = '${pet.adopted}' WHERE id = '${pet.id}';`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(true);
                });
            }else if(!pet.age){
                connection.query(`UPDATE pets SET avatar_url='${pet.avatar_url}', name = '${pet.name}', sex = '${pet.sex}', breed = '${pet.breed}', type = '${pet.type}', size = '${pet.size}', adoptable = '${pet.adoptable}', adopted = '${pet.adopted}', birthday = '${pet.birthday}' WHERE id = '${pet.id}';`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(true);
                });
            }else{
                connection.query(`UPDATE pets SET avatar_url='${pet.avatar_url}', name = '${pet.name}', age = '${pet.age}', sex = '${pet.sex}', breed = '${pet.breed}', type = '${pet.type}', size = '${pet.size}', adoptable = '${pet.adoptable}', adopted = '${pet.adopted}' WHERE id = '${pet.id}';`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(true);
                });
            }
        });
    });
}

export function deletePet({ id }) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
    
            connection.query('DELETE FROM pets WHERE id = ?', [id], (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}

export function showUserPets({ id }){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) =>{
            if(err) throw err;
            connection.query(`SELECT * FROM pets WHERE user_id = '${id}'`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(rows);
            });
        });
    });
}

export function getPetsByProperty(value, property){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection) => {
            if (err) throw err;

            if (value == false) value=0;
            if (value == true) value=1;
            
            connection.query(`SELECT * FROM pets WHERE ${property} = '${value}'`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(rows && rows);
            });
        });
    });
}

export function getPropertyFromPet(id){
    return new Promise(function(resolve,reject){
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(`SELECT * FROM pets WHERE id = '${id}'`, (err,rows) => {
                connection.release();
                if(err) reject(err);

                resolve(rows[0]);
            });
        });
    });
}



//Responsability Term / Donation
export function createResponsibilityTerm(responsibilityTerm){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection)=> {
            if(err) throw err;
            connection.query(`INSERT INTO responsibilityTerm (id, donator_identifier, adopter_identifier, pet_id, status) VALUES ('${responsibilityTerm.id}', '${responsibilityTerm.donator_identifier}', '${responsibilityTerm.adopter_identifier}', '${responsibilityTerm.pet_id}', '${responsibilityTerm.status}')`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(true);
            });
        });
    });
}

export function checkPetOwner(responsibilityTerm){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection)=> {
            if(err) throw err;
            connection.query(`SELECT * FROM pets WHERE id = '${responsibilityTerm.pet_id}' AND user_id = (SELECT id FROM users WHERE cpf = ${responsibilityTerm.donator_identifier} or cnpj = ${responsibilityTerm.donator_identifier})`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(rows[0]);
            });
        });
    });
}

export function changeOwners(pet_id, adopter, donator){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection)=> {
            if(err) throw err;

            connection.query(`UPDATE pets SET user_id='${adopter.id}', past_owners_id = '${donator.id}' WHERE id = '${pet_id}'`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}

export function updateResponsibilityTerm(responsibilityTerm){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection)=> {
            if(err) throw err;
            connection.query(`UPDATE responsibilityTerm SET donator_identifier = '${responsibilityTerm.donator_identifier}', adopter_identifier = '${responsibilityTerm.adopter_identifier}', pet_id = '${responsibilityTerm.pet_id}', status = '${responsibilityTerm.status}' WHERE id = '${responsibilityTerm.id}'`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(true);
            });
        });
    });
}

export function checkTermID(value){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection)=> {
            if(err) throw err;
            connection.query(`SELECT * FROM responsibilityTerm WHERE id = '${value}'`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(rows[0]);
            });
        });
    });
}

// veterinary history
export function createVetHistory(vetHistory){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection)=> {
            if(err) throw err;
            connection.query(`INSERT INTO vetHistory (id, pet_id, date, description) VALUES ('${vetHistory.id}', '${vetHistory.pet_id}', '${vetHistory.date}', '${vetHistory.description}')`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(true);
            });
        });
    });
}

export function updateVetHistory(vetHistory) { 
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(`UPDATE vetHistory SET description='${vetHistory.description}', date='${vetHistory.date}' WHERE id = '${vetHistory.id}';`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
            
        });
    });
}

export function getVetHistoryByProperty(value, property){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection) => {
            if (err) throw err;
            
            connection.query(`SELECT * FROM vetHistory WHERE ${property} = '${value}'`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(rows[0]);
            });
        });
    });
}

export function showPetVetHistory(value){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) =>{
            if(err) throw err;
            connection.query(`SELECT * FROM vetHistory WHERE pet_id = '${value.id}'`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(rows);
            });
        });
    });
}

export function deleteVetHistory({id}){
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
    
            connection.query('DELETE FROM vetHistory WHERE id = ?', [id], (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}


export function showAllUserInfo(user){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) =>{
            if(err) throw err;
            if(user.cpf){
                connection.query(`SELECT users.id as user_id , users.name as user_name, users.email, users.password, users.avatar_url as user_avatar, users.cpf, users.cellphone, users.telephone, users.cep, users.birthday as user_birthday, pets.id as pet_id, pets.avatar_url as pet_avatar, pets.name as pet_name, pets.age, pets.sex, pets.breed, pets.type, pets.size, pets.adoptable, pets.adopted, pets.birthday as pet_birthday, vethistory.id as vethistory_id, vethistory.date, vethistory.description from pets inner join vethistory on pets.id=vethistory.pet_id inner join users on pets.user_id= users.id where users.id = '${user.id}';`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(rows);
                });
            }else{
                connection.query(`SELECT users.id as user_id , users.name as user_name, users.email, users.password, users.avatar_url as user_avatar, users.cnpj, users.cellphone, users.telephone, users.cep, users.foundation as user_foundation, pets.id as pet_id, pets.avatar_url as pet_avatar, pets.name as pet_name, pets.age, pets.sex, pets.breed, pets.type, pets.size, pets.adoptable, pets.adopted, pets.birthday as pet_birthday, vethistory.id as vethistory_id, vethistory.date, vethistory.description from pets inner join vethistory on pets.id=vethistory.pet_id inner join users on pets.user_id= users.id where users.id = '${user.id}';`, (err,rows) => {
                    connection.release();
                    if (err) reject(err);

                    resolve(rows);
                });
            }
            
        });
    });
}

export function showAllPetsFromUser(user){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) =>{
            if(err) throw err;
            connection.query(`SELECT pets.id, pets.avatar_url, pets.name, pets.age, pets.sex, pets.breed, pets.type, pets.size, pets.adoptable, pets.adopted, pets.birthday as pet_birthday, vethistory.id as vethistory_id, vethistory.date, vethistory.description from pets inner join vethistory on pets.id=vethistory.pet_id inner join users on pets.user_id= users.id where users.id = '${user.id}';`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(rows);
            });
            
        });
    });
}

export function showAllVetHistoryFromUserPets(user){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) =>{
            if(err) throw err;

            connection.query(`SELECT vethistory.pet_id, vethistory.id as vethistory_id, vethistory.date, vethistory.description from pets inner join vethistory on pets.id=vethistory.pet_id inner join users on pets.user_id= users.id where users.id = '${user.id}';`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(rows);
            });
        });
    });
}

export function showAllTermsFromUser(user){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) =>{
            if(err) throw err;
            const identifier = user.cpf || user.cnpj;

            if (!identifier) throw err;
            connection.query(`select * from responsibilityTerm where responsibilityTerm.donator_identifier = "${identifier}" OR responsibilityTerm.adopter_identifier = "${identifier}";`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(rows);
            });
        });
    });
}

export function archiveTerms(selectedTerm) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(`UPDATE responsibilityTerm SET status="arquivado" WHERE pet_id = "${selectedTerm.pet_id}" AND id != "${selectedTerm.id}";`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
            
        });
    });
}