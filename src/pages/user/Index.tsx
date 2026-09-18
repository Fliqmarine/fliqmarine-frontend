import { DescriptionOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import Header from './components/Header';
import Filter from './components/Filter';
import UserTable, { type User } from './components/Table';

const users: User[] = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'David Wilson', email: 'david.wilson@example.com', role: 'Manager', status: 'Active' },
  { id: 3, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'User', status: 'Active' },
  { id: 4, name: 'Michael Brown', email: 'michael.brown@example.com', role: 'Manager', status: 'Inactive' },
  { id: 5, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'User', status: 'Active' },
  { id: 6, name: 'Daniel Miller', email: 'daniel.miller@example.com', role: 'User', status: 'Active' },
  { id: 7, name: 'Sophia Anderson', email: 'sophia.anderson@example.com', role: 'Admin', status: 'Active' },
  { id: 8, name: 'James Taylor', email: 'james.taylor@example.com', role: 'User', status: 'Inactive' },
  { id: 9, name: 'Olivia Thomas', email: 'olivia.thomas@example.com', role: 'Manager', status: 'Active' },
  { id: 10, name: 'William Moore', email: 'william.moore@example.com', role: 'User', status: 'Active' },
];

export default function Index() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = !role || user.role === role;
    const matchesStatus = !status || user.status === status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleSelectRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAllOnPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pageIds = paginatedUsers.map((user) => user.id);

    if (event.target.checked) {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleExportExcel = () => {
    console.log('Export to Excel', selected);
  };

  const handleExportPdf = () => {
    console.log('Export to PDF', selected);
  };

  return (
    <Box sx={{ p: 1.5 }}>
      <Header />
      <Filter
        search={search}
        role={role}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        onRoleChange={(value) => {
          setRole(value);
          setPage(0);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(0);
        }}
        onReset={() => {
          setSearch('');
          setRole('');
          setStatus('');
          setPage(0);
        }}
      />

      {selected.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
            px: 1.5,
            py: 0.75,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'action.hover',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
            {selected.length} selected
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DescriptionOutlined sx={{ fontSize: 16 }} />}
              onClick={handleExportExcel}
              sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600 }}
            >
              Export Excel
            </Button>

            <Button
              size="small"
              variant="outlined"
              startIcon={<PictureAsPdfOutlined sx={{ fontSize: 16 }} />}
              onClick={handleExportPdf}
              sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600 }}
            >
              Export PDF
            </Button>
          </Box>
        </Box>
      )}

      <UserTable
        users={filteredUsers}
        paginatedUsers={paginatedUsers}
        page={page}
        rowsPerPage={rowsPerPage}
        selected={selected}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onSelectRow={handleSelectRow}
        onSelectAllOnPage={handleSelectAllOnPage}
      />
    </Box>
  );
}