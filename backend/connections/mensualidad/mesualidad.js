const rMensualidad = (req, res, db) => {
    const { fecha_pago, fk_cedula, fk_idservicio } = req.body;

    const sqlRMensualidadAdd = "CALL REGISTRARMENSUALIDAD(?, ?, ?)";
    db.query(sqlRMensualidadAdd, [fecha_pago, fk_cedula, fk_idservicio], (err, result) => {
        if (err) {
            console.error("Error al insertar mensualidad:", err);
            return res.status(500).json({ message: "ERROR" });
        }
        return res.status(200).json({ message: "MENSUALIDAD REGISTRADA" });
    });
};

const cMesnualidadUlt = (req, res, db) => {
    const { cedula } = req.params; 
    const sql = "CALL CONSULTAMENSUALIDADULTIMA(?)";

    db.query(sql, [cedula], (err, result) => {
        if (err) {
            console.error("Error al obtener mensualidad:", err);
            return res.status(500).json({ message: "Error al obtener mensualidad." });
        }

        // Verificar que result tenga al menos un elemento y que el primer elemento tenga datos
        if (!result || !result[0] || result[0].length === 0) {
            console.log("No se encontró ninguna mensualidad para la cédula proporcionada.");
            return res.status(404).json({ message: "No se encontró ninguna mensualidad para esta cédula." });
        }

        const mensualidad = result[0][0]; 

        // Formatear el estado de la mensualidad
        const estadoMensualidad = mensualidad.ESTADOMENSUALIDAD === 'P' ? 'PAGADO' : 
                                  mensualidad.ESTADOMENSUALIDAD === 'D' ? 'DEBE' : 
                                  'Estado desconocido'; // Manejo de otros posibles estados

        const formattedMensualidad = {
            fechapg: mensualidad.FECHAPAGO,
            fechapx: mensualidad.FECHAPROXIMO,
            estadom: estadoMensualidad,
        };

        console.log("Última mensualidad obtenida:", formattedMensualidad);
        return res.status(200).json(formattedMensualidad);
    });
};


module.exports = {
    rMensualidad,
    cMesnualidadUlt
};
