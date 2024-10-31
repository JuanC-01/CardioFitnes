import React, { } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import WeightHistoryChart from './WeightChart';
import SaveIcon from '@mui/icons-material/Save';

export default function ModalPeso({ open, onClose, onSave, onCancel, editedFields, errors, editedPesoFields, setEditedPesoFields }) {

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
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
                            {editedFields.imagen && (
                                <img
                                    src={`http://cardiofit.ddns.net:8081/backend/image/${editedFields.imagen}`}
                                    style={{ width: 250, height: 250 }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container spacing={2}>
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
                                    <TextField
                                        label="Peso Kg"
                                        type="number"
                                        onChange={(e) => setEditedPesoFields({ ...editedPesoFields, peso: e.target.value })}
                                        error={!!errors.peso}
                                        helperText={errors.peso}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        onClick={onSave}
                                    >
                                    </Button>
                                </Grid>
                                <Grid item xs={1}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<CancelIcon />}
                                        onClick={() => {
                                            onCancel();
                                            onClose();
                                        }}
                                    >
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <WeightHistoryChart
                                    cedula={editedFields.cedula}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}
