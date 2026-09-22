import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import CargoFormDialog from './CargoFormDialog';
import type { CargoFormValues } from './CargoFormDialog';


type HeaderProps = {
  onCreateCargo?: (values: CargoFormValues) => void;
};

export default function Header({ onCreateCargo }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (values: CargoFormValues) => {
    onCreateCargo?.(values);
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
          Cargos
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="small"
        startIcon={<Add sx={{ fontSize: 16 }} />}
        onClick={() => setDrawerOpen(true)}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 1.5,
          px: 1.5,
          py: 0.5,
        }}
      >
        Create Cargo
      </Button>

      <CargoFormDialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}