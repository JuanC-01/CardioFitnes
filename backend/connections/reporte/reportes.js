const CReporteMensMes = (req, res, db) => {
    const { fecha } = req.query;

    if (!fecha || isNaN(Date.parse(fecha))) {
        return res.status(400).json({ message: "Fecha inválida" });
    }

    const sql = "CALL REPORTEMENSUAIDADMES(?)";
    db.query(sql, [fecha], (err, result) => {
        if (err) {
            console.error("Error al consultar reporte de mensualidades:", err);
            return res.status(500).json({ message: "Error al consultar reporte de mensualidades" });
        }
        const reportData = result[0];

        if (reportData.length > 0) {
            const formattedReporte = {
                numClientes: reportData[0].NUM_CLIENTES,
                precioServicio: reportData[0].PRECIO_SERVICIO,
                totalServicioMensual: reportData[0].TOTAL_SERVICIO_MENSUAL,
            };

            console.log("Reporte mensualidad:", formattedReporte);
            return res.status(200).json([formattedReporte]); // Devuelve un array
        } else {
            return res.status(404).json({ message: "No se encontraron registros para la fecha especificada." });
        }
    });
};

const CReporteVentas = (req, res, db) => {
    const { fecha } = req.query;

    // Validar la fecha recibida
    if (!fecha || isNaN(Date.parse(fecha))) {
        return res.status(400).json({ message: "Fecha inválida" });
    }

    const sql = "CALL VENTASMES(?)";
    db.query(sql, [fecha], (err, result) => {
        if (err) {
            console.error("Error al consultar reporte de ventas:", err);
            return res.status(500).json({ message: "Error al consultar reporte de ventas" });
        }

        const reportVenta = result[0];

        // Verificar si hay resultados y devolver el formato correcto
        if (reportVenta.length > 0) {
            const formattedVenta = {
                totalUnidadesVendidas: reportVenta[0].TotalUnidadesVendidas,
                totalMonto: reportVenta[0].TotalMonto,
            };

            console.log("Reporte mensualidad:", formattedVenta);
            return res.status(200).json(formattedVenta); // Devuelve el objeto
        } else {
            return res.status(404).json({ message: "No se encontraron registros para la fecha especificada." });
        }
    });
};

const CReporteVentasDeta = (req, res, db) => {
    const { fecha } = req.query;

    // Validar la fecha recibida
    if (!fecha || isNaN(Date.parse(fecha))) {
        return res.status(400).json({ message: "Fecha inválida" });
    }

    const sql = "CALL VENTAFETALLADO(?)";
    db.query(sql, [fecha], (err, result) => {
        if (err) {
            console.error("Error al consultar reporte de ventas:", err);
            return res.status(500).json({ message: "Error al consultar reporte de ventas" });
        }

        const reportVenta = result[0];

        if (reportVenta.length > 0) {
            const formattedVentas = reportVenta.map(item => ({
                nombreProducto: item.NOMBREPRODUCTO,
                totalVendido: item.TotalVendido,
                totalMonto: item.TotalMonto,
            }));

            console.log("Reporte de ventas detallado:", formattedVentas);
            return res.status(200).json(formattedVentas); 
        } else {
            return res.status(404).json({ message: "No se encontraron registros para la fecha especificada." });
        }
    });
};


const CReportePDF = (req, res, db) => {
    // Asegúrate de que la fecha se pase en el formato adecuado (YYYY-MM-DD)
    const { fecha } = req.query; // Obtiene la fecha del parámetro de la consulta

    // Llama al procedimiento almacenado con la fecha como parámetro
    const sql = "CALL REPORTE_PDF(?)"; // Utiliza un marcador de posición para evitar inyecciones SQL

    db.query(sql, [fecha], (err, result) => {
        if (err) {
            console.error("Error al consultar reporte PDF:", err);
            return res.status(500).json({ message: "Error al consultar reporte PDF" });
        }

        const reportData = result[0]; // Se asume que el primer elemento contiene los resultados

        if (reportData.length > 0) {
            // Mapear los datos formateados
            const formattedReport = reportData.map(item => ({
                nombres: item.NOMBRES,
                apellidos: item.APELLIDOS,
                fechaPago: item.FECHAPAGO,
                totalServicioMensual: item.TOTAL_SERVICIO_MENSUAL // Total calculado en el procedimiento almacenado
            }));

            console.log("Reporte PDF:", formattedReport);
            return res.status(200).json(formattedReport); // Devuelve el array de resultados formateado
        } else {
            return res.status(404).json({ message: "No se encontraron registros." });
        }
    });
};




module.exports = {
    CReporteMensMes,
    CReportePDF,
    CReporteVentas,
    CReporteVentasDeta
};

