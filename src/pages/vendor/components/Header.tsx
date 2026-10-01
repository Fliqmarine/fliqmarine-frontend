import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import VendorFormDialog from './VendorFormDialog';
import type { VendorFormValues } from './VendorFormDialog';


type HeaderProps = {
  onCreateVendor?: (values: VendorFormValues) => void;
};

export default function Header({ onCreateVendor }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (values: VendorFormValues) => {
    onCreateVendor?.(values);
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
          Vendors
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
        Create Vendor
      </Button>

      <VendorFormDialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}