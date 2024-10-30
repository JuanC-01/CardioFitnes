const express = require('express');
const router = express.Router();

const RegistroCliente = require('../routes/clienterouter');
const MensualidadR = require('./mensualidadrouter');
const EpsR = require('../routes/epsrouter');
const ProductoR = require('./productorouter');
const ServicioR = require('./serviciorouter');
const ReporteR = require('./reporterouter');

router.use('/Cliente', RegistroCliente);
router.use('/Eps', EpsR);
router.use('/Mensualidad', MensualidadR);
router.use('/Producto', ProductoR);
router.use('/Servicio', ServicioR);
router.use('/Reporte', ReporteR);


module.exports = router;
