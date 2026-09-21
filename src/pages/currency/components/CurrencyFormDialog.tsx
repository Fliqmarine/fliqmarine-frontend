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

export type CurrencyFormValues = {
  name: string;
  code: string;
  rate: string;
  country: string;  
  symbol: string;
  confirmPassword: string;
  status: 'Active' | 'Inactive';
};

type CurrencyFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CurrencyFormValues) => void;
};

const initialValues: CurrencyFormValues = {
  name: '',
  code: '',
  rate: '',
  confirmPassword: '',
  status: 'Active',
};

export default function CurrencyFormDrawer({
  open,
  onClose,
  onSubmit,
}: CurrencyFormDrawerProps) {
  const [values, setValues] = useState<CurrencyFormValues>(initialValues);

  const handleChange = <K extends keyof CurrencyFormValues>(
    key: K,
    value: CurrencyFormValues[K],
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
            Create Currency
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
            label="Rate"
            size="small"
            fullWidth
            type="number"
            value={values.rate}
            onChange={(e) => handleChange('rate', e.target.value)}
          />

          <TextField
            label="Country"
            size="small"
            fullWidth
            value={values.country}
            onChange={(e) => handleChange('country', e.target.value)}
          />

          <TextField
            label="Symbol"
            size="small"
            fullWidth
            value={values.symbol}
            onChange={(e) => handleChange('symbol', e.target.value)}
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
            disabled={!values.name || !values.code || !values.rate}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}