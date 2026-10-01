import { Checkbox, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const cellSx = { py: 0.5, px: 1.5 };
export default function ContactTable(){
    return(
        <Paper
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
            }}
            >

                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                        <TableCell padding="checkbox" sx={{ py: 0.5, px: 1 }}>
                            <Checkbox size="small"/>
                        </TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Category</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Name</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Email</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Station Code</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Country</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Status</TableCell>
                        <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow
                            hover
                            sx={{
                                '&:last-child td, &:last-child th': {
                                border: 0,
                                },
                            }}
                            >
                            <TableCell padding="checkbox" sx={{ py: 0.5, px: 1 }}>
                                <Checkbox
                                size="small"
                                />
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                                    Client
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                DNA Tankers
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                ops@dna.com
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                SIN 8
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                SINGAPORE
                                </Typography>
                            </TableCell>



                            <TableCell sx={cellSx}>
                                <Chip
                                size="small"
                                label="Active"
                                color={'success'}
                                sx={{ height: 20, fontSize: 11 }}
                                />
                            </TableCell>

                                <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>
                                    <IconButton
                                        size="small"
                                        sx={{ '&:hover': { color: 'primary.main' } }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>

                                    <IconButton size="small" sx={{ '&:hover': { color: 'error.main',},}}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            
                            </TableRow>
                    </TableBody>
                    </Table>
                </TableContainer>
        </Paper>
    );
}