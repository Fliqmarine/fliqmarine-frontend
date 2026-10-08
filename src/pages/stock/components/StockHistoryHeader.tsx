import { Box, Button, Typography } from '@mui/material';


export default function Header({ }) {  
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
          Stock History
        </Typography>
      </Box>
    </Box>
  );
}