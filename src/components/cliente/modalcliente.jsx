import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export default function ModalCliente({ open, onClose, onSave, onCancel, editedFields, setEditedFields, errors,
    selectEps, handleEps, eps, selectHorario, handleHorario, horario, imagePreview, setImagePreview,
    handleImageChange, handleDateChange, editedEmployee, selectedDate
}) {
    const minDate = dayjs('1960-01-01');
    const currentYear = dayjs().year();
    const maxDate = dayjs(`${currentYear}-12-31`);

    const [isEditable, setIsEditable] = useState(false);
    const [isHorarioSelected, setIsHorarioSelected] = useState(false);
    const [isEpsSelected, setIsEpsSelected] = useState(false);

    const handleHorarioClick = () => {
        if (isEditable) {
            setIsHorarioSelected(true);
        }
    };

    const handleEpsClick = () => {
        if (isEditable) {
            setIsEpsSelected(true);
        }
    };

    const handleClose = () => {
        setIsEditable(false);
        setIsHorarioSelected(false);
        setIsEpsSelected(false);
        setImagePreview(null);
        onClose();
    };

    const handleCancel = () => {
        setIsEditable(false);
        setIsHorarioSelected(false);
        setIsEpsSelected(false);
        setImagePreview(null);
        onCancel();
        onClose();
    };


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 900,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4
                    }}
                >
                    <Grid container spacing={2}>
                        {/* Columna para la Imagen */}
                        <Grid item xs={4} container justifyContent="center" alignItems="center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview} // Usar la vista previa de la imagen
                                    style={{ width: 250, height: 250 }}
                                    alt="Vista previa"
                                />
                            ) : (
                                editedFields.imagen && (
                                    <img
                                        src={`http://cardiofit.ddns.net:80/backend/image/${editedFields.imagen}`}
                                        style={{ width: 250, height: 250 }}
                                        alt="Cliente"
                                    />
                                )
                            )}
                            {/* Mostrar la opción de subir nueva imagen solo si está en modo editable */}
                            {isEditable && (
                                <Box mt={2}>
                                    <Button variant="contained" component="label">
                                        Cambiar Imagen
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                        {/* Columna para los Datos del Cliente */}
                        <Grid item xs={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Cédula"
                                        value={editedFields.cedula || ''}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nombres"
                                        value={editedFields.nombres || ''}
                                        onChange={(e) => setEditedFields({ ...editedFields, nombres: e.target.value.toUpperCase() })}
                                        fullWidth
                                        error={!!errors.nombres}
                                        helperText={errors.nombres}
                                        disabled={!isEditable}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Apellidos"
                                        value={editedFields.apellidos || ''}
                                        onChange={(e) => setEditedFields({ ...editedFields, apellidos: e.target.value.toUpperCase() })}
                                        fullWidth
                                        error={!!errors.apellidos}
                                        helperText={errors.apellidos}
                                        disabled={!isEditable}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Edad"
                                        value={editedFields.edad || ''}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Teléfono"
                                        value={editedFields.telefono || ''}
                                        onChange={(e) => setEditedFields({ ...editedFields, telefono: e.target.value })}
                                        fullWidth
                                        error={!!errors.telefono}
                                        helperText={errors.telefono}
                                        disabled={!isEditable}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            inputFormat="YYYY/MM/DD"
                                            label="Fecha Nacimiento"
                                            value={dayjs(editedFields.fechanto)}
                                            selected={selectedDate || editedEmployee?.fechanto}
                                            onChange={handleDateChange}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                            disabled={!isEditable}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={6}>
                                    {isEditable && isHorarioSelected ? (
                                        <Autocomplete
                                            value={selectHorario}
                                            onChange={handleHorario}
                                            options={horario || []}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    label="Horario"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    ) : (
                                        <TextField
                                            label="Horario"
                                            value={editedFields.horario || ''}
                                            fullWidth
                                            disabled={!isEditable}
                                            onClick={handleHorarioClick}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={6}>
                                    {isEditable && isEpsSelected ? (
                                        <Autocomplete
                                            value={selectEps}
                                            onChange={handleEps}
                                            options={eps || []}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    label="Eps"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    ) : (
                                        <TextField
                                            label="Eps"
                                            value={editedFields.nombreEPS || ''}
                                            fullWidth
                                            disabled={!isEditable}
                                            onClick={handleEpsClick}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        {isEditable ? (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={onSave}
                                sx={{ mr: 1 }} 
                            >
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditable(true)}
                                sx={{ mr: 1 }} 
                            >
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                        >
                        </Button>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
}
