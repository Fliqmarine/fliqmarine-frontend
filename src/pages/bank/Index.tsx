import { DescriptionOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import Header from './components/Header';
import Filter from './components/Filter';
import BankTable, { type Bank } from './components/Table';

const banks: Bank[] = [
  { id: 1, name: 'Martrust Corporation Limited', code: '30001-102-04', acc_name: "Martrust-Fliq", acc_number: "73407829", balance: "25000", currency:"USD", status: 'Active' },
  { id: 1, name: 'ABU DHABI COMMERCIAL BANK ', code: '30001-101-02', acc_name: "ADCB-AED", acc_number: "13396324820001", balance: "10000", currency:"AED", status: 'InActive' },
  { id: 1, name: 'Martrust Corporation Limited', code: '30001-102-04', acc_name: "Martrust-Fliq", acc_number: "73407829", balance: "25000", currency:"USD", status: 'Active' },
  { id: 1, name: 'ABU DHABI COMMERCIAL BANK ', code: '30001-101-02', acc_name: "ADCB-AED", acc_number: "13396324820001", balance: "10000", currency:"AED", status: 'InActive' },
  { id: 1, name: 'Martrust Corporation Limited', code: '30001-102-04', acc_name: "Martrust-Fliq", acc_number: "73407829", balance: "25000", currency:"USD", status: 'Active' },
  { id: 1, name: 'ABU DHABI COMMERCIAL BANK ', code: '30001-101-02', acc_name: "ADCB-AED", acc_number: "13396324820001", balance: "10000", currency:"AED", status: 'InActive' },
  { id: 1, name: 'Martrust Corporation Limited', code: '30001-102-04', acc_name: "Martrust-Fliq", acc_number: "73407829", balance: "25000", currency:"USD", status: 'Active' },
  { id: 1, name: 'ABU DHABI COMMERCIAL BANK ', code: '30001-101-02', acc_name: "ADCB-AED", acc_number: "13396324820001", balance: "10000", currency:"AED", status: 'InActive' },
  { id: 1, name: 'Martrust Corporation Limited', code: '30001-102-04', acc_name: "Martrust-Fliq", acc_number: "73407829", balance: "25000", currency:"USD", status: 'Active' },
  { id: 1, name: 'ABU DHABI COMMERCIAL BANK ', code: '30001-101-02', acc_name: "ADCB-AED", acc_number: "13396324820001", balance: "10000", currency:"AED", status: 'InActive' },
];

export default function Index() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const filteredBanks = banks.filter((bank) => {
    const matchesSearch =
      bank.name.toLowerCase().includes(search.toLowerCase()) ||
      bank.code.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !status || bank.status === status;

    return matchesSearch && matchesStatus;
  });

  const paginatedBanks = filteredBanks.slice(
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
    const pageIds = paginatedBanks.map((bank) => bank.id);

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
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(0);
        }}
        onReset={() => {
          setSearch('');
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
              variant="contained"
              startIcon={<DescriptionOutlined sx={{ fontSize: 16 }} />}
              onClick={handleExportExcel}
              sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600 }}
            >
              Export Excel
            </Button>

            <Button
              size="small"
              variant="contained"
              startIcon={<PictureAsPdfOutlined sx={{ fontSize: 16 }} />}
              onClick={handleExportPdf}
              sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600 }}
            >
              Export PDF
            </Button>
          </Box>
        </Box>
      )}

      <BankTable
        banks={filteredBanks}
        paginatedBanks={paginatedBanks}
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