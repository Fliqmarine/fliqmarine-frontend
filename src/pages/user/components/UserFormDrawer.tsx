import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  client: string;
  hub: string;
  backupPics: string[];
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
  password: '',
  confirmPassword: '',
  role: 'Operational Executive',
  client: '',
  hub: '',
  backupPics: [],
  status: 'Active',
};

const ROLES = [
  'Client',
  'Hub',
  'Documentation',
  'Operational Executive',
  'Manager',
  'Finance Executive',
  'Finance Manager',
];

// TODO: replace these placeholder lists with data from your API / props
const CLIENT_OPTIONS = ['Client A', 'Client B', 'Client C'];
const HUB_OPTIONS = ['Hub 1', 'Hub 2', 'Hub 3'];
const BACKUP_PIC_OPTIONS = ['Person 1', 'Person 2', 'Person 3', 'Person 4'];

export default function UserFormDrawer({
  open,
  onClose,
  onSubmit,
}: UserFormDrawerProps) {
  const [values, setValues] = useState<UserFormValues>(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();

  const handleChange = <K extends keyof UserFormValues>(
    key: K,
    value: UserFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // Changing the role clears the role-specific fields so stale values aren't submitted
  const handleRoleChange = (role: string) => {
    setValues((prev) => ({
      ...prev,
      role,
      client: '',
      hub: '',
      backupPics: [],
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = () => {
    onSubmit(values);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isClient = values.role === 'Client';
  const isHub = values.role === 'Hub';
  const isOperationalExecutive = values.role === 'Operational Executive';

  const isInvalid =
    !values.name ||
    !values.email ||
    (isClient && !values.client) ||
    (isHub && !values.hub);

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

        <Box sx={{ height: '2px', width: '100%', bgcolor: theme.palette.primary.main }} />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 2.5,
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
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
            label="Password"
            size="small"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            size="small"
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Role"
            size="small"
            fullWidth
            value={values.role}
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            {ROLES.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          {isClient && (
            <TextField
              select
              label="Client"
              size="small"
              fullWidth
              value={values.client}
              onChange={(e) => handleChange('client', e.target.value)}
            >
              {CLIENT_OPTIONS.map((client) => (
                <MenuItem key={client} value={client}>
                  {client}
                </MenuItem>
              ))}
            </TextField>
          )}

          {isHub && (
            <TextField
              select
              label="Hub"
              size="small"
              fullWidth
              value={values.hub}
              onChange={(e) => handleChange('hub', e.target.value)}
            >
              {HUB_OPTIONS.map((hub) => (
                <MenuItem key={hub} value={hub}>
                  {hub}
                </MenuItem>
              ))}
            </TextField>
          )}

          {isOperationalExecutive && (
            <Autocomplete
              multiple
              disableCloseOnSelect
              size="small"
              fullWidth
              options={BACKUP_PIC_OPTIONS}
              value={values.backupPics}
              onChange={(_, newValue) => handleChange('backupPics', newValue)}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props as typeof props & { key: string };
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox size="small" checked={selected} sx={{ mr: 1, p: 0.5 }} />
                    {option}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} label="Backup PIC" />}
            />
          )}

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
            disabled={isInvalid}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}