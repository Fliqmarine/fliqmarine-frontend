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
import CurencyFormDialog from './CurrencyFormDialog';
import type { Currency } from '../../currency/components/Table';

export type Currency = {
  id: number;
  name: string;
  code: string;
  rate: string;
  status: 'Active' | 'InActive';
};

type CurrencyTableProps = {
  currencies: Currency[];
  paginatedCurrencies: Currency[];
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

export default function CurrencyTable({
  currencies,
  paginatedCurrencies,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
}: CurrencyTableProps) {
  const isSelected = (id: number) => selected.includes(id);

  const pageSelectedCount = paginatedCurrencies.filter((currency) =>
    isSelected(currency.id),
  ).length;
  const allOnPageSelected =
    paginatedCurrencies.length > 0 && pageSelectedCount === paginatedCurrencies.length;
  const someOnPageSelected =
    pageSelectedCount > 0 && pageSelectedCount < paginatedCurrencies.length;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

    const handleEdit = (currency: Currency) => {
      setSelectedCurrency(currency);
      setDrawerOpen(true);
    };

    const handleClose = () => {
      setDrawerOpen(false);
      setSelectedCurrency(null);
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
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Code</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Rate</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Status</TableCell>
              <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCurrencies.map((currency) => {
              const checked = isSelected(currency.id);

              return (
                <TableRow
                  key={currency.id}
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
                      onChange={() => onSelectRow(currency.id)}
                    />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {currency.name}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {currency.code}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {currency.rate}
                    </Typography>
                  </TableCell>



                  <TableCell sx={cellSx}>
                    <Chip
                      label={currency.status}
                      size="small"
                      color={currency.status === 'Active' ? 'success' : 'default'}
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </TableCell>

                    <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(currency)}
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

      <CurencyFormDialog
        open={drawerOpen}
        onClose={handleClose}
        onSubmit={handleEdit}
        currency={selectedCurrency} 
      />

      <TablePagination
        component="div"
        count={currencies.length}
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