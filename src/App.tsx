import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { Dashboard } from './pages/dashboard/Index';
import User from './pages/user/Index';
import HubLocation from './pages/hubLocation/Index';
import Currency from './pages/currency/Index';
import TariffMaster from './pages/tariff/Index';
import AirportCode from './pages/airportCode/Index';
import Bank from './pages/bank/Index';
import Cargo from './pages/cargo/Index';
import Vendor from './pages/vendor/Index';
import GlCodeParent from './pages/glParent/Index';
import GlCodeChild from './pages/glChild/Index';
import GlCodeSubChild from './pages/glSubChild/Index';
import HubList from './pages/hub/Index';
import ClientList from './pages/client/Index';
import VesselList from './pages/vessel/Index';
import ClientCreate from './pages/client/Create';
import VesselCreate from './pages/vessel/Create';
import HubCreate from './pages/hub/Create';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Main application */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/master/users" element={<User />} />
          <Route path="/master/hub-locations" element={<HubLocation />} />
          <Route path="/master/currencies" element={<Currency />} />
          <Route path="/master/tariff-masters" element={<TariffMaster />} />
          <Route path="/master/airport-codes" element={<AirportCode />} />
          <Route path="/master/banks" element={<Bank />} />
          <Route path="/master/cargos" element={<Cargo />} />
          <Route path="/master/vendors" element={<Vendor />} />
          <Route path="/master/gl_code_parents" element={<GlCodeParent />} />
          <Route path="/master/gl_code_children" element={<GlCodeChild />} />
          <Route path="/master/gl_code_sub_children" element={<GlCodeSubChild />} />
          <Route path="/master/clients" element={<ClientList />} />
          <Route path="/master/clients/create" element={<ClientCreate />} />
          <Route path="/master/vessels/create" element={<VesselCreate />} />
          <Route path="/master/vessels" element={<VesselList />} />
          <Route path="/master/hubs" element={<HubList />} />
          <Route path="/master/hubs/create" element={<HubCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;