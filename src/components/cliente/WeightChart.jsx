import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { TextField, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationModal from '../mdals/modaldelete'; 

Chart.register(...registerables);

const WeightChart = ({ cedula, isEditing }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Registro de Peso',
                data: [],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    });
    const [selectedYear, setSelectedYear] = useState(null);
    const [years, setYears] = useState([]);
    const [editableWeight, setEditableWeight] = useState(null);
    const [editedWeight, setEditedWeight] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedWeightId, setSelectedWeightId] = useState(null);
    const [weightIds, setWeightIds] = useState([]);
    const [weightToDelete, setWeightToDelete] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const fetchWeightData = async () => {
        try {
            const response = await axios.get(`http://cardiofit.ddns.net:80/Cliente/historial-peso/${cedula}`, {
                params: { año: selectedYear }
            });
            const data = response.data;

            const labels = data.map(entry => {
                const date = new Date(entry.fecha);
                return date.toLocaleDateString('es-ES');
            });
            const dataValues = data.map(entry => entry.peso);
            const ids = data.map(entry => entry.idpeso);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Registro de Peso',
                        data: dataValues,
                        fill: false,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                    },
                ],
            });
            setWeightIds(ids);
        } catch (error) {
            console.error('Error fetching weight data:', error);
        }
    };

    const fetchYears = async () => {
        try {
            const response = await axios.get(`http://cardiofit.ddns.net:80/Cliente/historial-peso/${cedula}`);
            const distinctYears = [...new Set(response.data.map(entry => new Date(entry.fecha).getFullYear()))];
            setYears(distinctYears);
        } catch (error) {
            console.error('Error fetching years:', error);
        }
    };

    const handleChartClick = (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const selectedWeight = chartData.datasets[0].data[index];
            const selectedIdPeso = weightIds[index];

            setEditableWeight(selectedWeight);
            setEditedWeight(selectedWeight);
            setSelectedIndex(index);
            setSelectedWeightId(selectedIdPeso);
        }
    };

    const handleSave = async () => {
        if (selectedIndex !== null && selectedWeightId !== null) {
            const updatedData = [...chartData.datasets[0].data];
            updatedData[selectedIndex] = parseFloat(editedWeight);

            setChartData({
                ...chartData,
                datasets: [
                    {
                        ...chartData.datasets[0],
                        data: updatedData,
                    },
                ],
            });

            try {
                await axios.post(`http://cardiofit.ddns.net:80/Cliente/actualizar-peso`, {
                    idpeso: selectedWeightId,
                    cedula,
                    nuevoPeso: editedWeight,
                });
                console.log("Peso actualizado correctamente");
            } catch (error) {
                console.error('Error al actualizar el peso:', error);
            }

            setEditableWeight(null);
            setSelectedIndex(null);
            setSelectedWeightId(null);
        } else {
            console.error('Error: No se ha seleccionado un ID de peso.');
        }
    };

    const openDeleteConfirmationModal = (weight) => {
        setWeightToDelete(weight); 
        setDeleteModalOpen(true);
    };

    // Confirmar eliminación
    const handleConfirmDelete = async () => {
        if (selectedWeightId !== null) {
            try {
                await axios.delete(`http://cardiofit.ddns.net:80/Cliente/eliminar-peso`, {
                    data: { idpeso: selectedWeightId, cedula }
                });
                console.log("Peso eliminado correctamente");
                const updatedData = chartData.datasets[0].data.filter((_, index) => index !== selectedIndex);
                const updatedLabels = chartData.labels.filter((_, index) => index !== selectedIndex);
                const updatedIds = weightIds.filter((_, index) => index !== selectedIndex);

                setChartData({
                    labels: updatedLabels,
                    datasets: [
                        {
                            ...chartData.datasets[0],
                            data: updatedData,
                        },
                    ],
                });
                setWeightIds(updatedIds);
                setDeleteModalOpen(false);
            } catch (error) {
                console.error('Error al eliminar el peso:', error);
            }

            setEditableWeight(null);
            setSelectedIndex(null);
            setSelectedWeightId(null);
            setWeightToDelete(null);
        } else {
            console.error('Error: No se ha seleccionado un ID de peso para eliminar.');
        }
    };

    const handleCancelEdit = () => {
        setEditableWeight(null);
        setSelectedIndex(null);
        setSelectedWeightId(null);
    };

    useEffect(() => {
        fetchWeightData();
        fetchYears();
    }, [cedula, selectedYear, isEditing]);

    const options = {
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Fecha',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Peso (kg)',
                },
            },
        },
        onClick: (event, elements) => handleChartClick(event, elements),
    };

    return (
        <div>
            <h2>Historial de Peso</h2>
            <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear || ''}>
                <option value="">Últimos 12 registros</option>
                {years.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                ))}
            </select>

            {chartData.labels.length > 0 ? (
                <>
                    <Line data={chartData} options={options} />
                    {editableWeight !== null && (
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Editar Peso"
                                    value={editedWeight}
                                    onChange={(e) => setEditedWeight(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={1.5}>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<SaveAsIcon />}
                                            onClick={handleSave}
                                        >
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<CloseIcon />}
                                            onClick={handleCancelEdit}
                                        >
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => openDeleteConfirmationModal(editableWeight)} 
                                >
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </>
            ) : (
                <p>No hay datos disponibles para mostrar.</p>
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)} 
                onConfirm={handleConfirmDelete}
                weight={weightToDelete}
            />
        </div>
    );
};

export default WeightChart;
