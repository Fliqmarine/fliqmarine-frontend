import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Typography } from '@mui/material';
import Login from './pages/Login';

// Placeholder page — swap for a real component when you build each screen
function Placeholder({ title }: { title: string }) {
  return <Typography variant="h5">{title}</Typography>;
}

function Unauthorized() {
  return <div>You don't have access to this page.</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

        {/* Everything inside here shares the Sidebar + Topbar via <Layout> */}
        {/* <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/users" element={<UserIndex />} />
          <Route path="/master/clients" element={<Placeholder title="Master · Clients" />} />
          <Route path="/master/vendors" element={<Placeholder title="Master · Vendors" />} />
          <Route path="/master/locations" element={<Placeholder title="Master · Locations" />} />

          <Route path="/stocks/create" element={<CreateStock/>} />
          <Route path="/stocks/adjustments" element={<Placeholder title="Stocks · Adjustments" />} />

          <Route path="/manifest/create" element={<Placeholder title="Manifest · Create" />} />
          <Route path="/manifest/list" element={<Placeholder title="Manifest · All Manifests" />} />

          <Route path="/prealerts/new" element={<Placeholder title="Prealerts · New" />} />
          <Route path="/prealerts/list" element={<Placeholder title="Prealerts · All" />} />

          <Route path="/finance/invoices" element={<Placeholder title="Finance · Invoices" />} />
          <Route path="/finance/payments" element={<Placeholder title="Finance · Payments" />} />

          <Route path="/finance/pl" element={<Placeholder title="Finance · Profit/Loss" />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;