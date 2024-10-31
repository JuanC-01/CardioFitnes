import React, { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../../class/gym.css';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ReportChart from './reporteChart';
import * as ExcelJS from 'exceljs';

const defaultTheme = createTheme();

export default function ReportesMes() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [chartData, setChartData] = useState([]);
  const [openNotification, setOpenNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const chartRef = useRef(null);

  const handleCloseNotification = () => {
    setOpenNotification({ ...openNotification, open: false });
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const fetchChartData = async (month) => {
    try {
      const formattedMonth = month.startOf('month').format('YYYY-MM-DD');

      // Fetch mensualidades
      const responseMensualidad = await axios.get(`http://cardiofit.ddns.net:8081/Reporte/consultar?fecha=${formattedMonth}`);
      const dataMensualidad = responseMensualidad.data;

      // Fetch ventas
      const responseVentas = await axios.get(`http://cardiofit.ddns.net:8081/Reporte/consultar-ventas?fecha=${formattedMonth}`);
      const dataVentas = responseVentas.data;

      // Combina los datos
      const combinedData = {
        totalServicioMensual: dataMensualidad[0]?.totalServicioMensual || 0,
        totalMonto: dataVentas.totalMonto || 0,
      };

      setChartData([combinedData]); // Establece el estado con los datos combinados
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setOpenNotification({ open: true, message: "Error al cargar los datos del gráfico", severity: 'error' });
    }
  };

  const fetchPDFReport = async () => {
    try {
      const formattedMonth = selectedMonth.startOf('month').format('YYYY-MM-DD');

      // Fetch mensualidades
      const response = await axios.get(`http://cardiofit.ddns.net:8081/Reporte/reporte?fecha=${formattedMonth}`);
      const reportData = response.data;

      // Fetch ventas detalladas
      const responseVentasdeta = await axios.get(`http://cardiofit.ddns.net:8081/Reporte/consultar-ventasdetallada?fecha=${formattedMonth}`);
      const dataVentas = responseVentasdeta.data;

      return { reportData, dataVentas }; // Devuelve ambos conjuntos de datos
    } catch (error) {
      console.error("Error al obtener el reporte PDF:", error);
      setOpenNotification({ open: true, message: "Error al cargar el reporte PDF", severity: 'error' });
    }
  };

  const generateExcel = async () => {
    const { reportData = [], dataVentas = [] } = await fetchPDFReport() || {}; // Manejar caso de undefined
    if (reportData.length === 0) {
      setOpenNotification({ open: true, message: "No hay datos para generar el Excel", severity: 'warning' });
      return; // Salir si no hay datos
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Mensual');

    // Encabezados para Detalle de Mensualidad
    worksheet.addRow(['DETALLE MENSUALIDAD']);
    worksheet.addRow(['Nombres', 'Apellidos', 'Fecha de Pago', 'Total Servicio Mensual']);

    // Agregar los datos de mensualidades
    reportData.forEach(item => {
      const { nombres, apellidos, fechaPago, totalServicioMensual } = item;
      worksheet.addRow([nombres, apellidos, fechaPago, totalServicioMensual]);
    });

    // Agregar una fila vacía para separación
    worksheet.addRow([]);

    // Encabezados para Detalle de Ventas
    worksheet.addRow(['DETALLE VENTAS']);
    worksheet.addRow(['Nombre Producto', 'Total Vendido', 'Total Monto']);

    // Agregar los datos de ventas detalladas
    dataVentas.forEach(venta => {
      worksheet.addRow([
        venta.nombreProducto,
        venta.totalVendido,
        venta.totalMonto
      ]);
    });

    // Obtener la imagen del gráfico como imagen base64
    const chartImage = chartRef.current.toBase64Image();

    // Incrustar imagen del gráfico en la hoja de Excel
    const imageId = workbook.addImage({
      base64: chartImage,
      extension: 'png',
    });

    worksheet.addImage(imageId, 'E1:H10'); // Ajusta el rango de celdas según sea necesario

    // Exportar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reporte_mensualidades.xlsx';
    link.click();
  };

  const handleFetchChart = () => {
    fetchChartData(selectedMonth);
  };

  return (
    <div className="logo-background">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="lg"> {/* Cambia a 'lg' para más espacio */}
          <CssBaseline />
          <div className="form-containerEG">
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['month', 'year']}
                      label="Selecciona el Mes"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      minDate={dayjs('2024-01-01')}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFetchChart}
                    sx={{ height: '60%', marginLeft: '8px' }}>
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={8}>
                <div style={{ width: '100%', height: '560px' }}> {/* Establecer altura */}
                  <ReportChart data={chartData} chartRef={chartRef} />
                </div>
              </Grid>
              <Grid item xs={2} container direction="column" spacing={1}>
                <TextField
                  label="Total Ventas"
                  value={chartData[0]?.totalMonto || 0}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Total Mensualidad"
                  value={chartData[0]?.totalServicioMensual || 0}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button
                  variant="contained"
                  onClick={generateExcel}
                  disabled={chartData.length === 0} // Deshabilitar si no hay datos
                  sx={{ marginTop: '8px' }}>
                  Generar Excel
                </Button>
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
