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
import UserFormDrawer from './UserFormDrawer';

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'InActive';
};

type UserTableProps = {
  users: User[];
  paginatedUsers: User[];
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

export default function UserTable({
  users,
  paginatedUsers,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
}: UserTableProps) {
  const isSelected = (id: number) => selected.includes(id);

  const pageSelectedCount = paginatedUsers.filter((user) =>
    isSelected(user.id),
  ).length;
  const allOnPageSelected =
    paginatedUsers.length > 0 && pageSelectedCount === paginatedUsers.length;
  const someOnPageSelected =
    pageSelectedCount > 0 && pageSelectedCount < paginatedUsers.length;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
      setSelectedUser(user);
      setDrawerOpen(true);
    };

    const handleClose = () => {
      setDrawerOpen(false);
      setSelectedUser(null);
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
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Email</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Role</TableCell>
              <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Status</TableCell>
              <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedUsers.map((user) => {
              const checked = isSelected(user.id);

              return (
                <TableRow
                  key={user.id}
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
                      onChange={() => onSelectRow(user.id)}
                    />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {user.name}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {user.email}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Chip
                      label={user.role}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Chip
                      label={user.status}
                      size="small"
                      color={user.status === 'Active' ? 'success' : 'default'}
                      sx={{ height: 20, fontSize: 11 }}
                    />
                  </TableCell>

                    <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(user)}
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

      <UserFormDrawer
        open={drawerOpen}
        onClose={handleClose}
        onSubmit={handleEdit}
        user={selectedUser} 
      />

      <TablePagination
        component="div"
        count={users.length}
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