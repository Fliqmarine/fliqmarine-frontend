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
import GlParentFormDialog from './GlParentFormDialog';
import type { GlParent } from '../../glParent/components/Table';

export type GlParent = {
  id: number;
  name: string;
  code: string;
  type: string;
  status: 'Active' | 'InActive';
};

type GlParentTableProps = {
  glParents: GlParent[];
  paginatedGlParents: GlParent[];
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

export default function GlParentTable({
  glParents,
  paginatedGlParents,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
}: GlParentTableProps) {
  const isSelected = (id: number) => selected.includes(id);

  const pageSelectedCount = paginatedGlParents.filter((glParent) =>
    isSelected(glParent.id),
  ).length;
  const allOnPageSelected =
    paginatedGlParents.length > 0 && pageSelectedCount === paginatedGlParents.length;
  const someOnPageSelected =
    pageSelectedCount > 0 && pageSelectedCount < paginatedGlParents.length;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedGlParent, setSelectedGlParent] = useState<GlParent | null>(null);

    const handleEdit = (glParent: GlParent) => {
      setSelectedGlParent(glParent);
      setDrawerOpen(true);
    };

    const handleClose = () => {
      setDrawerOpen(false);
      setSelectedGlParent(null);
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
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Type</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Status</TableCell>
              <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedGlParents.map((glParent) => {
              const checked = isSelected(glParent.id);

              return (
                <TableRow
                  key={glParent.id}
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
                      onChange={() => onSelectRow(glParent.id)}
                    />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {glParent.name}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {glParent.code}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {glParent.type}
                    </Typography>
                  </TableCell>



                  <TableCell sx={cellSx}>
                    <Chip
                      label={glParent.status}
                      size="small"
                      color={glParent.status === 'Active' ? 'success' : 'default'}
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </TableCell>

                    <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(glParent)}
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

      <GlParentFormDialog
        open={drawerOpen}
        onClose={handleClose}
        onSubmit={handleEdit}
        glParent={selectedGlParent} 
      />

      <TablePagination
        component="div"
        count={glParents.length}
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