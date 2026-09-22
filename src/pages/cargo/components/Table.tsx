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
import CargoFormDialog from './CargoFormDialog';
import type { Cargo } from '../../cargo/components/Table';

export type Cargo = {
  id: number;
  name: string;
  hsn_code: string;
  description: string;
  status: 'Active' | 'InActive';
};

type CargoTableProps = {
  cargos: Cargo[];
  paginatedCargos: Cargo[];
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

export default function CargoTable({
  cargos,
  paginatedCargos,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
}: CargoTableProps) {
  const isSelected = (id: number) => selected.includes(id);

  const pageSelectedCount = paginatedCargos.filter((cargo) =>
    isSelected(cargo.id),
  ).length;
  const allOnPageSelected =
    paginatedCargos.length > 0 && pageSelectedCount === paginatedCargos.length;
  const someOnPageSelected =
    pageSelectedCount > 0 && pageSelectedCount < paginatedCargos.length;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);

    const handleEdit = (cargo: Cargo) => {
      setSelectedCargo(cargo);
      setDrawerOpen(true);
    };

    const handleClose = () => {
      setDrawerOpen(false);
      setSelectedCargo(null);
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
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>HSN Code</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Description</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Status</TableCell>
              <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCargos.map((cargo) => {
              const checked = isSelected(cargo.id);

              return (
                <TableRow
                  key={cargo.id}
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
                      onChange={() => onSelectRow(cargo.id)}
                    />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {cargo.name}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {cargo.hsn_code}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {cargo.description}
                    </Typography>
                  </TableCell>



                  <TableCell sx={cellSx}>
                    <Chip
                      label={cargo.status}
                      size="small"
                      color={cargo.status === 'Active' ? 'success' : 'default'}
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </TableCell>

                    <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(cargo)}
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

      <CargoFormDialog
        open={drawerOpen}
        onClose={handleClose}
        onSubmit={handleEdit}
        cargo={selectedCargo} 
      />

      <TablePagination
        component="div"
        count={cargos.length}
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