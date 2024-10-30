import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Container from '@mui/material/Container';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../../class/gym.css';
import validation from '../../class/validacion';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cliente from '../../class/cliente';
import Autocomplete from '@mui/material/Autocomplete';

const defaultTheme = createTheme();

export default function Registrocliente() {
  const [cliente, setCliente] = useState(new Cliente());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [epsOptions, setEpsOptions] = useState([]);
  const [selectedEps, setSelectedEps] = useState(null);
  const [horarioOptions, setHorarioOptions] = useState([]);
  const [selectedhorario, setSelectedhorario] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const currentYear = dayjs().year();
  const maxDate = dayjs(`${currentYear}-12-31`);

  const [openNotification, setOpenNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleCloseNotification = () => {
    setOpenNotification({ ...openNotification, open: false });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCliente(prevCliente => ({
      ...prevCliente,
      fechanto: date
    }));
  };

  useEffect(() => {
    axios.get('http://cardiofit.ddns.net:80/Eps/consultar-eps')
      .then(res => setEpsOptions(res.data))
      .catch(err => console.error('Error al obtener Horarios:', err));
  }, []);
  useEffect(() => {
    axios.get('http://cardiofit.ddns.net:80/Cliente/consultar-horario')
      .then(res => setHorarioOptions(res.data))
      .catch(err => console.error('Error al obtener Horarios:', err));
  }, []);

  useEffect(() => {
    if (submitted) {
      const errors = validation(cliente, selectedhorario);
      setErrors(errors);
    }
  }, [cliente, selectedhorario, submitted]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    const upperCaseValue = value.toUpperCase();
    setCliente(prevCliente => ({
      ...prevCliente,
      [name]: upperCaseValue
    }));
  };

  const handleHorario = (event, newValue) => {
    setSelectedhorario(newValue);
    if (newValue) {
      setCliente(prevCliente => ({
        ...prevCliente,
        fk_idhorario: newValue.value
      }));
    }
  };

  const handleEpsChange = (event, newValue) => {
    setSelectedEps(newValue);
    if (newValue) {
      setCliente(prevCliente => ({
        ...prevCliente,
        fk_ideps: newValue.value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    /*
    if (file) {
        console.log("Imagen seleccionada:", {
            name: file.name,
            type: file.type,
            size: file.size,
        });
    } else {
        console.log("No se ha seleccionado ninguna imagen.");
    }
    */
    setCliente(prevCliente => ({
      ...prevCliente,
      imagenp: file
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const formData = new FormData();
    formData.append('cedula', cliente.cedula);
    formData.append('nombres', cliente.nombres);
    formData.append('apellidos', cliente.apellidos);
    formData.append('fechanto', dayjs(cliente.fechanto).format('YYYY-MM-DD'));
    formData.append('fk_ideps', cliente.fk_ideps);
    formData.append('fk_idhorario', cliente.fk_idhorario);
    formData.append('telefono', cliente.telefono);
    formData.append('talla', cliente.talla);
    formData.append('imagenp', cliente.imagenp);

    axios.post('http://cardiofit.ddns.net:80/Cliente/registrar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
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
          errorMessage = "CEDULA YA SE ENCUENTRA REGISTRADA";
        }
        setOpenNotification({
          open: true,
          message: errorMessage,
          severity: severity,
        });
      });
  };

  return (
    <div className="logo-background">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className="form-containerE">
            <div className="header-container">
            <div> 
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <PersonAddIcon />
            </Avatar>
                <Typography component="h2" variant="h7">
                  REGISTRO
                </Typography>
                <Typography component="h4" variant="h7">
                  DATOS PERSONALES
                </Typography>
              </div>
              <div className='logo'></div>
            
            </div>
           
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="cedula"
                    label="N° Documento"
                    value={cliente.cedula}
                    name="cedula"
                    type="number"
                    autoComplete="cedula"
                    autoFocus
                    onChange={handleInput}
                    error={!!errors.cedula}
                    helperText={errors.cedula}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="nombres"
                    label="Nombres"
                    value={cliente.nombres}
                    onChange={handleInput}
                    id="nombres"
                    inputProps={{ maxLength: 30 }}
                    error={!!errors.nombres}
                    helperText={errors.nombres}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="apellidos"
                    label="Apellidos"
                    value={cliente.apellidos}
                    onChange={handleInput}
                    id="apellidos"
                    inputProps={{ maxLength: 30 }}
                    error={!!errors.apellidos}
                    helperText={errors.apellidos}
                  />
                </Grid>
                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Fecha de Nacimiento"
                      value={selectedDate}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} error={!!errors.fechanto} helperText={errors.fechanto} />
                      )}
                      maxDate={maxDate}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    value={selectedhorario}
                    onChange={(event, newValue) => handleHorario(event, newValue)}
                    options={horarioOptions}
                    renderInput={(params) => (
                      <TextField {...params}
                        label="Horario"
                        required
                        variant="outlined"
                        error={!!errors.selectedhorario}
                        helperText={errors.selectedhorario}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    value={selectedEps}
                    onChange={(event, newValue) => handleEpsChange(event, newValue)}
                    options={epsOptions}
                    renderInput={(params) => (
                      <TextField {...params}
                        label="Eps"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="telefono"
                    label="Telefono"
                    type="number"
                    value={cliente.telefono}
                    onChange={handleInput}
                    id="telefono"
                    inputProps={{ maxLength: 10 }}
                    autoComplete="telefono"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="talla"
                    label="Direccion"
                    value={cliente.talla}
                    onChange={handleInput}
                    id="talla"
                    inputProps={{ maxLength: 45 }}
                    autoComplete="talla"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="imagen"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                    Registrar
                  </Button>
                </Grid>
              </Grid>
            </Box>
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
