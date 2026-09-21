import { DescriptionOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import Header from './components/Header';
import Filter from './components/Filter';
import HubLocationGrid, { type HubLocation } from './components/Table';
import HubLocationFormDialog from './components/HubLocationFormDialog';
import type { HubLocationFormValues } from './components/HubLocationFormDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';

const initialHubLocations: HubLocation[] = [
  { id: 1, name: 'Chennai Central Hub', address: '12 Anna Salai, Teynampet, Chennai, Tamil Nadu 600018', client: 'Acme Logistics' },
  { id: 2, name: 'Guindy Warehouse', address: '45 Industrial Estate, Guindy, Chennai, Tamil Nadu 600032', client: 'Globex Corporation' },
  { id: 3, name: 'Ambattur Distribution Center', address: '78 Mogappair Road, Ambattur, Chennai, Tamil Nadu 600053', client: 'Initech' },
  { id: 4, name: 'Bangalore North Hub', address: '221 Hebbal Ring Road, Bengaluru, Karnataka 560024', client: 'Acme Logistics' },
  { id: 5, name: 'Hyderabad Gachibowli Hub', address: '9 Financial District, Gachibowli, Hyderabad, Telangana 500032', client: 'Umbrella Traders' },
  { id: 6, name: 'Coimbatore Depot', address: '33 Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004', client: 'Globex Corporation' },
  { id: 7, name: 'Madurai Hub', address: '5 KK Nagar Main Road, Madurai, Tamil Nadu 625020', client: 'Initech' },
  { id: 8, name: 'Kochi Port Hub', address: '18 Willingdon Island, Kochi, Kerala 682003', client: 'Umbrella Traders' },
  { id: 9, name: 'Mumbai Bhiwandi Warehouse', address: '102 Kalher Road, Bhiwandi, Maharashtra 421302', client: 'Acme Logistics' },
  { id: 10, name: 'Delhi Okhla Hub', address: '67 Okhla Phase II, New Delhi, Delhi 110020', client: 'Globex Corporation' },
];

export default function Index() {
  const [hubLocations, setHubLocations] = useState<HubLocation[]>(initialHubLocations);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [search, setSearch] = useState('');
  const [client, setClient] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [editingHub, setEditingHub] = useState<HubLocation | null>(null);
  const [deletingHub, setDeletingHub] = useState<HubLocation | null>(null);

  // Stable reference so the edit form only reloads when a different hub is chosen
  const editInitialValues = useMemo(
    () =>
      editingHub
        ? {
            name: editingHub.name,
            address: editingHub.address,
            client: editingHub.client,
          }
        : undefined,
    [editingHub],
  );

  const clients = Array.from(new Set(hubLocations.map((hub) => hub.client))).sort();

  const filteredHubs = hubLocations.filter((hub) => {
    const query = search.toLowerCase();

    const matchesSearch =
      hub.name.toLowerCase().includes(query) ||
      hub.address.toLowerCase().includes(query);

    const matchesClient = !client || hub.client === client;

    return matchesSearch && matchesClient;
  });

  const paginatedHubs = filteredHubs.slice(
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
    const pageIds = paginatedHubs.map((hub) => hub.id);

    if (event.target.checked) {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const getNextId = (list: HubLocation[]) =>
    Math.max(0, ...list.map((hub) => hub.id)) + 1;

  const handleCreateHub = (values: HubLocationFormValues) => {
    setHubLocations((prev) => [{ id: getNextId(prev), ...values }, ...prev]);
    setPage(0);
  };

  const handleUpdateHub = (values: HubLocationFormValues) => {
    if (!editingHub) return;

    setHubLocations((prev) =>
      prev.map((hub) => (hub.id === editingHub.id ? { ...hub, ...values } : hub)),
    );
    setEditingHub(null);
  };

  // Adds a copy right after the original
  const handleCopyHub = (hub: HubLocation) => {
    setHubLocations((prev) => {
      const index = prev.findIndex((item) => item.id === hub.id);
      const copy = { ...hub, id: getNextId(prev), name: `${hub.name} (Copy)` };

      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingHub) return;

    const lastPage = Math.max(
      0,
      Math.ceil((filteredHubs.length - 1) / rowsPerPage) - 1,
    );

    setHubLocations((prev) => prev.filter((hub) => hub.id !== deletingHub.id));
    setSelected((prev) => prev.filter((id) => id !== deletingHub.id));
    setPage((prev) => Math.min(prev, lastPage));
    setDeletingHub(null);
  };

  const handleExportExcel = () => {
    console.log('Export to Excel', selected);
  };

  const handleExportPdf = () => {
    console.log('Export to PDF', selected);
  };

  return (
    <Box sx={{ p: 1.5 }}>
      <Header clients={clients} onCreateHub={handleCreateHub} />
      <Filter
        search={search}
        client={client}
        clients={clients}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        onClientChange={(value) => {
          setClient(value);
          setPage(0);
        }}
        onReset={() => {
          setSearch('');
          setClient('');
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

      <HubLocationGrid
        hubs={filteredHubs}
        paginatedHubs={paginatedHubs}
        page={page}
        rowsPerPage={rowsPerPage}
        selected={selected}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onSelectRow={handleSelectRow}
        onSelectAllOnPage={handleSelectAllOnPage}
        onEdit={setEditingHub}
        onCopy={handleCopyHub}
        onDelete={setDeletingHub}
      />

      <HubLocationFormDialog
        open={Boolean(editingHub)}
        clients={clients}
        title="Edit Hub Location"
        submitLabel="Update hub"
        initialValues={editInitialValues}
        onClose={() => setEditingHub(null)}
        onSubmit={handleUpdateHub}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingHub)}
        name={deletingHub?.name}
        onCancel={() => setDeletingHub(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}