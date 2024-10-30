DELIMITER //
CREATE PROCEDURE REGISTRARMENSUALIDAD(
    IN p_fecha_pago DATE,
    IN p_fk_cedula INT,
    IN p_fk_idservicio INT
)
BEGIN
    DECLARE estado_mensualidad ENUM('P', 'D');
    IF p_fecha_pago < CURDATE() THEN
        SET estado_mensualidad = 'D';
    ELSE
        SET estado_mensualidad = 'P';
    END IF;
    INSERT INTO MENSUALIDAD (FECHAPAGO, ESTADOMENSUALIDAD, FK_CEDULA, FK_IDSERVICIO)
    VALUES (p_fecha_pago, estado_mensualidad, p_fk_cedula, p_fk_idservicio);
END //
DELIMITER ;



DELIMITER //

CREATE EVENT UPDATE_ESTADOMENSUALIDAD
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    UPDATE MENSUALIDAD
    SET ESTADOMENSUALIDAD = 'D'
    WHERE FECHAPAGO < CURDATE() AND ESTADOMENSUALIDAD = 'P';
END; //

DELIMITER ;
