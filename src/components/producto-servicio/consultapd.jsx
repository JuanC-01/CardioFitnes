import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import UpdateIcon from '@mui/icons-material/Update';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ModalCPD from './modalcpd';
import ModalRegistroPD from './modalregistrop';
import ModalServicio from './modalservicio';
import { green } from '@mui/material/colors';
import { indigo } from '@mui/material/colors';
import '../../class/gym.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function ConsultaProducto() {
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(15);
    const [openNotification, setOpenNotification] = useState(false);
    const [cancelEdit, setCancelEdit] = useState(false);
    const [notificationSeverity, setNotificationSeverity] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [editModalConsPS, setEditModalConsPS] = useState(false);
    const [editModalRegPd, setEditModalRegPd] = useState(false);
    const [editedClientPeso, setEditedClientPeso] = useState(null);
    const [errors, setErrors] = useState({});
    const accent = green['500'];
    const accent1 = indigo['500'];
    const [isEditing, setIsEditing] = useState(false);
    const [editedFields, setEditedFields] = useState({});
    const [editedMenFields, setEditedMenFields] = useState({});
    const [tipoVista, setTipoVista] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [originalFields, setOriginalFields] = useState({});

    const openModal = (cliente) => {
        setEditModalConsPS(cliente);
        setOriginalFields(cliente);
        setEditModalConsPS(true);
    };

    const openModalRPd = (cliente) => {
        setEditModalRegPd(cliente);
        setOriginalFields(cliente);
        setEditModalRegPd(true);
    };

    const closeModal = () => {
        setEditModalConsPS(false);
        setEditedClientPeso(null);
    };

    const closeModalReg = () => {
        setEditModalRegPd(false);
        setEditedClientPeso(null);
    };

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    useEffect(() => {
        fetchData();
    }, [tipoVista]);

    const fetchData = async () => {
        if (!tipoVista) return; // Asegúrate de que tipoVista esté definido
        try {
            const response = await axios.get(tipoVista === 'productos'
                ? 'http://cardiofit.ddns.net:8081/Producto/consultar-productos'
                : 'http://cardiofit.ddns.net:8081/Servicio/consultar-servicios'
            );
            const dataWithIds = response.data.map((item, index) => ({
                ...item,
                id: item.id
            }));
            setRows(dataWithIds);
        } catch (error) {
            console.error(`Error al obtener ${tipoVista}:`, error);
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
            imagenpr: file.name
        }));
    };


    const filteredRows = useMemo(() => {
        if (!searchText) return rows;
        return rows.filter(row => {
            const matchesSearch = (row.cedula && row.cedula.toString().includes(searchText));
            return matchesSearch;
        });
    }, [rows, searchText]);

    const handlePago = (id) => {
        const cliente = rows.find(row => row.id === id);
        if (cliente) {
            openModal(cliente);
            setEditedFields({ ...cliente });
        }
    };

    const handleRegisPd = (id) => {
        const cliente = rows.find(row => row.id === id);
        if (cliente) {
            openModalRPd(cliente);
            setEditedFields({ ...cliente });
        }
    };


    const handleCancel = () => {
        setEditedFields({});
        setOpenNotification(true);
        setNotificationSeverity('error');
        setNotificationMessage('Acuatilazcion de datos Cancelado');
    };

    useEffect(() => {
        if (cancelEdit) {
            setOpenNotification(true);
            setCancelEdit(false);
        }
    }, [cancelEdit]);

    const handleSave = () => {
        const updatedFields = { ...originalFields };
        Object.keys(editedFields).forEach(key => {
            if (editedFields[key] !== undefined) {
                updatedFields[key] = editedFields[key];
            }
        });

        let formData = new FormData();
        formData.append('id', originalFields.id);

        Object.keys(updatedFields).forEach(key => {
            formData.append(`datos[${key}]`, updatedFields[key]);
        });

        if (newImage) {
            formData.append('imagenpr', newImage);
        } else {
            formData.append('imagenpr', originalFields.imagenpr);
        }

        if (JSON.stringify(updatedFields) === JSON.stringify(originalFields)) {
            setOpenNotification(true);
            setNotificationSeverity('info');
            setNotificationMessage('No se realizaron cambios');
            setIsEditing(false);
            openModal(false);
            return;
        }

        const noHayErrores = Object.keys(errors).length === 0;
        if (noHayErrores) {
            const url = tipoVista === 'productos'
                ? 'http://cardiofit.ddns.net:8081/Producto/update'
                : 'http://cardiofit.ddns.net:8081/Servicio/update';

            axios.post(url, formData)
                .then(res => {
                    setOpenNotification(true);
                    setNotificationSeverity('success');
                    setNotificationMessage(res.data.message);
                    closeModal();
                    fetchData();
                })
                .catch(error => {
                    console.error(`Error al actualizar ${tipoVista}:`, error);
                    setOpenNotification(true);
                    setNotificationSeverity('error');
                    setNotificationMessage(`Error al actualizar ${tipoVista}`);
                });
        } else {
            setOpenNotification(true);
            setNotificationSeverity('error');
            setNotificationMessage('Por favor, completa todos los campos requeridos');
        }
    };
    const handleRegistro = () => {
        const registroData = {
            cantidad: editedFields.cantidad,
        };

        const cliente = editedFields;
        const fk_idproducto = cliente?.id;

        console.log("Datos a registrar:", registroData, "fk_idproducto:", fk_idproducto);

        if (JSON.stringify(registroData) === JSON.stringify(originalFields)) {
            setOpenNotification(true);
            setNotificationSeverity('info');
            setNotificationMessage('No se realizaron cambios');
            setIsEditing(false);
            closeModalReg();
            return;
        }

        const noHayErrores = Object.keys(errors).length === 0;
        if (noHayErrores && fk_idproducto) {
            const url = `http://cardiofit.ddns.net:8081/Producto/registrar-compra/${fk_idproducto}`;

            axios.post(url, registroData)
                .then(res => {
                    setOpenNotification(true);
                    setNotificationSeverity('success');
                    setNotificationMessage(res.data.message);
                    closeModalReg();
                    fetchData(); // Actualiza los datos si es necesario
                })
                .catch(error => {
                    console.error(`Error al registrar la compra:`, error);
                    setOpenNotification(true);
                    setNotificationSeverity('error');
                    setNotificationMessage(`Error al registrar la compra`);
                });
        } else {
            setOpenNotification(true);
            setNotificationSeverity('error');
            setNotificationMessage('Por favor, completa todos los campos requeridos');
        }
    };

    const columns = [
        {
            field: 'imagen',
            headerName: '',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => (
                tipoVista === 'productos' ? (
                    <img
                        src={`http://cardiofit.ddns.net:8081/backend/image/${params.row.imagen}`}
                        alt="Producto"
                        style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                ) : null
            ),
        },
        { field: 'id', headerName: 'ID', width: 10, headerClassName: 'custom-header' },
        { field: 'nombre', headerName: 'NOMBRE', width: 200, headerClassName: 'custom-header' },
        { field: 'precio', headerName: 'PRECIO', width: 100, headerClassName: 'custom-header' },
        ...(tipoVista === 'productos' ? [
            { field: 'cantidad', headerName: 'CANTIDAD', width: 100, headerClassName: 'custom-header' },
        ] : []),
        {
            field: 'editar', headerName: 'EDIT', width: 100, headerClassName: 'custom-header',
            renderCell: (params) => (
                <div>
                    {isEditing && editedClientPeso && editedClientPeso.id === params.row.id ? (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<UpdateIcon />}
                            onClick={handleSave}
                        />
                    ) : (
                        <Button
                            variant="contained"
                            style={{ backgroundColor: accent, color: '#fff' }}
                            startIcon={<EditNoteIcon />}
                            onClick={() => handlePago(params.row.id)}
                        />
                    )
                    }
                </div>
            ),
        },
        {
            field: 'agg', headerName: 'AGG', width: 100, headerClassName: 'custom-header',
            renderCell: (params) => (
                tipoVista === 'productos' ? (
                    <div>
                        {isEditing && editedClientPeso && editedClientPeso.id === params.row.id ? (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<UpdateIcon />}
                                onClick={handleSave}
                            />
                        ) : (
                            <Button
                                variant="contained"
                                style={{ backgroundColor: accent1, color: '#fff' }}
                                startIcon={<ShoppingCartIcon />}
                                onClick={() => handleRegisPd(params.row.id)}
                            />
                        )

                        }
                    </div>
                ) : null
            ),
        },
    ];

    return (
        <div className="logo-background">
            <div className="table-consulta">
                <div className="fixed-background">
                    <div className="header-container">
                        <div className='logo'></div>
                    </div>
                    <ModalCPD
                        open={editModalConsPS}
                        onClose={closeModal}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        editedFields={editedFields}
                        setEditedFields={setEditedFields}
                        imagePreview={imagePreview}
                        setImagePreview={setImagePreview}
                        handleImageChange={handleImageChange}
                        errors={errors}
                    />
                    <ModalRegistroPD
                        open={editModalRegPd}
                        onClose={closeModalReg}
                        onSave={handleRegistro}
                        onCancel={handleCancel}
                        editedFields={editedFields}
                        setEditedFields={setEditedFields}
                        imagePreview={imagePreview}
                        setImagePreview={setImagePreview}
                        handleImageChange={handleImageChange}
                        errors={errors}
                    />
                    <div className={tipoVista === 'productos' ? 'table-containercon' : 'table-containercon1'}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <label>
                                <input
                                    type="radio"
                                    value="productos"
                                    checked={tipoVista === 'productos'}
                                    onChange={() => setTipoVista('productos')}
                                />
                                Productos
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="servicios"
                                    checked={tipoVista === 'servicios'}
                                    onChange={() => setTipoVista('servicios')}
                                />
                                Servicios
                            </label>
                        </div>
                        <DataGrid
                            rows={filteredRows}
                            columns={columns.filter(column => !(column.field === 'agg' && tipoVista !== 'productos'))}
                            pageSize={pageSize}
                            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                            pageSizeOptions={[15, 25, 50, 100]}
                            style={{ height: 'calc(90vh - 200px)', width: '100%' }}
                        />
                        <Snackbar
                            open={openNotification}
                            autoHideDuration={3000}
                            onClose={handleCloseNotification}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <MuiAlert
                                elevation={6}
                                variant="filled"
                                onClose={handleCloseNotification}
                                severity={notificationSeverity}
                            >
                                {notificationMessage}
                            </MuiAlert>
                        </Snackbar>
                    </div>
                </div>
            </div>
        </div>
    );
}
