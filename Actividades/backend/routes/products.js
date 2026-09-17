const express = require("express");
const database = require("../config/database");

const router = express.Router();

router.get("/", (req, res) => {
    database.query("SELECT * FROM productos", (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(results);
    });
});

module.exports = router;