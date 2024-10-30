function validateName(value) {
    if (!value || !value.trim()) {
        return "¡Campo requerido!";
    }
    return "";
}
function validation(values,  selectedhorario) {
    let errors = {};

    if (!values.cedula || !values.cedula.trim()) {
        errors.cedula = "¡Campo requerido!";
    }
   
    if (!selectedhorario) {
        errors.selectedhorario = "¡Campo requerido!";
    }

  
    errors.nombres = validateName(values.nombres);
    errors.apellidos = validateName(values.apellidos);
    errors.peso = validateName(values.peso);
    errors.nombrep = validateName(values.nombrep);
    errors.nombresv = validateName(values.nombresv);
    errors.preciosv = validateName(values.preciosv);
    errors.preciop = validateName(values.preciop);

    return errors;
}

export default validation;

