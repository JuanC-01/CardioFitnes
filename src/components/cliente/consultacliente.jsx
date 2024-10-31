import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateIcon from '@mui/icons-material/Update';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ModalCliente from './modalcliente';
import ModalPeso from './modalcontrolpeso';
import { green } from '@mui/material/colors';
import '../../class/gym.css';
import dayjs from 'dayjs';

export default function DataTable() {
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(15);
    const [openNotification, setOpenNotification] = useState(false);
    const [cancelEdit, setCancelEdit] = useState(false);
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedClient, setEditedClient] = useState(null);
    const [editModalPesoOpen, setEditModalPesoOpen] = useState(false);
    const [editedClientPeso, setEditedClientPeso] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [horario, setHorario] = useState([]);
    const [selectHorario, setSelectedhorario] = useState(null);
    const [eps, setEps] = useState([]);
    const [selectEps, setSelectedEps] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const accent = green['A700'];
    const [originalFields, setOriginalFields] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedFields, setEditedFields] = useState({});
    const [editedPesoFields, setEditedPesoFields] = useState({});
    const [selectedHorario, setSelectedHorario] = useState('');


    const openEditModal = (cliente) => {
        setEditedClient(cliente);
        setOriginalFields(cliente);
        setEditModalOpen(true);
    };

    const openPesoModal = (cliente) => {
        setEditedClientPeso(cliente);
        setEditModalPesoOpen(true);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setEditedFields(editedFields => ({
            ...editedFields,
            fechanto: date ? dayjs(date).format('YYYY-MM-DD') : null
        }));
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setIsEditing(false);
        setEditedClient(null);
    };
    const closePesoModal = () => {
        setEditModalPesoOpen(false);
        setEditedClientPeso(null);
    };
    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    useEffect(() => {
        axios.get('http://cardiofit.ddns.net:8081/Cliente/consultar-clientes')
            .then(response => {
                const clientesConId = response.data.map(cliente => ({
                    ...cliente,
                    id: cliente.cedula
                }));
                setRows(clientesConId);
            })
            .catch(error => {
                console.error('Error al obtener los datos de los clientes:', error);
            });
    }, []);

    useEffect(() => {
        const fetchHorario = async () => {
            try {
                const response = await axios.get('http://cardiofit.ddns.net:8081/Cliente/consultar-horario');
                setHorario(response.data);
            } catch (error) {
                console.error('Error al obtener horarios:', error);
            }
        };
        fetchHorario();
    }, []);

    const handleHorario = (event, newValue) => {
        if (newValue) {
            setSelectedhorario(newValue);
            setEditedFields(editedFields => ({ ...editedFields, fk_idhorario: newValue.value }));
        }
    };

    useEffect(() => {
        const fetchEps = async () => {
            try {
                const response = await axios.get('http://cardiofit.ddns.net:8081/Eps/consultar-eps');
                setEps(response.data);
            } catch (error) {
                console.error('Error al obtener eps:', error);
            }
        };
        fetchEps();
    }, []);


    const handleEps = (event, newValue) => {
        if (newValue) {
            console.log('EPS seleccionado - ID:', newValue.value);
            setSelectedEps(newValue);
            setEditedFields(editedFields => ({ ...editedFields, fk_ideps: newValue.value }));
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
        setEditedFields(editedFields => ({
            ...editedFields,
            imagenp: file.name
        }));
    };
    //Filtro de Busqueda
    const filteredRows = useMemo(() => {
        if (!searchText && !selectedHorario) return rows;
        const searchTerm = searchText.toLowerCase();
        return rows.filter(row => {
            const nombreCompleto = `${row.nombres} ${row.apellidos}`.toLowerCase();
            const matchesSearch = nombreCompleto.includes(searchTerm) || row.cedula.toString().includes(searchText);
            const matchesHorario = selectedHorario ? row.horario === selectedHorario : true;
            return matchesSearch && matchesHorario;
        });
    }, [rows, searchText, selectedHorario]);

    //Modificar datos cliente
    const handleEdit = (cedula) => {
        const cliente = rows.find(row => row.cedula === cedula);
        if (cliente) {
            openEditModal(cliente);
            setEditedFields({ ...cliente });
        }
    };

    const handleEditPeso = (cedula) => {
        const cliente = rows.find(row => row.cedula === cedula);
        if (cliente) {
            openPesoModal(cliente);
            setEditedFields({ ...cliente });
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedFields({});
        setOpenNotification(true);
        setNotificationSeverity('info');
        setNotificationMessage('Actualización de Datos Cancelada');
    };

    const handleCancelPeso = () => {
        setEditedFields({});
        setOpenNotification(true);
        setNotificationSeverity('info');
        setNotificationMessage('Registro de Peso Cancelado');
    };

    useEffect(() => {
        if (cancelEdit) {
            setOpenNotification(true);
            setCancelEdit(false);
        }
    }, [cancelEdit]);

    //Actualizar datos Cliente
    const handleSave = () => {
        const updatedFields = { ...originalFields };
        Object.keys(editedFields).forEach(key => {
            if (editedFields[key] !== undefined) {
                updatedFields[key] = editedFields[key];
            }
        });

        let formData = new FormData();
        formData.append('cedula', originalFields.cedula);

        Object.keys(updatedFields).forEach(key => {
            formData.append(`datosCliente[${key}]`, updatedFields[key]);
        });

        if (newImage) {
            formData.append('imagenp', newImage);
        } else {
            formData.append('imagenp', originalFields.imagen);
        }

        if (!editedFields.fk_idhorario || editedFields.fk_idhorario === '') {
            formData.append('datosCliente[fk_idhorario]', originalFields.fk_idhorario);
        }
        if (!editedFields.fk_ideps || editedFields.fk_ideps === '') {
            formData.append('datosCliente[fk_ideps]', originalFields.fk_ideps);
        }

        if (JSON.stringify(updatedFields) === JSON.stringify(originalFields)) {
            setOpenNotification(true);
            setNotificationSeverity('info');
            setNotificationMessage('No se realizaron cambios');
            setIsEditing(false);
            setEditModalOpen(false);
            return;
        }

        axios.post('http://cardiofit.ddns.net:8081/Cliente/actualizar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(res => {
                const message = res.data.message;
                if (message === "Cliente actualizado exitosamente") {
                    setOpenNotification(true);
                    setNotificationSeverity('success');
                    setNotificationMessage('Datos Cliente Actualizados');
                    setTimeout(() => {
                        axios.get('http://cardiofit.ddns.net:8081/Cliente/consultar-clientes')
                            .then(response => {
                                const clientesConId = response.data.map(cliente => ({
                                    ...cliente,
                                    id: cliente.cedula
                                }));
                                setRows(clientesConId);
                                setIsEditing(false);
                            })
                            .catch(err => {
                                console.error('Error al obtener los datos de los clientes:', err);
                            });
                    }, 500);
                } else {
                    console.error("Error en la respuesta del servidor:", message);
                }
            })
            .catch(error => {
                console.error('Error al actualizar cliente:', error);
            })
    };
    const handleSavePeso = () => {
        if (editedPesoFields.peso) {
            const formData = {
                cedula: editedClientPeso.cedula,
                pesokg: editedPesoFields.peso,
            };

            axios.post('http://cardiofit.ddns.net:8081/Cliente/registrar-peso', formData)
                .then(res => {
                    const message = res.data.message;
                    setOpenNotification(true);
                    setNotificationSeverity('success');
                    setNotificationMessage(message);
                    closePesoModal();
                })
                .catch(error => {
                    console.error('Error al registrar peso:', error);
                    setOpenNotification(true);
                    setNotificationSeverity('error');
                    setNotificationMessage('Error al registrar peso');
                });
        } else {
            setOpenNotification(true);
            setNotificationSeverity('error');
            setNotificationMessage('Por favor, introduce un peso válido');
        }
    };

    //Tabla
    const columns = [
        {
            field: 'imagen', headerName: '', width: 100, headerClassName: 'custom-header',
            renderCell: (params) => (
                <img
                    src={`http://cardiofit.ddns.net:8081/backend/image/${params.row.imagen}`}
                    alt="Cliente"
                    style={{ width: 50, height: 50, borderRadius: '50%' }}
                />
            )
        },
        { field: 'cedula', headerName: 'DOCUMENTO', width: 150, headerClassName: 'custom-header' },
        { field: 'nombres', headerName: 'NOMBRES', width: 200, headerClassName: 'custom-header' },
        { field: 'apellidos', headerName: 'APELLIDOS', width: 200, headerClassName: 'custom-header' },
        { field: 'horario', headerName: 'HORARIO', width: 130, headerClassName: 'custom-header' },
        { field: 'telefono', headerName: 'TELEFONO', width: 130, headerClassName: 'custom-header' },
        { field: 'nombreEPS', headerName: 'EPS', width: 130, headerClassName: 'custom-header' },
        {
            field: 'editar', headerName: 'VISUALIZAR', width: 100, headerClassName: 'custom-header',
            renderCell: (params) => (
                <div>
                    {isEditing && editedClient && editedClient.cedula === params.row.cedula ? (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<UpdateIcon />}
                            onClick={handleSave}
                        >
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleEdit(params.row.cedula)}
                        >
                        </Button>
                    )}
                </div>
            ),
        },

        {
            field: 'peso', headerName: 'CONTROL PESO', width: 120, headerClassName: 'custom-header',
            renderCell: (params) => (
                <div>
                    {isEditing && editedClientPeso && editedClientPeso.cedula === params.row.cedula ? (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<UpdateIcon />}
                            onClick={handleSavePeso}
                        >
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: accent, color: '#fff' }}
                                startIcon={<FitnessCenterIcon />}
                                onClick={() => handleEditPeso(params.row.cedula)}
                            >
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="logo-background">
            <div className="table-consulta">
                <div className="fixed-background" >
                    <div className="header-container">
                        <div className='logo'></div>
                    </div>
                    <ModalCliente
                        open={editModalOpen}
                        onClose={closeEditModal}
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                        editedClient={editedClient}
                        selectedDate={selectedDate}
                        handleDateChange={handleDateChange}
                        editedFields={editedFields}
                        setEditedFields={setEditedFields}
                        selectHorario={selectHorario}
                        handleHorario={handleHorario}
                        horario={horario}
                        selectEps={selectEps}
                        handleEps={handleEps}
                        eps={eps}
                        handleImageChange={handleImageChange}
                        imagePreview={imagePreview}
                        setImagePreview={setImagePreview}
                        errors={errors}
                    />
                    <ModalPeso
                        open={editModalPesoOpen}
                        onClose={closePesoModal}
                        onSave={handleSavePeso}
                        onCancel={handleCancelPeso}
                        editedClientPeso={editedClientPeso}
                        editedFields={editedFields}
                        editedPesoFields={editedPesoFields}
                        setEditedPesoFields={setEditedPesoFields}
                        errors={errors}
                    />

                    <div className="table-container">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <TextField
                                label="Buscar por Nombres y Apellidos o CC Persona"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon style={{ marginRight: 8, color: 'rgba(0, 0, 0, 0.60)' }} />
                                    ),
                                }}
                                style={{ marginRight: 16 }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: 8 }}>
                                        <input
                                            type="radio"
                                            value="MAÑANA 1"
                                            checked={selectedHorario === 'MAÑANA 1'}
                                            onChange={(e) => setSelectedHorario(e.target.value)}
                                        />
                                        M1
                                    </label>
                                    <label style={{ marginRight: 8 }}>
                                        <input
                                            type="radio"
                                            value="MAÑANA 2"
                                            checked={selectedHorario === 'MAÑANA 2'}
                                            onChange={(e) => setSelectedHorario(e.target.value)}
                                        />
                                        M2
                                    </label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: 8 }}>
                                        <input
                                            type="radio"
                                            value="NOCHE 1"
                                            checked={selectedHorario === 'NOCHE 1'}
                                            onChange={(e) => setSelectedHorario(e.target.value)}
                                        />
                                        N1
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="NOCHE 2"
                                            checked={selectedHorario === 'NOCHE 2'}
                                            onChange={(e) => setSelectedHorario(e.target.value)}
                                        />
                                        N2
                                    </label>
                                </div>
                            </div>
                        </div>

                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                            pageSizeOptions={[15, 25, 50, 100]}
                            style={{ height: 'calc(100vh - 200px)', width: '100%' }}
                        />

                        <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                            <MuiAlert onClose={handleCloseNotification} severity={notificationSeverity} sx={{ width: '100%' }}>
                                {notificationMessage}
                            </MuiAlert>
                        </Snackbar>
                    </div>

                </div >
            </div >
        </div >
    );
}