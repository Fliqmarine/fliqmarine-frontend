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
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>CLIENT NAME</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>VESSEL NAME</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>VESSEL CODE</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>IMO NO</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>PIC NAME</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>PIC EMAIL</TableCell>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, fontSize: 12 }}>STATUS</TableCell>
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
                                    DNA TANKERS
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                JAG AMOL
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                PAC-002
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                9321483
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                John.doe@gmail.com
                                </Typography>
                            </TableCell>

                            <TableCell sx={cellSx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                                +65 8665 2541
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