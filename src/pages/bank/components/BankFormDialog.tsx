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

export type BankFormValues = {
  name: string;
  code: string;
  acc_name: string;
  acc_number: string;  
  balance: string;
  currency: string;
  status: 'Active' | 'Inactive';
};

type BankFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: BankFormValues) => void;
};

const initialValues: BankFormValues = {
  name: '',
  code: '',
  acc_name: '',
  acc_number: '',
  balance: '',
  currency: '',
  status: 'Active',
};

export default function BankFormDrawer({
  open,
  onClose,
  onSubmit,
}: BankFormDrawerProps) {
  const [values, setValues] = useState<BankFormValues>(initialValues);

  const handleChange = <K extends keyof BankFormValues>(
    key: K,
    value: BankFormValues[K],
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
            Create Bank
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
            label="Acc Name"
            size="small"
            fullWidth
            value={values.acc_name}
            onChange={(e) => handleChange('acc_name', e.target.value)}
          />

          <TextField
            label="Acc Number"
            size="small"
            fullWidth
            value={values.acc_number}
            onChange={(e) => handleChange('acc_number', e.target.value)}
          />

          <TextField
            label="Balance"
            size="small"
            fullWidth
            value={values.balance}
            onChange={(e) => handleChange('balance', e.target.value)}
          />

          <TextField
            select
            label="Currency"
            size="small"
            fullWidth
            value={values.currency}
            onChange={(e) => handleChange('currency', e.target.value as 'USD' | 'SGD')}
          >
            <MenuItem value="Active">USD</MenuItem>
            <MenuItem value="Inactive">SGD</MenuItem>
          </TextField>

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
            disabled={!values.name || !values.code}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}