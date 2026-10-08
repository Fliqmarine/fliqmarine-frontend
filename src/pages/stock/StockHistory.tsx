import { DescriptionOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import Header from './components/StockHistoryHeader';
import Filter from './components/StockHistoryFilter';
import StockHistoryTable, { type StockHistory } from './components/StockHistoryTable';

const stockStatuses = ['Stock', 'Hold', 'Pending', 'New', 'In Process'];

const stockHistorys: StockHistory[] = Array.from({ length: 17 }, (_, i) => {
  const id = i + 1;
  // First 5 rows cycle through each status; the rest are 'Stock' (same as original data)
  const stock_status = id <= 5 ? stockStatuses[i] : 'Stock';
  return {
    id,
    station: 'PVG-HUB',
    stock_no: 'PVG00021',
    stock_status,
    arrival_date: '25-06-2026',
    client: 'V.Ships Offshore (Asia) Pte Ltd',
    vessel: 'AM PASSION',
    supplier: 'BORPO MARINE',
    po: '6245-00149 / 6245-00149',
    pieces: '3',
    weight: '150',
    cbm: '0.250',
    cargo_value: '5000',
    transit_no: '5000',
    manifest: '5000',
    status: 'Active',
  };
});

export default function Index() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const filteredStockHistorys = stockHistorys.filter((stockHistory) => {
    const matchesSearch =
      stockHistory.station.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !status || stockHistory.status === status;

    return matchesSearch && matchesStatus;
  });

  const paginatedStockHistorys = filteredStockHistorys.slice(
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
    const pageIds = paginatedStockHistorys.map((stockHistory) => stockHistory.id);

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
    <Box sx={{ p: 1.0 }}>
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
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1, md: 2 },
            mb: 1,
            px: 1.5,
            py: 0.75,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'action.hover',
          }}
        >
          {/* Left: selected count + Create Manifest */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'space-between', md: 'flex-start' },
              gap: 1.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {selected.length} selected
            </Typography>

          </Box>

          {/* Right: export actions (2x2 grid on mobile, single row on larger screens) */}
          <Box
            sx={{
              display: { xs: 'grid', sm: 'flex' },
              gridTemplateColumns: { xs: 'repeat(2, 1fr)' },
              gap: 1,
            }}
          >
            <Button
              size="small"
              variant="contained"
              startIcon={<DescriptionOutlined sx={{ fontSize: 16 }} />}
              onClick={handleExportExcel}
              sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600 }}
            >
              Excel
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<PictureAsPdfOutlined sx={{ fontSize: 16 }} />}
              onClick={handleExportPdf}
              sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600 }}
            >
              PDF
            </Button>
          </Box>
        </Box>
      )}

      <StockHistoryTable
        stockHistorys={filteredStockHistorys}
        paginatedStockHistorys={paginatedStockHistorys}
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