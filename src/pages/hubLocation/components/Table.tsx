import {
  BusinessOutlined,
  ContentCopyOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  PlaceOutlined,
} from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material';

export interface HubLocation {
  id: number;
  name: string;
  address: string;
  client: string;
}

interface HubLocationGridProps {
  hubs: HubLocation[];
  paginatedHubs: HubLocation[];
  page: number;
  rowsPerPage: number;
  selected: number[];
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (id: number) => void;
  onSelectAllOnPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (hub: HubLocation) => void;
  onCopy: (hub: HubLocation) => void;
  onDelete: (hub: HubLocation) => void;
}

export default function HubLocationGrid({
  hubs,
  paginatedHubs,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
  onEdit,
  onCopy,
  onDelete,
}: HubLocationGridProps) {
  const selectedOnPage = paginatedHubs.filter((hub) =>
    selected.includes(hub.id),
  ).length;

  const allOnPageSelected =
    paginatedHubs.length > 0 && selectedOnPage === paginatedHubs.length;
  const someOnPageSelected = selectedOnPage > 0 && !allOnPageSelected;

  return (
    <Box>
      <Box sx={{ mb: 0.5 }}>
        <FormControlLabel
          disabled={paginatedHubs.length === 0}
          label={
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              Select all on this page
            </Typography>
          }
          control={
            <Checkbox
              size="small"
              checked={allOnPageSelected}
              indeterminate={someOnPageSelected}
              onChange={onSelectAllOnPage}
            />
          }
        />
      </Box>

      {paginatedHubs.length === 0 ? (
        <Paper variant="outlined" sx={{ borderRadius: 1.5, py: 4, px: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            No hub locations match your filters. Try clearing the search or
            choosing another client.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
          }}
        >
          {paginatedHubs.map((hub) => {
            const isSelected = selected.includes(hub.id);

            return (
              <Paper
                key={hub.id}
                variant="outlined"
                onClick={() => onSelectRow(hub.id)}
                sx={{
                  position: 'relative',
                  p: 1.5,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'action.selected' : 'background.paper',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    noWrap
                    title={hub.name}
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      minWidth: 0,
                    }}
                  >
                    {hub.name}
                  </Typography>
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    sx={{ p: 0.25, mt: -0.25, mr: -0.5 }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onSelectRow(hub.id)}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 0.75, mb: 0.75 }}>
                  <PlaceOutlined
                    sx={{ fontSize: 16, mt: '2px', color: 'text.secondary' }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    title={hub.address}
                    sx={{
                      fontSize: 13,
                      lineHeight: 1.4,
                      minWidth: 0,
                      // Always exactly 2 lines tall, so every card stays the same size
                      height: '2.8em',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {hub.address}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <BusinessOutlined
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography
                    variant="body2"
                    noWrap
                    title={hub.client}
                    sx={{ fontSize: 13, minWidth: 0 }}
                  >
                    {hub.client}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 0.25,
                    mt: 1,
                    pt: 0.75,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      aria-label={`Edit ${hub.name}`}
                      onClick={() => onEdit(hub)}
                    >
                      <EditOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Copy">
                    <IconButton
                      size="small"
                      aria-label={`Copy ${hub.name}`}
                      onClick={() => onCopy(hub)}
                    >
                      <ContentCopyOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Delete ${hub.name}`}
                      onClick={() => onDelete(hub)}
                    >
                      <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      <Paper variant="outlined" sx={{ borderRadius: 1.5, mt: 1.5 }}>
        <TablePagination
          component="div"
          count={hubs.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[8, 12, 24]}
          labelRowsPerPage="Cards per page"
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}