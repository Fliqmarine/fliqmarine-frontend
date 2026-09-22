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
import AirportCodeFormDialog from './AirportCodeFormDialog';
import type { AirportCode } from '../../airportCode/components/Table';

export type AirportCode = {
  id: number;
  name: string;
  code: string;
  city: string;
  country: string;
  status: 'Active' | 'InActive';
};

type AirportCodeTableProps = {
  airportCodes: AirportCode[];
  paginatedAirportCodes: AirportCode[];
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

export default function AirportCodeTable({
  airportCodes,
  paginatedAirportCodes,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
}: AirportCodeTableProps) {
  const isSelected = (id: number) => selected.includes(id);

  const pageSelectedCount = paginatedAirportCodes.filter((airportCode) =>
    isSelected(airportCode.id),
  ).length;
  const allOnPageSelected =
    paginatedAirportCodes.length > 0 && pageSelectedCount === paginatedAirportCodes.length;
  const someOnPageSelected =
    pageSelectedCount > 0 && pageSelectedCount < paginatedAirportCodes.length;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedAirportCode, setSelectedAirportCode] = useState<AirportCode | null>(null);

    const handleEdit = (airportCode: AirportCode) => {
      setSelectedAirportCode(airportCode);
      setDrawerOpen(true);
    };

    const handleClose = () => {
      setDrawerOpen(false);
      setSelectedAirportCode(null);
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
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>City</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Country</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Status</TableCell>
              <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedAirportCodes.map((airportCode) => {
              const checked = isSelected(airportCode.id);

              return (
                <TableRow
                  key={airportCode.id}
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
                      onChange={() => onSelectRow(airportCode.id)}
                    />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {airportCode.name}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {airportCode.code}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {airportCode.city}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {airportCode.country}
                    </Typography>
                  </TableCell>



                  <TableCell sx={cellSx}>
                    <Chip
                      label={airportCode.status}
                      size="small"
                      color={airportCode.status === 'Active' ? 'success' : 'default'}
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </TableCell>

                    <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(airportCode)}
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

      <AirportCodeFormDialog
        open={drawerOpen}
        onClose={handleClose}
        onSubmit={handleEdit}
        airportCode={selectedAirportCode} 
      />

      <TablePagination
        component="div"
        count={airportCodes.length}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
        sx={{
          minHeight: 40,
          '.MuiTablePagination-toolbar': { minHeight: 40, px: 1 },
        }}
      />
    </Paper>
  );
}