import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  Drawer,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export type CargoFormValues = {
  name: string;
  hsn_code: string;
  description: string;
  status: 'Active' | 'Inactive';
};

type CargoFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CargoFormValues) => void;
};

const initialValues: CargoFormValues = {
  name: '',
  hsn_code: '',
  description: '',
  status: 'Active',
};

export default function CargoFormDrawer({
  open,
  onClose,
  onSubmit,
}: CargoFormDrawerProps) {
  const [values, setValues] = useState<CargoFormValues>(initialValues);

  const handleChange = <K extends keyof CargoFormValues>(
    key: K,
    value: CargoFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(values);
    setValues(initialValues);
    onClose();
  };

  const handleClose = () => {
    setValues(initialValues);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box sx={{ width: 500, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 2,
            borderBottom: '1px solid',
            backgroundColor: '#0b1c39',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
            Create Cargo
          </Typography>

          <IconButton size="small" onClick={handleClose}>
            <Close fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 2, px: 2.5, py: 2.5, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>
          <TextField
            label="Name"
            size="small"
            fullWidth
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <TextField
            label="Code"
            size="small"
            fullWidth
            value={values.hsn_code}
            onChange={(e) => handleChange('hsn_code', e.target.value)}
          />

          <TextField
            label="Rate"
            size="small"
            fullWidth
            type="number"
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <TextField
            select
            label="Status"
            size="small"
            fullWidth
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value as 'Active' | 'Inactive')}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            px: 2.5,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            onClick={handleClose}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!values.name}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}