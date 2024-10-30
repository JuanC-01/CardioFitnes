const express = require('express');
const router = express.Router();
const {rMensualidad, cMesnualidadUlt} = require("../connections/mensualidad/mesualidad");

router.post('/registro', (req, res) => {
    rMensualidad(req, res, req.app.get('db'));
});

router.get('/ultimomensualidad/:cedula', (req, res) => {
    cMesnualidadUlt(req, res, req.app.get('db'));
});

module.exports = router;