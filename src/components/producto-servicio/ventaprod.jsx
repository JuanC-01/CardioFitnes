import React, { useState, useEffect } from 'react';
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, Snackbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import '../../class/gym.css';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const defaultTheme = createTheme();

export default function VentaProducto() {
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [prodOptions, setProdOptions] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [totalVenta, setTotalVenta] = useState(0); 

    const [openNotification, setOpenNotification] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const handleCloseNotification = () => {
        setOpenNotification({ ...openNotification, open: false });
    };

    useEffect(() => {
        axios.get('http://cardiofit.ddns.net:80/Producto/consultar-productos')
            .then(res => setProdOptions(res.data))
            .catch(err => console.error('Error al obtener productos:', err));
    }, []);

    const handleProductoChange = (event, newValue) => {
        setSelectedProducto(newValue);
        if (newValue) {
            setImagePreview(newValue.imagenpr);
            setQuantity(1);
            setTotalVenta(newValue.precio); 
        }
    };

    const handleIncrement = () => {
        if (selectedProducto && quantity < selectedProducto.cantidad) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            setTotalVenta(selectedProducto.precio * newQuantity);
        }
    };

    const handleDecrement = () => {
        if (selectedProducto && quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            setTotalVenta(selectedProducto.precio * newQuantity);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true);
        const noHayErrores = Object.keys(errors).length === 0;
    
        if (noHayErrores) {
            try {
                // Realiza la solicitud para registrar la venta
                const response = await axios.post(`http://cardiofit.ddns.net:80/Producto/registrar-venta/${selectedProducto.id}`, {
                    cantidad: quantity,
                });
                
                // Manejo de respuesta exitosa
                setOpenNotification({
                    open: true,
                    message: response.data.message,
                    severity: 'success',
                });
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                let errorMessage = "ERROR AL REGISTRAR VENTA";
                let severity = 'error';

                if (err.response && err.response.status === 400) {
                    errorMessage = err.response.data.message || "CAMPOS OBLIGATORIOS"; 
                }
                
                setOpenNotification({
                    open: true,
                    message: errorMessage,
                    severity: severity,
                });
            }
        } else {
            setOpenNotification({
                open: true,
                message: "ERROR", 
                severity: 'error',
            });
        }
    };
    

    return (
        <div className="logo-background">
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className="form-containerE">
                        <Typography component="h2" variant="h7" gutterBottom>
                            VENTA PRODUCTOS
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={4} container justifyContent="center" alignItems="center">
                                {imagePreview ? (
                                    <img src={imagePreview} style={{ width: 200, height: 200 }} alt="Vista previa" />
                                ) : (
                                    selectedProducto && (
                                        <img src={`http://cardiofit.ddns.net:80/backend/image/${selectedProducto.imagen}`} style={{ width: 200, height: 200 }} alt="Producto" />
                                    )
                                )}
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            value={selectedProducto}
                                            onChange={handleProductoChange}
                                            options={prodOptions}
                                            getOptionLabel={(option) => option.nombre || ''}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Producto" variant="outlined" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField label="Nombre" value={selectedProducto?.nombre || ''} fullWidth disabled />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField label="Precio" value={selectedProducto?.precio || ''} fullWidth disabled />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField label="Cantidad" value={selectedProducto?.cantidad || ''} fullWidth disabled />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Button onClick={handleDecrement} size="small" disabled={!selectedProducto}>
                                                <RemoveIcon />
                                            </Button>
                                            <TextField
                                                id="quantity"
                                                label="Venta"
                                                type="number"
                                                value={quantity}
                                                variant="outlined"
                                                disabled
                                                InputProps={{ readOnly: true }}
                                                style={{ width: '120px', marginLeft: '10px', marginRight: '10px' }}
                                            />
                                            <Button onClick={handleIncrement} size="small" disabled={!selectedProducto}>
                                                <AddIcon />
                                            </Button>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField label="Total Venta" value={totalVenta} fullWidth disabled />
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button type="submit" fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                                            Vender
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Snackbar open={openNotification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                            <MuiAlert elevation={6} variant="filled" onClose={handleCloseNotification} severity={openNotification.severity}>
                                {openNotification.message}
                            </MuiAlert>
                        </Snackbar>
                    </div>
                </Container>
            </ThemeProvider>
        </div>
    );
}
