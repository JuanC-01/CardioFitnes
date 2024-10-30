const rservicio = (req, res, db) => {
    const { nombresv, preciosv } = req.body;

    const sqlRProductoAdd = "CALL REGISTROSERVICIO(?, ?)";
    db.query(sqlRProductoAdd, [nombresv, preciosv], (err, result) => {
        if (err) {
            console.error("Error al insertar servicio:", err);
            return res.status(500).json({ message: "ERROR" });
        }
        return res.status(200).json({ message: "SERVICIO REGISTRADO" });
    });
};

const bServicio = (req, res, db) => {
    const sql = "CALL CONSULTASERVICIO()";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar servicio:", err);
            return res.status(500).json({ message: "Error al seleccionar servicio" });
        }
        const formattedServicio = result[0].map(servicio => ({
            label: servicio.NOMBRESERVICIO,
            value: servicio.IDSERVICIO
        }));
        console.log("Servicio:", formattedServicio);
        return res.status(200).json(formattedServicio);
    });
};

const conServi = (req, res, db) => {
    const sql = "CALL CONSULTASERVICIO()";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar servicio:", err);
            return res.status(500).json({ message: "Error al seleccionar servicio" });
        }
        const formattedServicio = result[0].map(servicio => ({
            id: servicio.IDSERVICIO,
            nombre: servicio.NOMBRESERVICIO,
            precio: servicio.PRECIOSERVICIO,
        }));
        return res.status(200).json(formattedServicio);
    });
};

const upServicio = (req, res, db) => {
    const { id, datos } = req.body;
    const { nombre, precio } = datos;

    const sql = `
            CALL ACTUALIZARSERVICIO(
                ${id},
                '${nombre || ''}',
                '${precio || ''}'
            )
        `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al actualizar servicio:", err);
            return res.status(500).json({ message: "Error al actualizar servicio" });
        }
        return res.status(200).json({ message: "servicio actualizado exitosamente" });
    });

};

module.exports = {
    rservicio,
    bServicio,
    conServi,
    upServicio
};