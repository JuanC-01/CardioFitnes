import React from 'react';
import { Modal, Button, Typography } from '@mui/material';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, weight }) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <div style={{ padding: '20px', background: 'white', borderRadius: '8px', maxWidth: '400px', margin: 'auto', marginTop: '200px' }}>
                <Typography variant="h6">Confirmar Eliminación</Typography>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas eliminar <strong>{weight} kg</strong>?
                </Typography>
                <div style={{ marginTop: '20px' }}>
                    <Button onClick={onClose} color="secondary" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm} color="primary" variant="contained" style={{ marginLeft: '10px' }}>
                        Confirmar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;
