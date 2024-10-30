const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {rservicio, bServicio, conServi, upServicio} = require("../connections/servicio/servicio");

router.post('/registro', (req, res) => {
    rservicio(req, res, req.app.get('db'));
});

router.get('/consultar-servicio', (req, res) => {
    bServicio(req, res, req.app.get('db'));
});

router.get('/consultar-servicios', (req, res) => {
    conServi(req, res, req.app.get('db'));
});

router.post('/update', upload.none(),(req, res) => {
    const id = req.body.id;
    const datos = req.body.datos;
    upServicio(req, res, req.app.get('db'), id, datos);
});

module.exports = router;