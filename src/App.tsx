import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { Dashboard } from './pages/dashboard/Index';
import User from './pages/user/Index';
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
          <Route path="/users" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;