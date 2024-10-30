import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './home';
import Header from './header';
import RegistroCliente from './cliente/registrocliente';
import Consultacliente from './cliente/consultacliente';
import RegistroPdSv from './producto-servicio/registropdsv';
import ConsultarPdSv from './producto-servicio/consultapd';
import PagosMensualidad from './cliente/mensualidad';
import Reportes from './reportes/reporte';
import VentaProductos from './producto-servicio/ventaprod';
const Conteiner = () => {
  const location = useLocation();



  const getComponent = () => {
    switch (location.pathname) {
      case '/Home':
        return <Home />;
      case '/RegistroCliente':
        return <RegistroCliente />;
      case '/Consultacliente':
        return <Consultacliente />;
      case '/PagosMensualidad':
        return <PagosMensualidad />;
      case '/RegistroPdSv':
        return <RegistroPdSv />;
      case '/ConsultarPdSv':
        return <ConsultarPdSv />;
        case '/VentaProductos':
        return <VentaProductos />;
      case '/Reportes':
        return <Reportes />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Header />
      <div style={{ flex: 1, padding: '20px' }}>
        {getComponent()}
      </div>
    </div>
  );
};

export default Conteiner;
