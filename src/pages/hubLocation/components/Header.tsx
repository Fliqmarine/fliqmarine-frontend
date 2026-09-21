import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import HubLocationFormDialog from './HubLocationFormDialog';
import type { HubLocationFormValues } from './HubLocationFormDialog';

type HeaderProps = {
  clients?: string[];
  onCreateHub?: (values: HubLocationFormValues) => void;
};

export default function Header({ clients, onCreateHub }: HeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (values: HubLocationFormValues) => {
    onCreateHub?.(values);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: 18,
          }}
        >
          Hub Locations
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="small"
        startIcon={<Add sx={{ fontSize: 16 }} />}
        onClick={() => setDialogOpen(true)}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 1.5,
          px: 1.5,
          py: 0.5,
        }}
      >
        Create Hub
      </Button>

      <HubLocationFormDialog
        open={dialogOpen}
        clients={clients}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}