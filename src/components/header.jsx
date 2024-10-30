import {
  LaptopChromebook as LaptopChromebookIcon, Home as HomeIcon, PersonAdd as PersonAddIcon, Woman as Woman2Icon, PersonSearch as PersonSearchIcon,
  CalendarMonth as CalendarMonthIcon, MonetizationOn as MonetizationOnIcon, ShoppingCart as ShoppingCartIcon, Assessment as AssessmentIcon, 
  CurrencyExchange as CurrencyExchangeIcon, Storefront as StorefrontIcon,ScreenSearchDesktop as ScreenSearchDesktopIcon, 
  AppRegistration as AppRegistrationIcon
} from '@mui/icons-material';

import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

const Header = () => {
  const onClick = (e) => {
    //console.log('click ', e);
  };

  return (
    <div>
      <Menu
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <Menu.Item key="1" icon={<HomeIcon />}>
          <Link to="/home">Home</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<LaptopChromebookIcon />} title="Administrar">
          <SubMenu key="g1" icon={<Woman2Icon />} title="Clientes">
            <Menu.Item key="2" icon={< PersonAddIcon />} ><Link to="/RegistroCliente">Registrar Cliente</Link></Menu.Item>
            <Menu.Item key="3" icon={<PersonSearchIcon />} ><Link to="/Consultacliente">Consultar Cliente</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="g2" icon={<CalendarMonthIcon />} title="Mensualidad">
            <Menu.Item key="4" icon={<MonetizationOnIcon />} ><Link to="/PagosMensualidad">Pagos Mensualidad</Link></Menu.Item>
            <Menu.Item key="5" icon={<ShoppingCartIcon />} ><Link to="/VentaProductos">Venta Productos</Link></Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="g3" icon={<AssessmentIcon />} title="Reportes">
          <Menu.Item key="6" icon={<CurrencyExchangeIcon />} ><Link to="/Reportes">Reportes</Link></Menu.Item>
        </SubMenu>
        <Menu.Divider />
        <SubMenu key="sub2" icon={<StorefrontIcon />} title="Productos-Servicios">
            <Menu.Item key="7" icon={<AppRegistrationIcon />} ><Link to="/RegistroPdSv">Registrar</Link></Menu.Item>
            <Menu.Item key="8" icon={<ScreenSearchDesktopIcon />} ><Link to="/ConsultarPdSv">Consultar</Link></Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
};

export default Header;
