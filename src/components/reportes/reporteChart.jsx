import React, { useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const ReportChart = ({ data, chartRef }) => {
  if (!Array.isArray(data)) {
    console.error("Data no es un array:", data);
    return null;
  }

  const chartData = {
    labels: ['MENSUALIDAD', 'VENTAS'],
    datasets: [
      {
        label: 'Reporte de Servicios y Ventas',
        data: [
          data.reduce((acc, item) => acc + item.totalServicioMensual, 0),
          data.reduce((acc, item) => acc + item.totalMonto, 0) || 0,
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="chart-container">
      <Pie ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ReportChart;
