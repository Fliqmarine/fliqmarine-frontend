import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function Header({ }) {

    
    const navigate = useNavigate();
    const handleCreate = () => {
        navigate("/stocks/create");
    }
  
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
          Stock Lists
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="small"
        onClick= {handleCreate}
        startIcon={<Add sx={{ fontSize: 16 }} />}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 1.5,
          px: 1.5,
          py: 0.5,
        }}
      >
        Create Stock List
      </Button>

    </Box>
  );
}