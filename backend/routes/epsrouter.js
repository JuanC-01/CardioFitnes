const express = require('express');
const router = express.Router();

const {reps, beps} = require("../connections/cliente/eps");

router.post('/registrar', (req, res) => {
    reps(req, res, req.app.get('db'));
});


router.get('/consultar-eps', (req, res) => {
    beps(req, res, req.app.get('db'));
});


module.exports = router;