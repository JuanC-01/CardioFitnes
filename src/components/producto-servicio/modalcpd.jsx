import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export default function ModalCPD({ open, onClose, onSave, onCancel, editedFields, setEditedFields, errors,
    imagePreview, setImagePreview, handleImageChange
}) {

    const [isEditable, setIsEditable] = useState(false);

    const handleClose = () => {
        setIsEditable(false);
        setImagePreview(null);
        onClose();
    };

    const handleCancel = () => {
        setIsEditable(false);
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
                                    src={imagePreview}
                                    style={{ width: 200, height: 200 }}
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
                            {/* Mostrar la opción de subir nueva imagen solo si está en modo editable */}
                            {isEditable && (
                                <Box mt={2}>
                                    <Button variant="contained" component="label">
                                        Cambiar Imagen
                                        <input
                                            type="file"
                                            accept="imagepr/*"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nombre"
                                        value={editedFields.nombre || ''}
                                        onChange={(e) => setEditedFields({ ...editedFields, nombre: e.target.value.toUpperCase() })}
                                        fullWidth
                                        disabled={!isEditable}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Precio"
                                        value={editedFields.precio || ''}
                                        onChange={(e) => setEditedFields({ ...editedFields, precio: e.target.value.toUpperCase() })}
                                        fullWidth
                                        disabled={!isEditable}
                                    />
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
