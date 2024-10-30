import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Grid} from '@mui/material';
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
  const [openNotification, setOpenNotification] = useState(false);
  const [openErrorNotification, setOpenErrorNotification] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [availabilityEMessage, setAvailabilityEMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [epsOptions, setEpsOptions] = useState([]);
  const [selectedEps, setSelectedEps] = useState(null);
  const [otherEps, setOtherEps] = useState('');
  const [isOtroEnabled, setIsOtroEnabled] = useState(false);
  const [horarioOptions, setHorarioOptions] = useState([]);
  const [selectedhorario, setSelectedhorario] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const currentYear = dayjs().year();
  const maxDate = dayjs(`${currentYear}-12-31`);

  useEffect(() => {
    axios.get('http://localhost:8081/Eps/consultar-eps')
      .then(res => {
        const optionsWithOther = [...res.data, { value: 'Otro', label: 'Otro' }];
        setEpsOptions(optionsWithOther);
      })
      .catch(err => console.error('Error al obtener EPS:', err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8081/Cliente/consultar-horario')
      .then(res => setHorarioOptions(res.data))
      .catch(err => console.error('Error al obtener Horarios:', err));
  }, []);

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  const handleCloseErrorNotification = () => {
    setOpenErrorNotification(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCliente(prevCliente => ({
      ...prevCliente,
      fechanto: date
    }));
  };

  useEffect(() => {
    if (submitted) {
      setErrors(validation(cliente));
    }
  }, [cliente, submitted]);

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
      if (newValue.value === 'Otro') {
        setIsOtroEnabled(true);
      } else {
        setIsOtroEnabled(false);
        setCliente(prevCliente => ({
          ...prevCliente,
          fk_ideps: newValue.value
        }));
      }
    }
  };

  const handleOtroChange = (event) => {
    setOtherEps(event.target.value);
    setCliente(prevCliente => ({
      ...prevCliente,
      fk_ideps: event.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    setImageFile(file); 

    // Mostrar detalles de la imagen seleccionada
    if (file) {
        console.log("Imagen seleccionada:", {
            name: file.name,
            type: file.type,
            size: file.size, // Tamaño del archivo en bytes
        });
    } else {
        console.log("No se ha seleccionado ninguna imagen.");
    }

    setCliente(prevCliente => ({
        ...prevCliente,
        imagenp: file 
    }));
};



  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    // Validar si se seleccionó 'Otra' y se ingresó un nombre
    if (selectedEps === 'other' && !otherEps) {
      setAvailabilityMessage("Por favor, ingresa el nombre de la nueva EPS");
      return;
    }

    // Si se selecciona 'Otra', primero registra la nueva EPS
    if (selectedEps === 'other') {
      axios.post('http://localhost:8081/Eps/registrar', { nombre_eps: otherEps })
        .then(res => {
          const newEpsId = res.data.eps;
          setCliente(prevCliente => ({
            ...prevCliente,
            fk_ideps: newEpsId
          }));
          submitClientData();
        })
        .catch(err => {
          console.error("Error al registrar nueva EPS:", err);
          setOpenErrorNotification(true);
        });
    } else {
      submitClientData();
    }
  };

  const submitClientData = () => {
    const noHayErrores = Object.keys(errors).length === 0;
  
    if (noHayErrores) {
      const formData = new FormData();
      formData.append('cedula', cliente.cedula);
      formData.append('nombres', cliente.nombres);
      formData.append('apellidos', cliente.apellidos);
      formData.append('fechanto', dayjs(cliente.fechanto).format('YYYY-MM-DD'));
      formData.append('fk_ideps', cliente.fk_ideps);
      formData.append('fk_idhorario', cliente.fk_idhorario);
      formData.append('telefono', cliente.telefono);
      formData.append('pesoinicial', cliente.pesoinicial);
      formData.append('talla', cliente.talla);
      formData.append('imagenp', cliente.imagenp);
    
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
  
      axios.post('http://localhost:8081/Cliente/registrar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        const message = res.data.message;
        if (message === 'Registro cliente exitoso') {
          setOpenNotification(true);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setAvailabilityEMessage(message);
          setTimeout(() => {
            setAvailabilityEMessage('');
          }, 2000);
        }
      })
      .catch(err => {
        console.error("Error en la solicitud:", err);
        setOpenErrorNotification(true);
      });
    }
  };
  

  return (
    <div className="logo-background">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className="form-containerE">
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <PersonAddIcon />
            </Avatar>
            <Typography component="h2" variant="h7">
              REGISTRO
            </Typography>
            <Typography component="h4" variant="h7">
              DATOS PERSONALES
            </Typography>
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
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    options={epsOptions}
                    getOptionLabel={(option) => option.label}
                    onChange={handleEpsChange}
                    renderInput={(params) => (
                      <TextField {...params}
                        label="EPS"
                        variant="outlined"
                        error={!!errors.fk_ideps}
                        helperText={errors.fk_ideps} />
                    )}
                  />
                </Grid>
                {isOtroEnabled && (
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Especifique"
                      value={otherEps}
                      onChange={handleOtroChange}
                    />
                  </Grid>
                )}
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
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
                    required
                    fullWidth
                    name="pesoinicial"
                    label="Peso incial"
                    type="number"
                    value={cliente.pesoinicial}
                    onChange={handleInput}
                    id="pesoinicial"
                    inputProps={{ maxLength: 45 }}
                    autoComplete="pesoinicial"
                    error={!!errors.pesoinicial}
                    helperText={errors.pesoinicial}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="talla"
                    label="Talla"
                    type="number"
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
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
              <MuiAlert elevation={6} variant="filled" onClose={handleCloseNotification} severity="success">
                Registro cliente exitoso
              </MuiAlert>
            </Snackbar>
            <Snackbar open={openErrorNotification} autoHideDuration={6000} onClose={handleCloseErrorNotification}>
              <MuiAlert elevation={6} variant="filled" onClose={handleCloseErrorNotification} severity="error">
                Error al registrar el cliente
              </MuiAlert>
            </Snackbar>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}
