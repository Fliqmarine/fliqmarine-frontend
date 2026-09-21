import { Close } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

export type HubLocationFormValues = {
  name: string;
  address: string;
  client: string;
};

type HubLocationFormDialogProps = {
  open: boolean;
  clients?: string[];
  title?: string;
  submitLabel?: string;
  initialValues?: HubLocationFormValues;
  onClose: () => void;
  onSubmit: (values: HubLocationFormValues) => void;
};

const emptyValues: HubLocationFormValues = {
  name: '',
  address: '',
  client: '',
};

export default function HubLocationFormDialog({
  open,
  clients = [],
  title = 'Create Hub Location',
  submitLabel = 'Save hub',
  initialValues,
  onClose,
  onSubmit,
}: HubLocationFormDialogProps) {
  const [values, setValues] = useState<HubLocationFormValues>(emptyValues);
  const [submitted, setSubmitted] = useState(false);

  // Load the hub being edited (or a blank form) each time the dialog opens
  useEffect(() => {
    if (open) {
      setValues(initialValues ?? emptyValues);
      setSubmitted(false);
    }
  }, [open, initialValues]);

  const errors = {
    name: !values.name.trim(),
    address: !values.address.trim(),
    client: !values.client.trim(),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleClose = () => {
    setValues(emptyValues);
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (hasErrors) return;

    onSubmit({
      name: values.name.trim(),
      address: values.address.trim(),
      client: values.client.trim(),
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="hub-location-dialog-title"
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle
          id="hub-location-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 16,
            fontWeight: 700,
            py: 1.5,
          }}
        >
          {title}
          <IconButton size="small" onClick={handleClose} aria-label="Close">
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}
        >
          <TextField
            size="small"
            label="Name"
            required
            autoFocus
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            error={submitted && errors.name}
            helperText={submitted && errors.name ? 'Enter a hub name' : ' '}
          />

          <TextField
            size="small"
            label="Address"
            required
            multiline
            minRows={3}
            value={values.address}
            onChange={(e) => setValues({ ...values, address: e.target.value })}
            error={submitted && errors.address}
            helperText={submitted && errors.address ? 'Enter the hub address' : ' '}
          />

          <Autocomplete
            freeSolo
            size="small"
            options={clients}
            inputValue={values.client}
            onInputChange={(_event, value) =>
              setValues((prev) => ({ ...prev, client: value }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Client"
                required
                error={submitted && errors.client}
                helperText={
                  submitted && errors.client
                    ? 'Choose or enter a client'
                    : 'Pick an existing client or type a new one'
                }
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1.5, gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleClose}
            sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            type="submit"
            variant="contained"
            sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600 }}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}