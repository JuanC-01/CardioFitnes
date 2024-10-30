const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {rproducto, conProd, bprodu, upproducto, compraProd, updateCant, rVenta} = require("../connections/producto/producto");

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


router.post('/registro', upload.single('imagenpr'), (req, res) => {
    rproducto(req, res, req.app.get('db'));
});

router.get('/consultar-productos', (req, res) => {
    conProd(req, res, req.app.get('db'));
});

router.get('/consultar-nomprod', (req, res) => {
    bprodu(req, res, req.app.get('db'));
});

router.post('/update', upload.single('imagenpr'),(req, res) => {
    const id = req.body.id;
    const datos = req.body.datos;
    upproducto(req, res, req.app.get('db'), id, datos);
});

router.post('/update-cantidad', (req, res) => {
    const { idProducto, cantidad } = req.body; 
    updateCant(req, res, req.app.get('db'), idProducto, cantidad); 
});

router.post('/registrar-compra/:fk_idproducto', (req, res) => {
    compraProd(req, res, req.app.get('db'));
});

router.post('/registrar-venta/:fk_idproducto', (req, res) => {
    rVenta(req, res, req.app.get('db'));
});



module.exports = router;