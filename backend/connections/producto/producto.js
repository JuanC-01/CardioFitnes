const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const rproducto = (req, res, db) => {
    const { nombrep, preciop} = req.body;
    const imagenpr = req.file ? req.file.filename : null;

    const sqlRProductoAdd = "CALL REGISTROPRODUCTO(?, ?, ?)";
    db.query(sqlRProductoAdd, [nombrep, preciop, imagenpr], (err, result) => {
        if (err) {
            console.error("Error al insertar producto:", err);
            return res.status(500).json({ message: "ERROR" });
        }
        return res.status(200).json({ message: "PRODUCTO REGISTRADO" });
    });
};

const conProd = (req, res, db) => {
    const sql = "CALL CONSULTAPRODUCTOS()";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar productos:", err);
            return res.status(500).json({ message: "Error al seleccionar productos" });
        }
        const formattedProducto = result[0].map(productos => ({
            id: productos.IDPRODUCTO,
            nombre: productos.NOMBREPRODUCTO,
            precio: productos.PRECIOPRODUCTO,
            cantidad: productos.CANTIDADPRODUCTO,
            imagen: productos.IMAGENPR
        }));
        return res.status(200).json(formattedProducto);
    });
};

const bprodu = (req, res, db) => {
    const sql = "CALL CONSULTAPRODUCTOS()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener productos:", err);
            return res.status(500).json({ message: "Error al obtener productos" });
        }
        console.log("Datos de tipos de productos:", result);
        const formattedProd = result[0].map(productos => ({
            label: productos.NOMBREPRODUCTO,
            value: productos.IDPRODUCTO
        }));
        console.log("Eps formateados:", formattedProd);
        return res.status(200).json(formattedProd);
    });
};

const upproducto = (req, res, db) => {
    const { id, datos } = req.body;
    const { nombre, precio} = datos;

    const imagenpr = req.file ? req.file.filename : null;
    const getCurrentImageSql = `SELECT IMAGENPR FROM PRODUCTO WHERE IDPRODUCTO = ?`;
    
    db.query(getCurrentImageSql, [id], (err, result) => {
        if (err || result.length === 0) {
            console.error("Error al obtener la imagen actual:", err);
            return res.status(500).json({ message: "Error al obtener la imagen actual" });
        }
        
        const currentImage = result[0].IMAGENPR;
        const finalImage = imagenpr || currentImage;

        const sql = `
            CALL ACTUALIZARPORDUCTO(
                ${id},
                '${nombre || ''}',
                '${precio || ''}',
                '${finalImage}'
            )
        `;
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error al actualizar producto:", err);
                return res.status(500).json({ message: "Error al actualizar producto" });
            }
            return res.status(200).json({ message: "Producto actualizado exitosamente" });
        });
    });
};

const compraProd = (req, res, db) => {
    const { cantidad } = req.body; 
    const fk_idproducto = req.params.fk_idproducto;

    if (!cantidad || !fk_idproducto) {
        return res.status(400).json({ message: "Cantidad y fk_idproducto son requeridos" });
    }

    const sqlRProductoAdd = "CALL COMPRAPRODUCTO(?, ?)"; 

    db.query(sqlRProductoAdd, [cantidad, fk_idproducto], (err, result) => {
        if (err) {
            console.error("Error al insertar producto:", err);
            return res.status(500).json({ message: "ERROR al registrar el producto" });
        }

        return res.status(200).json({ message: "PRODUCTO REGISTRADO" });
    });
};

const updateCant = (req, res, db) => {
    const { idProducto, cantidad } = req.body;  

    const sqlRProductoAdd = "CALL UPDATECANTIDAD(?, ?)";  

    db.query(sqlRProductoAdd, [idProducto, cantidad], (err, result) => {
        if (err) {
            console.error("Error al actualizar la cantidad del producto:", err);
            return res.status(500).json({ message: "ERROR al actualizar la cantidad del producto" });
        }

        return res.status(200).json({ message: "CANTIDAD DEL PRODUCTO ACTUALIZADA" });
    });
};

const rVenta = (req, res, db) => {
    const { cantidad } = req.body;
    const fk_idproducto = req.params.fk_idproducto;

    if (!cantidad || !fk_idproducto) {
        return res.status(400).json({ message: "Cantidad y fk_idproducto son requeridos" });
    }

    const sqlRegistrarVenta = "CALL RegistrarVenta(?, ?)";

    db.query(sqlRegistrarVenta, [cantidad, fk_idproducto], (err, result) => {
        if (err) {
            // Manejo de errores SQL
            if (err.sqlState === '45000') {
                return res.status(400).json({ message: err.sqlMessage }); // Asegúrate de que err.sqlMessage contiene el mensaje correcto
            }
            console.error("Error al registrar la venta:", err);
            return res.status(500).json({ message: "ERROR al registrar la venta" });
        }

        return res.status(200).json({ message: "Venta registrada correctamente" });
    });
};


module.exports = {
    rproducto,
    conProd,
    bprodu,
    upproducto,
    compraProd,
    updateCant,
    rVenta
};