import { DescriptionOutlined, PictureAsPdfOutlined, ContentCopy, CloudDownload } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import Header from './components/Header';
import Filter from './components/Filter';
import ManifestTable, { type Manifest } from './components/Table';

// Sample rows (same as the design). Replace with your API data.
const sampleManifests = [
  { prefix: 'FM-DOCS-26-10', vessel: 'TOPAZ OB, TOPAZ TOBOL', mode: 'Release', origin: 'DXB-STEADFAST (Dubai)', destination: 'DXB (United Arab Emirates)', packages: '3', weight: '6', activation: '08-10-2026', deadline: '09-10-2026', key_account_manager: 'Basith' },
  { prefix: 'FM-DOCS-26-10', vessel: 'JAG ANJALI', mode: 'Release', origin: 'DXB-STEADFAST (Dubai)', destination: 'DXB (United Arab Emirates)', packages: '1', weight: '2', activation: '08-10-2026', deadline: '09-10-2026', key_account_manager: 'Basith' },
  { prefix: 'FM-DOCS-26-10', vessel: 'MP MR TANKER 2, ROBERTA B', mode: 'Release', origin: 'DXB-STEADFAST (Dubai)', destination: 'DXB (United Arab Emirates)', packages: '6', weight: '28', activation: '08-10-2026', deadline: '09-10-2026', key_account_manager: 'Basith' },
  { prefix: 'FM-DOCS-26-10', vessel: 'GCL YAMUNA, GCL SABARMATI', mode: 'Release', origin: 'DXB-STEADFAST (Dubai)', destination: 'DXB (United Arab Emirates)', packages: '3', weight: '10', activation: '08-10-2026', deadline: '09-10-2026', key_account_manager: 'Basith' },
  { prefix: 'FM-DOCS-26-10', vessel: 'MUMBAI', mode: 'Release', origin: 'DXB-STEADFAST (Dubai)', destination: 'DXB (United Arab Emirates)', packages: '1', weight: '1', activation: '08-10-2026', deadline: '09-10-2026', key_account_manager: 'Basith' },
  { prefix: 'FM-SJ-26-10', vessel: 'ANAHITA', mode: 'Courier', origin: 'OSA - JML (Osaka)', destination: 'AMS (Netherlands)', packages: '1', weight: '1', activation: '08-10-2026', deadline: '10-10-2026', key_account_manager: 'Sanjana' },
  { prefix: 'FM-PH-26-10', vessel: 'SSI BRILLIANT', mode: 'Release', origin: 'PVG-HUB (Shanghai)', destination: 'BNE (Australia)', packages: '1', weight: '31', activation: '01-10-2026', deadline: '02-10-2026', key_account_manager: 'Pragadeesh', manifest_status: 'PreAlert Stage 3' },
  { prefix: 'FM-SJ-26-10', vessel: 'JAG LAXMAN', mode: 'Onboard Delivery', origin: 'SIN-HUB (Singapore)', destination: 'SIN (Singapore)', packages: '1', weight: '17', activation: '09-10-2026', deadline: '10-10-2026', key_account_manager: 'Sanjana', has_charges: true },
  { prefix: 'FM-SJ-26-10', vessel: 'JAG LAXMAN', mode: 'Onboard Delivery', origin: 'SIN-HUB (Singapore)', destination: 'SIN (Singapore)', packages: '10', weight: '152', activation: '08-10-2026', deadline: '10-10-2026', key_account_manager: 'Sanjana', has_charges: true },
  { prefix: 'FM-SJ-26-10', vessel: 'YASMIN', mode: 'Air', origin: 'MAA 2 (Chennai)', destination: 'ZAG (Croatia)', packages: '2', weight: '197', activation: '09-10-2026', deadline: '10-10-2026', key_account_manager: 'Sanjana' },
];

const manifests: Manifest[] = Array.from({ length: 17 }, (_, i): Manifest => {
  const id = i + 1;
  const { prefix, manifest_status, has_charges, ...rest } = sampleManifests[i % sampleManifests.length] as (typeof sampleManifests)[number] & {
    manifest_status?: string;
    has_charges?: boolean;
  };
  return {
    id,
    date: '08-10-2026',
    manifest_status: manifest_status ?? 'Manifest Sent',
    manifest_no: `${prefix}-${1066 - i}`,
    ...rest,
    internal_status: '',
    has_charges,
    status: 'Active',
  };
});

export default function Index() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const filteredManifests = manifests.filter((manifest) => {
    const term = search.toLowerCase();
    const matchesSearch =
      manifest.manifest_no.toLowerCase().includes(term) ||
      manifest.vessel.toLowerCase().includes(term) ||
      manifest.origin.toLowerCase().includes(term) ||
      manifest.destination.toLowerCase().includes(term);

    const matchesStatus = !status || manifest.status === status;

    return matchesSearch && matchesStatus;
  });

  const paginatedManifests = filteredManifests.slice(
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
    const pageIds = paginatedManifests.map((manifest) => manifest.id);

    if (event.target.checked) {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleCreateManifest = () => {
    console.log('Create Manifest', selected);
  };

  const handleDownload = () => {
    console.log('Download', selected);
  };

  const handleCopy = () => {
    console.log('Copy', selected);
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

      <ManifestTable
        manifests={filteredManifests}
        paginatedManifests={paginatedManifests}
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