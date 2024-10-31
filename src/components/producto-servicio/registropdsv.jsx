import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Grid, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import '../../class/gym.css';
import validation from '../../class/validacion';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Producto from '../../class/producto';
import Servicio from '../../class/servicio';

const defaultTheme = createTheme();

export default function RegistroProducto() {
    const [prodadd, setProdadd] = useState(new Producto());
    const [servicioadd, setServicio] = useState(new Servicio());
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [registroType, setRegistroType] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    useEffect(() => {
        if (submitted) {
            if (registroType === 'producto') {
                setErrors(validation(prodadd));
            } else {
                setErrors(validation(servicioadd));
            }
        }
    }, [prodadd, servicioadd, submitted, registroType]);

    const handleInput = (event) => {
        const { name, value } = event.target;
        const upperCaseValue = value.toUpperCase();
        setProdadd(prevprodadd => ({
            ...prevprodadd,
            [name]: upperCaseValue
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setProdadd(prevprodadd => ({
            ...prevprodadd,
            imagenpr: file
        }));
    };

    const handleInputS = (event) => {
        setServicio(prevservicio => ({
            ...prevservicio,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        const noHayErrores = Object.keys(errors).length === 0;

        if (noHayErrores) {
            let dataToSend;
            let url;

            if (registroType === 'producto') {
                dataToSend = new FormData();
                dataToSend.append('nombrep', prodadd.nombrep);
                dataToSend.append('preciop', prodadd.preciop);
                dataToSend.append('imagenpr', prodadd.imagenpr);
                url = 'http://cardiofit.ddns.net:8081/Producto/registro';
            } else {
                dataToSend = servicioadd;
                url = 'http://cardiofit.ddns.net:8081/Servicio/registro';
            }

            axios.post(url, dataToSend, {
                headers: registroType === 'producto' ? { 'Content-Type': 'multipart/form-data' } : {}
            })
                .then(res => {
                    setOpenNotification({
                        open: true,
                        message: res.data.message,
                        severity: 'success',
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                })
                .catch(err => {
                    let errorMessage = "ERROR AL REGISTRAR";
                    let severity = 'error';
                    if (err.response.status === 400) {
                        errorMessage = "CAMPOS OBLIGATORIOS";
                    } else if (err.response.status === 409) {
                        errorMessage = "YA SE ENCUENTRA REGISTRADO";
                    }
                    setOpenNotification({
                        open: true,
                        message: errorMessage,
                        severity: severity,
                    });
                });
        }
    };

    const handleRegistroTypeChange = (event) => {
        setRegistroType(event.target.value);
        setProdadd(new Producto());
        setServicio(new Servicio());
        setSubmitted(false);
        setErrors({});
    };

    return (
        <div className="logo-background">
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className="form-container">
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <AppRegistrationIcon />
                        </Avatar>
                        <Typography component="h1" variant="h6">
                            REGISTRAR PRODUCTO/SERVICIO
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    value={registroType}
                                    onChange={handleRegistroTypeChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="producto"
                                        control={<Radio />}
                                        label="Producto"
                                    />
                                    <FormControlLabel
                                        value="servicio"
                                        control={<Radio />}
                                        label="Servicio"
                                    />
                                </RadioGroup>
                            </FormControl>

                            {registroType && (
                                <>
                                    {registroType === 'producto' ? (
                                        <Grid container spacing={2}>
                                            <Grid item xs={5}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    name="nombrep"
                                                    label="Producto"
                                                    onChange={handleInput}
                                                    id="nombrep"
                                                    autoComplete="nombrep"
                                                    error={!!errors.nombrep}
                                                    helperText={errors.nombrep}
                                                    value={prodadd.nombrep || ''}
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField
                                                    required
                                                    margin="normal"
                                                    fullWidth
                                                    name="preciop"
                                                    type="number"
                                                    label="Precio($)"
                                                    onChange={handleInput}
                                                    id="preciop"
                                                    autoComplete="preciop"
                                                    error={!!errors.preciop}
                                                    helperText={errors.preciop}
                                                    value={prodadd.preciop || ''}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    margin="normal"
                                                    fullWidth
                                                    name="imagen"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Grid container spacing={2}>
                                            <Grid item xs={5}>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    name="nombresv"
                                                    label="Servicio"
                                                    onChange={handleInputS}
                                                    id="nombresv"
                                                    autoComplete="nombresv"
                                                    error={!!errors.nombresv}
                                                    helperText={errors.nombresv}
                                                    value={servicioadd.nombresv || ''}
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField
                                                    required
                                                    margin="normal"
                                                    fullWidth
                                                    name="preciosv"
                                                    type="number"
                                                    label="Precio($)"
                                                    onChange={handleInputS}
                                                    id="preciosv"
                                                    autoComplete="preciosv"
                                                    error={!!errors.preciosv}
                                                    helperText={errors.preciosv}
                                                    value={servicioadd.preciosv || ''}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                    <Grid item xs={5}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{ mt: 1, mb: 1 }}
                                        >
                                            Registrar
                                        </Button>
                                        <Snackbar open={openNotification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                                            <MuiAlert elevation={6} variant="filled" onClose={handleCloseNotification} severity={openNotification.severity}>
                                                {openNotification.message}
                                            </MuiAlert>
                                        </Snackbar>
                                    </Grid>
                                </>
                            )}
                        </Box>
                    </div>
                </Container>
            </ThemeProvider>
        </div>
    );
}
