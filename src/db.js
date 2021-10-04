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
    user: 'root',
    password: 'Melves',
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
        cpf int,
        cnpj int,
        cellphone int not null,
        telephone int,
        cep int not null,
        birthday date,
        foundation date
        
    );`)
//adoptable and adopted as varchar(3) as they should only accept 'sim' and 'não'
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
        constraint fk_pet_id foreign key (pet_id) references pets (id)
    );`)

    connection.query(`CREATE TABLE IF NOT EXISTS responsibilityTerm (
        id varchar(255) not null primary key,
        donator_cpf varchar(255) not null,
        adopter_cpf varchar(255) not null,        
        pet_id varchar(255) not null,
        constraint fk_pet_idT foreign key (pet_id) references users (id)
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
    
    let petAge =JSON.stringify(age);
    petAge = petAge.charAt(1);
    pet.age=petAge;
    
    let petSex =JSON.stringify(sex);
    petSex = petSex.charAt(1);
    pet.sex= petSex;

    if(pet.adoptable) pet.adoptable=1;
    else pet.adoptable=0;
    if(pet.adopted) pet.adopted=1;
    else pet.adopted=0; 
    return (pet);
}

export function setNewPet(pet){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) => {
            if(err) throw err;
            pet = variablesFixPets(pet);

            connection.query(`INSERT INTO pets (id, avatar_url, name, age, sex, breed, type, size, adoptable, adopted, birthday, user_id) VALUES ('${pet.id}', '${pet.avatar_url}', '${pet.name}', '${pet.age}', '${pet.sex}', '${pet.breed}', '${pet.type}', '${pet.size}', '${pet.adoptable}', '${pet.adopted}', '${pet.birthday}', '${pet.user_id}')`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}

export function updatePet(pet) { 
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            pet = variablesFixPets(pet);

            connection.query(`UPDATE pets SET avatar_url='${pet.avatar_url}', name = '${pet.name}', age = '${pet.age}', sex = '${pet.sex}', breed = '${pet.breed}', type = '${pet.type}', size = '${pet.size}', adoptable = '${pet.adoptable}', adopted = '${pet.adopted}', birthday = '${pet.birthday}' WHERE id = '${pet.id}';`, (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
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
                if(err) reject(err);
                resolve(rows);
            });
        });
    });
}

export function getPropertyFromPet(property, id){
    return new Promise(function(resolve,reject){
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(`SELECT ${property} FROM pets WHERE id = '${id}'`, (err,rows) => {
                if(err) reject(err);

                resolve(rows[0]);
            });
        });
    });
}



//Donation
export function createResponsibilityTerm(responsibilityTerm){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection)=> {
            if(err) throw err;
            console.log(responsibilityTerm);
            connection.query(`INSERT INTO responsibilityTerm (id, donator_cpf, adopter_cpf, pet_id) VALUES ('${responsibilityTerm.id}', '${responsibilityTerm.donator_cpf}', '${responsibilityTerm.adopter_cpf}', '${responsibilityTerm.pet_id}')`,(err, rows) => {
                connection.release();
                if(err) reject(err);

                resolve(true);
            });
        });
    });
}