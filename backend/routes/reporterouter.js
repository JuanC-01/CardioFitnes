const express = require('express');
const router = express.Router();
const {CReporteMensMes, CReportePDF, CReporteVentas, CReporteVentasDeta} = require("../connections/reporte/reportes");


router.get('/consultar', (req, res) => {
    CReporteMensMes(req, res, req.app.get('db'));
});

router.get('/reporte', (req, res) => {
    CReportePDF(req, res, req.app.get('db'));
});

router.get('/consultar-ventas', (req, res) => {
    CReporteVentas(req, res, req.app.get('db'));
});

router.get('/consultar-ventasdetallada', (req, res) => {
    CReporteVentasDeta(req, res, req.app.get('db'));
});



module.exports = router;