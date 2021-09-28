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
        cpf varchar(255) ,
        cnpj varchar(255) ,
        cellphone varchar (255) not null,
        telephone varchar (255) ,
        cep varchar (255) not null,
        birthday date,
        foundation date
        
    );`)
//adoptable and adopted as varchar(3) as they should only accept 'sim' and 'não'
//add past_owners_id
    connection.query(`CREATE TABLE IF NOT EXISTS pets (
        id varchar(255) not null primary key,
        avatar_url varchar(255) not null,
        name varchar(255) not null,
        age date,
        sex varchar(255) not null,
        breed varchar(255) not null,
        type varchar(255) not null,
        adoptable varchar(3) not null, 
        adopted varchar (3) not null,
        birthday date,
        user_id varchar(255) not null,
        constraint fk_user_id foreign key (user_id) references users (id),
        past_owners_id varchar(255)
    );`)

    connection.query(`CREATE TABLE IF NOT EXISTS vetHistory (
        id varchar(255) not null primary key,
        pet_id varchar(255) not null,
        date DATE not null,
        description varchar(255) not null,
        constraint fk_pet_id foreign key (pet_id) references pets (id)
    );`)

    connection.query(`CREATE TABLE IF NOT EXISTS responsabilityTerm (
        id varchar(255) not null primary key,
        donator_id varchar(255) not null,
        adopter_id varchar(255) not null,        
        pet_id varchar(255) not null,
        constraint fk_donator_id foreign key (donator_id) references users (id),
        constraint fk_adopter_id foreign key (adopter_id) references users (id),
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
            const { cpf,cnpj } = user;
            if(!cpf && !cnpj) throw err; //verifying if cpf or cnpj were inserted, if they werent error message will popup
            if(!cpf){ //checks which of cpf and cnpj was inserted
                connection.query(`INSERT INTO users (id, name, email, password, avatar_url, cnpj, cellphone, telephone, cep, foundation) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.avatar_url}', '${user.cnpj}', '${user.cellphone}', '${user.telephone}', '${user.cep}', '${user.foundation}')`, (err, rows) => {
                    connection.release();
                    if (err) reject(err);
                    
                    resolve(true);
                });
            }else{
                connection.query(`INSERT INTO users (id, name, email, password, avatar_url, cpf, cellphone, telephone, cep, birthday) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.avatar_url}', '${user.cpf}', '${user.cellphone}', '${user.telephone}', '${user.cep}', '${user.birthday}')`, (err, rows) => {
                    connection.release();
                    if (err) reject(err);
                    
                    resolve(true);
                }); 
            };            
        });
    });
}

export function updateUser(user) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            if(userTest.cpf == null){ //checks if user is a institution or normal person
            connection.query(`UPDATE users SET name = '${user.name}', email = '${user.email}', password = '${user.password}', avatar_url = '${user.avatar_url}', cpf = '${user.cpf}', cellphone = '${user.cellphone}', telephone = '${user.telephone}', cep = '${user.cep}', birthday = '${user.birthday}' WHERE id = '${user.id}';`, (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        }else{
            connection.query(`UPDATE users SET name = '${user.name}', email = '${user.email}', password = '${user.password}', avatar_url = '${user.avatar_url}', cnpj = '${user.cnpj}', cellphone = '${user.cellphone}', telephone = '${user.telephone}', cep = '${user.cep}', foundation = '${user.foundation}' WHERE id = '${user.id}';`, (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        }
        });
    });
}

export function deleteUser(user) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
    
            connection.query('DELETE FROM users WHERE id = ?', [user.id], (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}

///*PETS
// TEM QUE REVER QUAIS VARIAVEIS SERÃO USADAS
// imagino que a inserção de vacinas e de fotos do pet será feita separada, por isso nao coloquei aqui
export function setNewPet(pet){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) => {
            if(err) throw err;
            
            connection.query(`INSERT INTO pets VALUES ('${pet.id}', '${pet.avatar_url}', '${pet.name}', '${pet.age}', '${pet.sex}', '${pet.breed}', '${pet.type}', '${pet.adoptable}', '${pet.adopted}', '${pet.birthday}', '${pet.user_id}')`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}

//CONFIRMAR QUAL VAI SER A CHAVE SECUNDÁRIA NA TABELA DE PETS
export function showYourPets(user){
    return new Promise(function(resolve, reject){
        pool.getConnection((err, connection) =>{
            if(err) throw err;
            connection.query(`SELECT * FROM pets WHERE user_id = ${user.id}`, (err,rows) => {
                connection.release();
                if (err) reject(err);

                resolve(rows);
            });
        });
    });
}

export function getPetByProperty(value, property){
    return new Promise(function(resolve,reject){
        pool.getConnection((err,connection) => {
            if (err) throw err;
            connection.query(`SELECT * FROM pets WHERE ${property} = '${value}'`,(err, rows) => {
                if(err) reject(err);

                resolve(true);
            });
        });
    });
}
//value esperado para ser a ID do pet
//pensei em usar para pegar imagens ou vacinas
export function getPropertyFromPet(property, value){
    return new Promise(function(resolve,reject){
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query(`SELECT ${property} FROM pets WHERE id = '${value}'`, (err,rows) => {
                if(err) reject(err);

                resolve(rows);
            });
        });
    });
}

export function updatePet(pet) { 
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
           
            connection.query(`UPDATE pets SET avatar_url='${pet.avatar_url}', name = '${pet.name}', age = '${pet.age}', sex = '${pet.sex}', breed = '${pet.breed}', type = '${pet.type}', adoptable = '${pet.adoptable}', adopted = '${pet.adopted}', birthday = '${pet.birthday}' WHERE id = '${pet.id}';`, (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}

export function deletePet(pet) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
    
            connection.query('DELETE FROM pets WHERE id = ?', [pet.id], (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
        });
    });
}
//*/

//