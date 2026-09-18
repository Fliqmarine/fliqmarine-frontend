import {
  RefreshOutlined,
  SearchOutlined,
} from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';

type FilterProps = {
  search: string;
  role: string;
  status: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
};

// Shared compact input styling
const inputSx = {
  '& .MuiInputBase-root': { height: 32, fontSize: 13 },
  '& .MuiInputLabel-root': { fontSize: 13 },
};

export default function Filter({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onReset,
}: FilterProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        mb: 1.5,
      }}
    >
      <TextField
        size="small"
        placeholder="Search users..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ fontSize: 16 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: 200, ...inputSx }}
      />

      <FormControl size="small" sx={{ minWidth: 120, ...inputSx }}>
        <InputLabel>Role</InputLabel>

        <Select
          value={role}
          label="Role"
          onChange={(event) => onRoleChange(event.target.value)}
          MenuProps={{
            slotProps: {
              list: { sx: { fontSize: 13 } },
            },
          }}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>All Roles</MenuItem>
          <MenuItem value="Admin" sx={{ fontSize: 13 }}>Admin</MenuItem>
          <MenuItem value="Manager" sx={{ fontSize: 13 }}>Manager</MenuItem>
          <MenuItem value="User" sx={{ fontSize: 13 }}>User</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120, ...inputSx }}>
        <InputLabel>Status</InputLabel>

        <Select
          value={status}
          label="Status"
          onChange={(event) => onStatusChange(event.target.value)}
          MenuProps={{
            slotProps: {
              list: { sx: { fontSize: 13 } },
            },
          }}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>All Status</MenuItem>
          <MenuItem value="Active" sx={{ fontSize: 13 }}>Active</MenuItem>
          <MenuItem value="Inactive" sx={{ fontSize: 13 }}>Inactive</MenuItem>
        </Select>
      </FormControl>

      <Tooltip title="Reset filters">
        <IconButton
          onClick={onReset}
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            p: 0.5,
          }}
        >
          <RefreshOutlined sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}