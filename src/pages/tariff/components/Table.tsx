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
import TariffMasterFormDialog from './TariffMasterFormDialog';
import type { TariffMaster } from '../../tariff/components/Table';

export type TariffMaster = {
  id: number;
  name: string;
  rule: string;
  status: 'Active' | 'InActive';
};

type TariffMasterTableProps = {
  currencies: TariffMaster[];
  paginatedCurrencies: TariffMaster[];
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

export default function TariffMasterTable({
  tariffmasters,
  paginatedTariffmasters,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
}: TariffMasterTableProps) {
  const isSelected = (id: number) => selected.includes(id);

  const pageSelectedCount = paginatedTariffmasters.filter((tariffmasters) =>
    isSelected(tariffmasters.id),
  ).length;
  const allOnPageSelected =
    paginatedTariffmasters.length > 0 && pageSelectedCount === paginatedTariffmasters.length;
  const someOnPageSelected =
    pageSelectedCount > 0 && pageSelectedCount < paginatedTariffmasters.length;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTariffMaster, setSelectedTariffMaster] = useState<TariffMaster | null>(null);

    const handleEdit = (tariffmasters: TariffMaster) => {
      setSelectedTariffMaster(tariffmasters);
      setDrawerOpen(true);
    };

    const handleClose = () => {
      setDrawerOpen(false);
      setSelectedTariffMaster(null);
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
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Rule</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Status</TableCell>
              <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedTariffmasters.map((tariffmasters) => {
              const checked = isSelected(tariffmasters.id);

              return (
                <TableRow
                  key={tariffmasters.id}
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
                      onChange={() => onSelectRow(tariffmasters.id)}
                    />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {tariffmasters.name}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {tariffmasters.rule}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Chip
                      label={tariffmasters.status}
                      size="small"
                      color={tariffmasters.status === 'Active' ? 'success' : 'default'}
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </TableCell>

                    <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(tariffmasters)}
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

      <TariffMasterFormDialog
        open={drawerOpen}
        onClose={handleClose}
        onSubmit={handleEdit}
        tariffmaster={selectedTariffMaster} 
      />

      <TablePagination
        component="div"
        count={tariffmasters.length}
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