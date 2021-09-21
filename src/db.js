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
        cpf varchar(255) not null,
        email varchar(255) not null,
        image varchar(255) not null,
        password varchar(255) not null
    );`)

    connection.query(`CREATE TABLE IF NOT EXISTS pets (
        id varchar(255) not null primary key,
        name varchar(255) not null,
        breed varchar(255) not null,
        sex varchar(255) not null,
        age date,
        image varchar(255) not null,
        user_id varchar(255),
        constraint fk_idUser foreign key (user_id) references users (id)
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
    
            connection.query(`INSERT INTO users VALUES ('${user.id}', '${user.name}', '${user.cpf}', '${user.email}', '${user.image}', '${user.password}')`, (err, rows) => {
                connection.release();
                if (err) reject(err);
                
                resolve(true);
            });
        });
    });
}

export function updateUser(user) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
    
            connection.query(`UPDATE users SET name = '${user.name}', cpf = '${user.cpf}', email = '${user.email}', image = '${user.image}', password = '${user.password}' WHERE id = '${user.id}';`, (err, rows) => {
                connection.release();
                if (err) reject(err);

                resolve(true);
            });
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
            
            connection.query(`INSERT INTO pets VALUES ('${pet.id}', '${pet.nome}', '${pet.raca}', '${pet.sexo}', '${pet.idade}', '${pet.image}', '${pet.userID}')`, (err,rows) => {
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
            connection.query(`SELECT * FROM pets WHERE userID = ${user.id}`, (err,rows) => {
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
            connection.query(`SELECT ${property} FROM pets WHERE petID = '${value}'`, (err,rows) => {
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
           
            connection.query(`UPDATE pets SET nome = '${pet.nome}', raca = '${pet.raca}', sexo = '${pet.sexo}', idade = '${pet.idade}', image = '${pet.image}', userID = '${pet.userID}' WHERE id = '${pet.id}';`, (err, rows) => {
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