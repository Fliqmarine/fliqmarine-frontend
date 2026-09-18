import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export type UserFormValues = {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
};

type UserFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
};

const initialValues: UserFormValues = {
  name: '',
  email: '',
  role: 'User',
  status: 'Active',
};

export default function UserFormDrawer({
  open,
  onClose,
  onSubmit,
}: UserFormDrawerProps) {
  const [values, setValues] = useState<UserFormValues>(initialValues);

  const handleChange = <K extends keyof UserFormValues>(
    key: K,
    value: UserFormValues[K],
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
    <Drawer anchor="right" open={open} onClose={handleClose}>
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
            Create User
          </Typography>

          <IconButton size="small" onClick={handleClose}>
            <Close fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Name"
            size="small"
            fullWidth
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <TextField
            label="Email"
            size="small"
            fullWidth
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <TextField
            select
            label="Role"
            size="small"
            fullWidth
            value={values.role}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            <MenuItem value="Client">Client</MenuItem>
            <MenuItem value="Hub">Hub</MenuItem>
            <MenuItem value="Documentation">Documentation</MenuItem>
            <MenuItem value="Key Account Manager">Key Account Manager</MenuItem>
            <MenuItem value="Operations Manager">Operations Manager</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Finance Executive">Finance Executive</MenuItem>
            <MenuItem value="Finance Manager">Finance Manager</MenuItem>
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
            backgroundColor: '#f1f3f8',
          }}
        >
          <Button
            onClick={handleClose}
            sx={{ textTransform: 'none', fontWeight: 600 , color: "#2d3e7d" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!values.name || !values.email}
            sx={{ textTransform: 'none', fontWeight: 600,
            backgroundColor: '#2d3e7d', }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}