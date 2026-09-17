const express = require("express");
const cors = require("cors");
require("dotenv").config();
const productsRouter = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.use("/productos", productsRouter);

app.listen(3001, () => {
    console.log("Servidor ejecutándose en http://localhost:3001");
});