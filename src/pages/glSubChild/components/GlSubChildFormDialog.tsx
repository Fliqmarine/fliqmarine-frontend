import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export type GlSubChildFormValues = {
  name: string;
  code: string;
  gl_parent_name: string;
  gl_child_name: string;
  status: 'Active' | 'Inactive';
};

type GlSubChildFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: GlSubChildFormValues) => void;
};

const initialValues: GlSubChildFormValues = {
  name: '',
  code: '',
  gl_parent_name: '',
  gl_child_name: '',
  status: 'Active',
};

export default function GlSubChildFormDrawer({
  open,
  onClose,
  onSubmit,
}: GlSubChildFormDrawerProps) {
  const [values, setValues] = useState<GlSubChildFormValues>(initialValues);

  const handleChange = <K extends keyof GlSubChildFormValues>(
    key: K,
    value: GlSubChildFormValues[K],
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
            Create GL code Sub Child
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
            label="GL Parent"
            size="small"
            fullWidth
            value={values.gl_parent_name}
            onChange={(e) => handleChange('gl_parent_name', e.target.value)}
          />

          <TextField
            label="GL Child"
            size="small"
            fullWidth
            type="number"
            value={values.gl_child_name}
            onChange={(e) => handleChange('gl_child_name', e.target.value)}
          />

          <TextField
            label="Code"
            size="small"
            fullWidth
            type="number"
            value={values.code}
            onChange={(e) => handleChange('code', e.target.value)}
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