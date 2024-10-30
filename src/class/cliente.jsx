class Cliente {
    constructor(cedula, nombres, apellidos, fechanto, fk_ideps, fk_idhorario, telefono, talla, imagenp) {
        this.cedula = cedula;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.fechanto = fechanto;
        this.fk_ideps = fk_ideps;
        this.fk_idhorario = fk_idhorario;
        this.telefono = telefono;
        this.talla = talla;
        this.imagenp = imagenp;
    }
}

export default Cliente;
