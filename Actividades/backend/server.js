const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((error) => {
    if (error) {
        console.log("Error al conectar con MySQL:", error);
        return;
    }

    console.log("Conectado a MySQL");
});

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.get("/productos", (req, res) => {
    const sql = "SELECT * FROM productos";

    db.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.json(resultados);
    });
});

app.listen(3001, () => {
    console.log("Servidor ejecutándose en http://localhost:3001");
});