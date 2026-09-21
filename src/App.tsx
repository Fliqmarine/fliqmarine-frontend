import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { Dashboard } from './pages/dashboard/Index';
import User from './pages/user/Index';
import HubLocation from './pages/hubLocation/Index';
import Currency from './pages/currency/Index';
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;