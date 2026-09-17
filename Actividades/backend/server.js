const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dashboardRouter = require("./routes/dashboard");
const attendanceRouter = require("./routes/attendance");
const servicesRouter = require("./routes/services");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("Servidor funcionando"));
app.use("/api/dashboard", dashboardRouter);
app.use("/api/asistencias", attendanceRouter);
app.use("/api/servicios", servicesRouter);

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
