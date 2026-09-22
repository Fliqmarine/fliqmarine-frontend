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
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
};

// Shared input styling: taller touch targets on mobile, compact on desktop
const inputSx = {
  '& .MuiInputBase-root': { height: { xs: 40, sm: 32 }, fontSize: 13 },
  '& .MuiInputLabel-root': { fontSize: 13 },
};

export default function Filter({
  search,
  status,
  onSearchChange,
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
      {/* Mobile: full width on its own row. Desktop: fixed-ish width */}
      <TextField
        size="small"
        placeholder="Search aiportcodes..."
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
        sx={{
          flex: { xs: '1 1 100%', sm: '0 1 auto' },
          minWidth: { xs: 0, sm: 200 },
          ...inputSx,
        }}
      />

      {/* Mobile: split the row evenly. Desktop: fixed min width */}
      <FormControl
        size="small"
        sx={{
          flex: { xs: '1 1 0', sm: '0 0 auto' },
          minWidth: { xs: 0, sm: 120 },
          ...inputSx,
        }}
      >
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
          <MenuItem value="InActive" sx={{ fontSize: 13 }}>InActive</MenuItem>
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
            flexShrink: 0,
            width: { xs: 40, sm: 32 },
            height: { xs: 40, sm: 32 },
          }}
        >
          <RefreshOutlined sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}