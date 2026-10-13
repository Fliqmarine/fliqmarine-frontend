import { DescriptionOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import Header from './components/AllStageHeader';
import Filter from './components/AllStageFilter';
import AllStageTable, { type AllStage } from './components/AllStageTable';

// Sample rows (same as the design). Replace with your API data.
const allRows: AllStage[] = [
  { id: 1, stage: 'Stage 1', date: '12-10-2026', ref_no: 'FM-ST-26-08-1132', vessels: ['JAG PRACHI'], hub: 'IAH-MFS (MARINE FREIGHT SERVICES)', mode: 'Onboard Delivery', origin: 'IAH-MFS (United States)', destination: 'HOU (United States)', packages: 37, weight: 788, awb_no: 'FM-ST-26-08-1132', carrier: '', etd: '20-08-2026', eta: '21-08-2026', prealert_docs: 2, awb_docs: 1, pod_docs: 0, distance: 4.8 },
  { id: 2, stage: 'Stage 2', date: '12-10-2026', ref_no: 'FM-NS-26-10-1054', vessels: ['AM PROGRESS'], hub: 'PVG-HUB (FLIQ MARINE CHINA (SHANGHAI))', mode: 'Air', origin: 'PVG-HUB (China)', destination: 'LPA (Spain)', packages: 2, weight: 112, awb_no: '020 7614370', carrier: 'lufthansa cargo', etd: '13-10-2026', eta: '13-10-2026', prealert_docs: 2, awb_docs: 1, pod_docs: 0, distance: 6598 },
  { id: 3, stage: 'Stage 3', date: '12-10-2026', ref_no: 'FM-ST-26-10-1088', vessels: ['BOCHEM MARENGO'], hub: 'MAA 2 (BLUE CRATE LOGISTICS LLP)', mode: 'Air', origin: 'MAA 2 (India)', destination: 'MCT (Oman)', packages: 4, weight: 12970, awb_no: '157-00602184', carrier: 'QR', etd: '30-09-2026', eta: '02-10-2026', prealert_docs: 2, awb_docs: 2, pod_docs: 1, distance: 6800 },
  { id: 4, stage: 'Stage 1', date: '12-10-2026', ref_no: 'FM-SMJ-26-10-1046', vessels: ['BAHRI BULK', 'BAHRI TRADER', 'BAHRI WAFI'], hub: 'DXB-STEADFAST (Steadfast Cargo Services LLC)', mode: 'Sea', origin: 'DXB-STEADFAST (United Arab Emirates)', destination: 'SIN (Singapore)', packages: 12, weight: 1360, awb_no: 'DAHKLFSIN2626113', carrier: 'AN YANG', etd: '30-09-2026', eta: '19-10-2026', prealert_docs: 2, awb_docs: 4, pod_docs: 0, distance: 3631 },
  { id: 5, stage: 'Stage 3', date: '12-10-2026', ref_no: 'FM-AO-26-10-1019', vessels: ['TMB Carina'], hub: 'COURIER (Fliq Courier)', mode: 'Hand Carry', origin: 'COURIER (India)', destination: 'ARN (Sweden)', packages: 1, weight: 3, awb_no: 'FM-AO-26-10-1019', carrier: 'FM-AO-26-10-1019', etd: '12-10-2026', eta: '12-10-2026', prealert_docs: 2, awb_docs: 1, pod_docs: 1, distance: 6102 },
  { id: 6, stage: 'Stage 4', date: '12-10-2026', ref_no: 'FM-BJ-26-10-1084', vessels: ['GLOVIS LANDER'], hub: 'IAH-MFS (MARINE FREIGHT SERVICES)', mode: 'Air', origin: 'IAH-MFS (United States)', destination: 'AMS (Netherlands)', packages: 4, weight: 33, awb_no: '016 IAH 95679511', carrier: 'UNITED CARGO', etd: '09-10-2026', eta: '10-10-2026', prealert_docs: 2, awb_docs: 1, pod_docs: 1, distance: 4411 },
  { id: 7, stage: 'Stage 2', date: '12-10-2026', ref_no: 'FM-AO-26-10-1075', vessels: ['Fairchem Aldebaran'], hub: 'AMS1 (BTS LOGISTICS B.V. )', mode: 'Air', origin: 'AMS1 (Netherlands)', destination: 'LPA (Spain)', packages: 4, weight: 52, awb_no: '612-12949996', carrier: 'OR', etd: '10-10-2026', eta: '10-10-2026', prealert_docs: 2, awb_docs: 1, pod_docs: 1, distance: 920 },
  { id: 8, stage: 'Stage 3', date: '12-10-2026', ref_no: 'FM-VN-26-10-1068', vessels: ['LUNARIA'], hub: 'DXB - GTF (GTF SHIPPING SERVICES LLC)', mode: 'Air', origin: 'DXB - GTF (United Arab Emirates)', destination: 'CAI (Egypt)', packages: 1, weight: 2, awb_no: '176-68116160', carrier: 'EK', etd: '12-10-2026', eta: '12-10-2026', prealert_docs: 2, awb_docs: 2, pod_docs: 1, distance: 1506 },
  { id: 9, stage: 'Stage 4', date: '10-10-2026', ref_no: 'FM-PH-26-10-1081', vessels: ['No vessel (Densay)'], hub: 'MAA 2 (BLUE CRATE LOGISTICS LLP)', mode: 'Air', origin: 'MAA 2 (India)', destination: 'SIN (Singapore)', packages: 2, weight: 63, awb_no: '603-7652 1351', carrier: 'UL', etd: '10-10-2026', eta: '11-10-2026', prealert_docs: 2, awb_docs: 2, pod_docs: 1, distance: 1810 },
  { id: 10, stage: 'Stage 3', date: '10-10-2026', ref_no: 'FM-PH-26-10-1077', vessels: ['SFL LION'], hub: 'PVG-HUB (FLIQ MARINE CHINA (SHANGHAI))', mode: 'Air', origin: 'PVG-HUB (China)', destination: 'SIN (Singapore)', packages: 8, weight: 236, awb_no: '112-95019175', carrier: 'CK', etd: '10-10-2026', eta: '10-10-2026', prealert_docs: 2, awb_docs: 1, pod_docs: 1, distance: 2783 },
];

// Every filter shown in the design, in one object.
export type AllStageFilters = {
  client: string;
  vessel: string;
  hub: string;
  status: string;
  vesselPo: string;
  keyAccountManager: string;
  consignee: string;
  portOfDestination: string;
  stages: string;
  refNo: string;
  awbNumber: string;
  dateFrom: string;
  dateTo: string;
};

const emptyFilters: AllStageFilters = {
  client: '',
  vessel: '',
  hub: '',
  status: '',
  vesselPo: '',
  keyAccountManager: '',
  consignee: '',
  portOfDestination: '',
  stages: '',
  refNo: '',
  awbNumber: '',
  dateFrom: '',
  dateTo: '',
};

// dd-mm-yyyy -> comparable number (yyyymmdd)
const toKey = (d: string) => {
  const [dd, mm, yyyy] = d.split('-');
  return Number(`${yyyy}${mm}${dd}`);
};

// Date inputs give yyyy-mm-dd; convert to the table's dd-mm-yyyy
const fromInput = (d: string) => (d ? d.split('-').reverse().join('-') : '');

export default function AllStage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AllStageFilters>(emptyFilters);
  const [selected, setSelected] = useState<number[]>([]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const from = filters.dateFrom ? toKey(fromInput(filters.dateFrom)) : null;
    const to = filters.dateTo ? toKey(fromInput(filters.dateTo)) : null;

    return allRows.filter((row) => {
      const matchesSearch =
        !term ||
        row.ref_no.toLowerCase().includes(term) ||
        row.vessels.some((v) => v.toLowerCase().includes(term)) ||
        row.origin.toLowerCase().includes(term) ||
        row.destination.toLowerCase().includes(term) ||
        row.awb_no.toLowerCase().includes(term);

      const matchesVessel = !filters.vessel || row.vessels.includes(filters.vessel);
      const matchesHub = !filters.hub || row.hub === filters.hub;
      const matchesStage = !filters.stages || row.stage === filters.stages;
      const matchesRef = !filters.refNo || row.ref_no === filters.refNo;
      const matchesAwb = !filters.awbNumber || row.awb_no === filters.awbNumber;
      const matchesPort =
        !filters.portOfDestination || row.destination === filters.portOfDestination;
      const matchesFrom = from === null || toKey(row.date) >= from;
      const matchesTo = to === null || toKey(row.date) <= to;

      return (
        matchesSearch &&
        matchesVessel &&
        matchesHub &&
        matchesStage &&
        matchesRef &&
        matchesAwb &&
        matchesPort &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [search, filters]);

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleFilterChange = (key: keyof AllStageFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setSearch('');
    setPage(0);
  };

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
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAllOnPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pageIds = paginatedRows.map((row) => row.id);

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
      <Header title="Pre Alerts - All Stages" />

      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        search={search}
        onSearchChange={(value: string) => {
          setSearch(value);
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
          <Typography
            variant="body2"
            sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            {selected.length} selected
          </Typography>

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

      <AllStageTable
        rows={filteredRows}
        paginatedRows={paginatedRows}
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