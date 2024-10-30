import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import UpdateIcon from '@mui/icons-material/Update';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ModalMesualidad from './modalmensualidad';
import { blue } from '@mui/material/colors';
import '../../class/gym.css';
import dayjs from 'dayjs';

export default function Mensualidad() {
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(15);
    const [openNotification, setOpenNotification] = useState(false);
    const [cancelEdit, setCancelEdit] = useState(false);
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [editModalPesoOpen, setEditModalPesoOpen] = useState(false);
    const [editedClientPeso, setEditedClientPeso] = useState(null);
    const [errors, setErrors] = useState({});
    const accent = blue['500'];
    const [isEditing, setIsEditing] = useState(false);
    const [editedFields, setEditedFields] = useState({});
    const [editedMenFields, setEditedMenFields] = useState({});
    const [selectedHorario, setSelectedHorario] = useState('');
    const [servicio, setServicio] = useState([]);
    const [selectServicio, setSelectServicio] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [mensualidadesCargadas, setMensualidadesCargadas] = useState(false);

    const openModalMensualidad = (cliente) => {
        setEditedClientPeso(cliente);
        setEditModalPesoOpen(true);
    };

    const closeModalMensualidad = () => {
        setEditModalPesoOpen(false);
        setEditedClientPeso(null);
    };
    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setEditedMenFields(editedMenFields => ({
            ...editedMenFields,
            fecha_pago: date ? dayjs(date).format('YYYY-MM-DD') : null
        }));
    };
    const getRowClassName = (params) => {
        const estado = params.row.estadom; 
        if (estado === 'DEBE') {
            return 'row-debe';
        }else if (estado === 'PAGADO' || estado === 'P') {
            return 'row-pagado'; 
        }
    };

    useEffect(() => {
        axios.get('http://cardiofit.ddns.net:80/Cliente/consultar-clientes')
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
        const fetchUltimaMensualidad = async () => {
            try {
                const clientesConMensualidad = await Promise.all(rows.map(async (cliente) => {
                    try {
                        const mensualidadResponse = await axios.get(`http://cardiofit.ddns.net:80/Mensualidad/ultimomensualidad/${cliente.cedula}`);
                        if (mensualidadResponse.data) {
                            return {
                                ...cliente,
                                fechapg: mensualidadResponse.data.fechapg,
                                fechapx: mensualidadResponse.data.fechapx,
                                estadom: mensualidadResponse.data.estadom,
                            };
                        } else {
                            return {
                                ...cliente,
                                fechapg: null,
                                fechapx: null,
                                estadom: null,
                            };
                        }
                    } catch (error) {
                        console.warn(`No se encontró ninguna mensualidad para la cédula: ${cliente.cedula}`);
                        return {
                            ...cliente,
                            fechapg: null,
                            fechapx: null,
                            estadom: null,
                        };
                    }
                }));

                setRows(clientesConMensualidad);
                setMensualidadesCargadas(true); // Marca que ya hemos cargado las mensualidades
            } catch (error) {
                console.error('Error al obtener la última mensualidad:', error);
            }
        };

        if (rows.length > 0 && !mensualidadesCargadas) {
            fetchUltimaMensualidad();
        }
    }, [rows, mensualidadesCargadas]);

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const response = await axios.get('http://cardiofit.ddns.net:80/Servicio/consultar-servicio');
                setServicio(response.data);
            } catch (error) {
                console.error('Error al obtener servicios:', error);
            }
        };
        fetchServicio();
    }, []);

    const handleServicio = (event, newValue) => {
        if (newValue) {
            console.log('Servicio Id:', newValue.value);
            setSelectServicio(newValue);
            setEditedMenFields(editedMenFields => ({ ...editedMenFields, fk_idservicio: newValue.value }));
        }
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

    const handlePago = (cedula) => {
        const cliente = rows.find(row => row.cedula === cedula);
        if (cliente) {
            openModalMensualidad(cliente);
            setEditedFields({ ...cliente });
        }
    };

    const handleCancel = () => {
        setEditedFields({});
        setOpenNotification(true);
        setNotificationSeverity('error');
        setNotificationMessage('Registro de Pago Cancelado');
    };

    useEffect(() => {
        if (cancelEdit) {
            setOpenNotification(true);
            setCancelEdit(false);
        }
    }, [cancelEdit]);

    const handleSave = () => {
        // Verificar que todos los campos requeridos estén completos
        if (editedMenFields.fecha_pago && editedMenFields.fk_idservicio) {
            const formData = {
                fecha_pago: editedMenFields.fecha_pago,
                fk_cedula: editedClientPeso.cedula, // Asumiendo que editedClientPeso tiene la cedula del cliente
                fk_idservicio: editedMenFields.fk_idservicio,
            };

            // Hacer la petición al servidor
            axios.post('http://cardiofit.ddns.net:80/Mensualidad/registro', formData)
                .then(res => {
                    const message = res.data.message;
                    setOpenNotification(true);
                    setNotificationSeverity('success');
                    setNotificationMessage(message);

                    // Hacer la consulta de la última mensualidad para actualizar la tabla
                    return axios.get(`http://cardiofit.ddns.net:80/Mensualidad/ultimomensualidad/${editedClientPeso.cedula}`);
                })
                .then(mensualidadResponse => {
                    if (mensualidadResponse.data) {
                        // Actualizar los datos de la tabla con la nueva mensualidad
                        setRows(prevRows => prevRows.map(cliente =>
                            cliente.cedula === editedClientPeso.cedula
                                ? {
                                    ...cliente,
                                    fechapg: mensualidadResponse.data.fechapg,
                                    fechapx: mensualidadResponse.data.fechapx,
                                    estadom: mensualidadResponse.data.estadom,
                                }
                                : cliente
                        ));
                    }

                    closeModalMensualidad(); // Cerrar modal después de actualizar
                })
                .catch(error => {
                    console.error('Error al registrar mensualidad o actualizar la tabla:', error);
                    setOpenNotification(true);
                    setNotificationSeverity('error');
                    setNotificationMessage('Error al registrar mensualidad o actualizar la tabla');
                });
        } else {
            // Notificación de error si faltan campos
            setOpenNotification(true);
            setNotificationSeverity('error');
            setNotificationMessage('Por favor, completa todos los campos requeridos');
        }
    };


    //Tabla
    const columns = [
        { field: 'nombres', headerName: 'NOMBRES', width: 200, headerClassName: 'custom-header' },
        { field: 'apellidos', headerName: 'APELLIDOS', width: 200, headerClassName: 'custom-header' },
        { field: 'horario', headerName: 'HORARIO', width: 130, headerClassName: 'custom-header' },
        { field: 'fechapg', headerName: 'PAGÓ', width: 130, headerClassName: 'custom-header',
            renderCell: (params) => params.row.fechapg ? dayjs(params.row.fechapg).format('DD/MM/YYYY') : '',
        },
        { field: 'fechapx', headerName: 'SIGUIENTE PAGO', width: 130, headerClassName: 'custom-header',
            renderCell: (params) => params.row.fechapx ? dayjs(params.row.fechapx).format('DD/MM/YYYY') : '',
        },
        { field: 'estadom', headerName: 'ESTADO', width: 150, headerClassName: 'custom-header',
            renderCell: (params) => params.row.estadom || '', 
        },
        { field: 'mensualidad', headerName: 'PAGAR MENSUALIDAD', width: 170, headerClassName: 'custom-header',
            renderCell: (params) => (
                <div>
                    {isEditing && editedClientPeso && editedClientPeso.cedula === params.row.cedula ? (
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
                            style={{ backgroundColor: accent, color: '#fff' }}
                            startIcon={<AttachMoneyIcon />}
                            onClick={() => handlePago(params.row.cedula)}
                        >
                        </Button>
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
                    <ModalMesualidad
                        open={editModalPesoOpen}
                        onClose={closeModalMensualidad}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        editedFields={editedFields}
                        editedMenFields={editedMenFields}
                        setEditedMenFields={setEditedMenFields}
                        selectedDate={selectedDate}
                        handleDateChange={handleDateChange}
                        servicio={servicio}
                        selectServicio={selectServicio}
                        handleServicio={handleServicio}
                        errors={errors}
                    />
                    <div className="table-containermen">
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
                            getRowClassName={getRowClassName}
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