import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import AirportCodeFormDialog from './AirportCodeFormDialog';
import type { AirportCodeFormValues } from './AirportCodeFormDialog';


type HeaderProps = {
  onCreateAirportCode?: (values: AirportCodeFormValues) => void;
};

export default function Header({ onCreateAirportCode }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (values: AirportCodeFormValues) => {
    onCreateAirportCode?.(values);
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
          AirportCodes
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
        Create AirportCode
      </Button>

      <AirportCodeFormDialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}