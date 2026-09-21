import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import CurrencyFormDialog from './CurrencyFormDialog';
import type { CurrencyFormValues } from './CurrencyFormDialog';


type HeaderProps = {
  onCreateCurrency?: (values: CurrencyFormValues) => void;
};

export default function Header({ onCreateCurrency }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (values: CurrencyFormValues) => {
    onCreateCurrency?.(values);
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
          Currencies
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
        Create Currency
      </Button>

      <CurrencyFormDialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}