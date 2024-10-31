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
import SaveIcon from '@mui/icons-material/Save';

export default function ModalMesualidad({ open, onClose, onSave, onCancel, editedFields,   errors,
    selectServicio, handleServicio, servicio, imagePreview, 
    handleDateChange, editedEmployee, selectedDate
}) {
    const currentYear = dayjs().year(); 
    const minDate = dayjs(`${currentYear}-01-01`);
    const maxDate = dayjs();

    const [isEditable, setIsEditable] = useState(false);
  

    const handleClose = () => {
        setIsEditable(false);
        onClose();
    };

    const handleCancel = () => {
        setIsEditable(false);
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
                        <Grid item xs={4} container justifyContent="center" alignItems="center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    style={{ width: 250, height: 250 }}
                                    alt="Vista previa"
                                />
                            ) : (
                                editedFields.imagen && (
                                    <img
                                        src={`http://cardiofit.ddns.net:8081/backend/image/${editedFields.imagen}`}
                                        style={{ width: 250, height: 250 }}
                                        alt="Cliente"
                                    />
                                )
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
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Apellidos"
                                        value={editedFields.apellidos || ''}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            inputFormat="YYYY/MM/DD"
                                            label="Fecha Pago"
                                            selected={selectedDate || editedEmployee?.fechanto}
                                            onChange={handleDateChange}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        value={selectServicio}
                                        onChange={handleServicio}
                                        options={servicio || []}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                label="Servicio"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={onSave}
                            sx={{ mr: 1 }} 
                        >
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            sx={{ mr: 1 }} 
                            onClick={handleCancel}
                        >
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
