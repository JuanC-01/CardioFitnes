const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const routes = require("./routes/routers");
const path = require("path"); 

const app = express();
app.use(cors());
app.use(express.json());
app.use('/backend/image', express.static(path.join(__dirname, './image')));


const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "cardiofitness"
});

db.connect(function (err) {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos con ID ' + db.threadId);
});

// Middleware para pasar la conexión de la base de datos a las rutas
app.use((req, res, next) => {
    req.app.set('db', db);
    next();
});

// Usar las rutas
app.use('/', routes);

app.listen(8081, () => {
    console.log("Escuchando en el puerto 8081");
});








