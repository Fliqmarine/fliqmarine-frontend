import { MoreVert } from '@mui/icons-material';
import {
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import type { Hub } from '../../hub/components/Table';

export type Hub = {
  id: number;
  name: string;
  status: 'Active' | 'InActive';
};

type HubTableProps = {
  hubs: Hub[];
  paginatedHubs: Hub[];
  page: number;
  rowsPerPage: number;
  selected: number[];
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (id: number) => void;
  onSelectAllOnPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// Shared compact cell styling
const cellSx = { py: 0.5, px: 1.5 };

export default function HubTable({
  hubs,
  paginatedHubs,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
}: HubTableProps) {
  const isSelected = (id: number) => selected.includes(id);

  const pageSelectedCount = paginatedHubs.filter((hub) =>
    isSelected(hub.id),
  ).length;
  const allOnPageSelected =
    paginatedHubs.length > 0 && pageSelectedCount === paginatedHubs.length;
  const someOnPageSelected =
    pageSelectedCount > 0 && pageSelectedCount < paginatedHubs.length;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedHub, setSelectedHub] = useState<Hub | null>(null);

    const handleEdit = (hub: Hub) => {
      setSelectedHub(hub);
      setDrawerOpen(true);
    };

    const handleClose = () => {
      setDrawerOpen(false);
      setSelectedHub(null);
    };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ py: 0.5, px: 1 }}>
                <Checkbox size="small" checked={allOnPageSelected} indeterminate={someOnPageSelected} onChange={onSelectAllOnPage}/>
              </TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Name</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Status</TableCell>
              <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedHubs.map((hub) => {
              const checked = isSelected(hub.id);

              return (
                <TableRow
                  key={hub.id}
                  hover
                  selected={checked}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                    },
                  }}
                >
                  <TableCell padding="checkbox" sx={{ py: 0.5, px: 1 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={() => onSelectRow(hub.id)}
                    />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {hub.name}
                    </Typography>
                  </TableCell>


                  <TableCell sx={cellSx}>
                    <Chip
                      label={hub.status}
                      size="small"
                      color={hub.status === 'Active' ? 'success' : 'default'}
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </TableCell>

                    <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(hub)}
                            sx={{ '&:hover': { color: 'primary.main' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                        <IconButton size="small" sx={{ '&:hover': { color: 'error.main',},}}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>


      <TablePagination
        component="div"
        count={hubs.length}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[5, 10]}
        sx={{
          minHeight: 40,
          '.MuiTablePagination-toolbar': { minHeight: 40, px: 1 },
        }}
      />
    </Paper>
  );
}