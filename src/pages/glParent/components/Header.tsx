import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import GlParentFormDialog from './GlParentFormDialog';
import type { GlParentFormValues } from './GlParentFormDialog';


type HeaderProps = {
  onCreateGlParent?: (values: GlParentFormValues) => void;
};

export default function Header({ onCreateGlParent }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (values: GlParentFormValues) => {
    onCreateGlParent?.(values);
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
          GL Code Parents
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
        Create GL Code Parent 
      </Button>

      <GlParentFormDialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}