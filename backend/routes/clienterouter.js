const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { rcliente, upcliente, bhorario, consultarClientes, regPeso, CHistPeso, updatePeso, deltPeso} = require("../connections/cliente/cliente");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../image/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/registrar', upload.single('imagenp'), (req, res) => {
    console.log(req.body);  
    console.log(req.file);  
    rcliente(req, res, req.app.get('db'));
});

router.post('/registrar-peso', (req, res) => {
    //console.log('datos recibidos', req.body);
    regPeso(req, res, req.app.get('db'));
});

router.get('/consultar-horario', (req, res) => {
    bhorario(req, res, req.app.get('db'));
});

router.get('/consultar-clientes', (req, res) => {
    consultarClientes(req, res, req.app.get('db'));
});

router.get('/historial-peso/:cedula', (req, res) => {
    CHistPeso(req, res, req.app.get('db'));
});

router.post('/actualizar', upload.single('imagenp'),(req, res) => {
    const cedula = req.body.cedula;
    //console.log("cedula", cedula);
    const datosCliente = req.body.datosCliente;
    //console.log("datos", datosCliente);
    upcliente(req, res, req.app.get('db'), cedula, datosCliente);
});

router.post('/actualizar-peso', (req, res) => {
    //console.log('Datos recibidos para actualización de peso:', req.body);
    updatePeso(req, res, req.app.get('db'));
});

router.delete('/eliminar-peso', (req, res) => {
    //console.log('Datos recibidos para eliminación de peso:', req.body);
    deltPeso(req, res, req.app.get('db'));
});

module.exports = router;

