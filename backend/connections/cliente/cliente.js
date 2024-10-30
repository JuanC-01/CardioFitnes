const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const rcliente = (req, res, db) => {
    const { cedula, nombres, apellidos, fechanto, fk_ideps, fk_idhorario, telefono, talla } = req.body;
    const imagenp = req.file ? req.file.filename : null;

    if (!cedula || !nombres || !apellidos || !fechanto || !fk_ideps || !fk_idhorario) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
    const sqlRegistrarCliente = "CALL REGISTRARCLIENTE(?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sqlRegistrarCliente, [cedula, nombres, apellidos, fechanto, fk_ideps, fk_idhorario, telefono,  talla, imagenp], (err, result) => {
        if (err) {
            if (err.code === 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('La cédula ya está registrada')) {
                return res.status(409).json({ message: "La cédula ya está registrada" });
            }
            console.error("Error al registrar cliente:", err);
            return res.status(500).json({ message: "Error al registrar cliente" });
        }
        return res.status(201).json({ message: "Registro cliente exitoso" });
    });
};

const upcliente = (req, res, db) => {
    const { cedula, datosCliente } = req.body;
    const { nombres, apellidos, fechanto, telefono, fk_idhorario, fk_ideps } = datosCliente;

    const imagenp = req.file ? req.file.filename : null;
    const getCurrentImageSql = `SELECT IMAGENP FROM cliente WHERE CEDULA = ?`;
    
    db.query(getCurrentImageSql, [cedula], (err, result) => {
        if (err || result.length === 0) {
            console.error("Error al obtener la imagen actual:", err);
            return res.status(500).json({ message: "Error al obtener la imagen actual" });
        }
        
        const currentImage = result[0].IMAGENP;
        const finalImage = imagenp || currentImage;

        const sql = `
            CALL ACTUALIZARCLIENTE(
                ${cedula},
                '${nombres || ''}',
                '${apellidos || ''}',
                '${fechanto || ''}',
                '${telefono || ''}',
                '${fk_idhorario || ''}',
                '${fk_ideps || ''}',
                '${finalImage}'
            )
        `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error al actualizar cliente:", err);
                return res.status(500).json({ message: "Error al actualizar cliente" });
            }
            return res.status(200).json({ message: "Cliente actualizado exitosamente" });
        });
    });
};


const bhorario = (req, res, db) => {
    const sql = "CALL CONSULTAHORARIO()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener HORARIO:", err);
            return res.status(500).json({ message: "Error al obtener HORARIO" });
        }
        console.log("Datos de tipos de HORARIO:", result);
        const formattedHorario = result[0].map(horario => ({
            label: horario.NOMBREHORARIO,
            value: horario.IDHORARIO
        }));
        //console.log("HORARIO formateados:", formattedHorario);
        return res.status(200).json(formattedHorario);
    });
};

const consultarClientes = (req, res, db) => {
    const sql = "CALL CONSULTARTODOSCLIENTES()";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar clientes:", err);
            return res.status(500).json({ message: "Error al seleccionar clientes" });
        }
        const formattedClientes = result[0].map(cliente => ({
            cedula: cliente.CEDULA,
            nombres: cliente.NOMBRES,
            apellidos: cliente.APELLIDOS,
            edad: cliente.EDAD,
            telefono: cliente.TELEFONO,
            fechanto: cliente.FECHANTO,
            nombreEPS: cliente.NOMBREEPS,
            horario: cliente.NOMBREHORARIO,
            imagen: cliente.IMAGENP,
            fk_ideps: cliente.FK_IDEPS,          
            fk_idhorario: cliente.FK_IDHORARIO
        }));
        //console.log("Vehiculos cliente formateados:", formattedClientes);
        return res.status(200).json(formattedClientes);
    });
};

const regPeso = (req, res, db) => {
    const { pesokg, cedula } = req.body;

    if (!pesokg || !cedula) {
        return res.status(400).json({ message: "El peso y la cédula son obligatorios." });
    }

    const sqlRegistrarPeso = "CALL REGISTROPESO(?, ?)";

    db.query(sqlRegistrarPeso, [pesokg, cedula], (err, result) => {
        if (err) {
            console.error("Error al registrar peso:", err);
            return res.status(500).json({ message: "Error al registrar peso" });
        }
        return res.status(201).json({ message: "Registro de peso exitoso" });
    });
};

const CHistPeso = (req, res, db) => {
    const { cedula } = req.params; 
    const año = req.query.año ? parseInt(req.query.año) : null; 

    if (!cedula || isNaN(cedula)) {
        return res.status(400).json({ message: "Cédula inválida" });
    }

    const sql = "CALL CONSULTA_HISTORIAL_PESO(?, ?)";

    db.query(sql, [cedula, año], (err, result) => {
        if (err) {
            console.error("Error al consultar historial de peso:", err);
            return res.status(500).json({ message: "Error al consultar historial de peso" });
        }
        const formattedHistorial = result[0].map(entry => ({
            idpeso: entry.idpeso,
            año: entry.año,
            mes: entry.mes,
            fecha: entry.fecha,
            peso: entry.peso
        }))
        .sort((a, b) => {
            if (a.año !== b.año) {
                return a.año - b.año; 
            } else if (a.mes !== b.mes) {
                return a.mes - b.mes; 
            }
            return 0;
        });
        //console.log("Historial de peso formateado:", formattedHistorial);
        return res.status(200).json(formattedHistorial);
    });
};

const updatePeso = (req, res, db) => {
    const { idpeso, nuevoPeso, cedula } = req.body;

    if (!idpeso || !nuevoPeso || !cedula || isNaN(nuevoPeso) || idpeso <= 0) {
        return res.status(400).json({ message: "ID de peso, nuevo peso y cédula del cliente son obligatorios." });
    }

    const sqlActualizarPeso = "CALL ACTUALIZARPESO(?, ?, ?)";

    db.query(sqlActualizarPeso, [idpeso, nuevoPeso, cedula], (err, result) => {
        if (err) {
            if (err.code === '45000') {  
                return res.status(404).json({ message: err.sqlMessage });
            }
            console.error("Error al actualizar peso:", err);
            return res.status(500).json({ message: "Error al actualizar peso" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el registro con el ID proporcionado." });
        }
        return res.status(200).json({ message: "Peso actualizado exitosamente", nuevoPeso });
    });
};

const deltPeso = (req, res, db) => {
    const { idpeso, cedula } = req.body;
    if (!idpeso || !cedula) {
        return res.status(400).json({ message: "ID de peso y cédula son obligatorios." });
    }
    const sqlEliminarPeso = "CALL ELIMINARPESO(?, ?)";

    db.query(sqlEliminarPeso, [idpeso, cedula], (err, result) => {
        if (err) {
            if (err.code === '45000') {  
                return res.status(404).json({ message: err.sqlMessage });
            }
            console.error("Error al eliminar peso:", err);
            return res.status(500).json({ message: "Error al eliminar peso" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el registro de peso con el ID proporcionado." });
        }

        return res.status(200).json({ message: "Peso eliminado exitosamente" });
    });
};


module.exports = {
    rcliente,
    upcliente,
    bhorario,
    consultarClientes, 
    regPeso,
    CHistPeso,
    updatePeso,
    deltPeso
};
