const mysql = require("mysql2");

const database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: false,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000,
});

database.getConnection((error, connection) => {
    if (error) {
        console.log("Error al conectar con MySQL:", error.message);
        return;
    }
    console.log("Conectado a MySQL");
    connection.release();
});

module.exports = database;
