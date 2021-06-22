import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql';

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: "findpet"
});

export function getUsers(id) {
    
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected!');

        connection.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
            connection.release();

            if (err) throw err;
            console.log(rows)
            rows.forEach(res => {
                console.log(res.email)
            })
        })

    })
}
