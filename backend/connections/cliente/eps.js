const reps = (req, res, db) => {
    const { nombre_eps, estado_eps = 'A' } = req.body; // Estado por defecto 'A'

    // Validar los datos de entrada
    if (!nombre_eps) {
        return res.status(400).json({ error: 'Falta el nombre de la EPS' });
    }
    const query = 'CALL REGISTRAREPS(?, ?)';
    db.execute(query, [nombre_eps, estado_eps], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: 'EPS registrada exitosamente' });
    });
};

const beps = (req, res, db) => {
    const sql = "CALL CONSULTAEPS()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener eps:", err);
            return res.status(500).json({ message: "Error al obtener eps" });
        }
        console.log("Datos de tipos de eps:", result);
        const formattedEps = result[0].map(eps => ({
            label: eps.NOMBREEPS,
            value: eps.IDEPS
        }));
        console.log("Eps formateados:", formattedEps);
        return res.status(200).json(formattedEps);
    });
};


module.exports = {
    reps,
    beps
    
};
