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

export type AirportCodeFormValues = {
  name: string;
  code: string;
  city: string;
  country: string;
  status: 'Active' | 'Inactive';
};

type AirportCodeFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AirportCodeFormValues) => void;
};

const initialValues: AirportCodeFormValues = {
  name: '',
  code: '',
  city: '',
  country: '',
  status: 'Active',
};

export default function AirportCodeFormDrawer({
  open,
  onClose,
  onSubmit,
}: AirportCodeFormDrawerProps) {
  const [values, setValues] = useState<AirportCodeFormValues>(initialValues);

  const handleChange = <K extends keyof AirportCodeFormValues>(
    key: K,
    value: AirportCodeFormValues[K],
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
            Create AirportCode
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
            value={values.code}
            onChange={(e) => handleChange('code', e.target.value)}
          />

          <TextField
            label="City"
            size="small"
            fullWidth
            value={values.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />

          <TextField
            label="Country"
            size="small"
            fullWidth
            value={values.country}
            onChange={(e) => handleChange('country', e.target.value)}
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
            disabled={!values.name || !values.code || !values.city}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}