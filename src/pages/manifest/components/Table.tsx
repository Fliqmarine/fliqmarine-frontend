import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import { useState } from 'react';
import type { ReactNode } from 'react';
import ViewModal from '../../../components/view-modal/ViewModal';

/* ------------------------------- Types ------------------------------- */

export type ManifestFile = {
  id: number | string;
  name: string;
  url: string;
  type: 'pdf' | 'image';
};

export type Manifest = {
  id: number;
  date: string;
  manifest_status: string; // e.g. "Manifest Sent", "PreAlert Stage 3"
  manifest_no: string;
  vessel: string; // several vessels allowed: separate with new line, comma, semicolon or |
  mode: string;
  origin: string;
  destination: string;
  packages: string;
  weight: string;
  activation: string;
  deadline: string;
  key_account_manager: string;
  internal_status: string;
  has_charges?: boolean; // shows the charges (coin) button
  status: 'Active' | 'InActive';
  files?: ManifestFile[]; // when missing, the static sample files below are shown
};

type ManifestTableProps = {
  manifests: Manifest[];
  paginatedManifests: Manifest[];
  page: number;
  rowsPerPage: number;
  selected: number[];
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (id: number) => void;
  onSelectAllOnPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type Tone = 'primary' | 'success' | 'warning' | 'info' | 'error';

/* ------------------------- Column configuration ------------------------- */

type Column = {
  key: Exclude<keyof Manifest, 'id' | 'status' | 'files' | 'has_charges'>;
  label: string;
  numeric?: boolean;
};

const columns: Column[] = [
  { key: 'date', label: 'Date' },
  { key: 'manifest_status', label: 'Status' },
  { key: 'manifest_no', label: 'Manifest No' },
  { key: 'vessel', label: 'Vessel Name' },
  { key: 'mode', label: 'Mode' },
  { key: 'origin', label: 'Origin' },
  { key: 'destination', label: 'Destination' },
  { key: 'packages', label: 'No of Packages', numeric: true },
  { key: 'weight', label: 'Total Weight', numeric: true },
  { key: 'activation', label: 'Activation' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'key_account_manager', label: 'Key Account Manager' },
  { key: 'internal_status', label: 'Internal status' },
];

// Fields shown in the mobile card header instead of the grid
const CARD_HEADER_KEYS: Column['key'][] = ['vessel', 'manifest_no', 'manifest_status'];

/* ------------------------- Manifest status colours ------------------------- */
// Edit the patterns to match your real status names. First match wins.

const STATUS_RULES: { test: RegExp; tone: Tone }[] = [
  { test: /prealert/i, tone: 'error' },
  { test: /manifest sent/i, tone: 'success' },
  { test: /(receiv|available|arriv|complete|deliver)/i, tone: 'success' },
  { test: /(pend|hold|wait|partial|transit)/i, tone: 'warning' },
  { test: /(releas|dispatch|ship|load)/i, tone: 'info' },
  { test: /(damag|reject|cancel|short|missing|block)/i, tone: 'error' },
];

const getStatusTone = (status: string): Tone =>
  STATUS_RULES.find((r) => r.test.test(status))?.tone ?? 'primary';

// PreAlert rows: no edit / delete / Create PreAlert, and the internal status is editable
const isPreAlert = (status: string) => /prealert/i.test(status);

function StatusChip({ status }: { status: string }) {
  const tone = getStatusTone(status);
  return (
    <Chip
      size="small"
      label={status}
      icon={
        <Box
          component="span"
          sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: `${tone}.main` }}
        />
      }
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 1.5,
        color: `${tone}.main`,
        bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.12),
        '& .MuiChip-icon': { ml: 1, mr: -0.25 },
      }}
    />
  );
}

/* ------------------------------- Styling ------------------------------- */

const cellSx = {
  py: 0.55,
  px: 1.5,
  fontSize: 11,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  color: 'text.primary',
  borderColor: 'divider',
} as const;

// Header: tinted with the theme's primary colour. Built as paper + a tint layer so it stays
// fully opaque (needed for the sticky cells).
const headCellSx = {
  ...cellSx,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.2,
  bgcolor: 'background.paper',
  backgroundImage: (t: Theme) =>
    `linear-gradient(${alpha(t.palette.primary.main, 0.1)}, ${alpha(t.palette.primary.main, 0.1)})`,
  borderBottom: '2px solid',
  borderBottomColor: (t: Theme) => alpha(t.palette.primary.main, 0.45),
} as const;

const numericSx = {
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
} as const;

const stickyLeft = {
  position: 'sticky',
  left: 0,
  zIndex: 2,
  bgcolor: 'background.paper',
} as const;

// Action column stays pinned on the right: everything else scrolls underneath it
const stickyRight = {
  position: 'sticky',
  right: 0,
  zIndex: 2,
  bgcolor: 'background.paper',
  boxShadow: (t: Theme) => `-6px 0 8px -6px ${alpha(t.palette.common.black, 0.2)}`,
} as const;

// Small tinted square buttons (edit = primary, delete = error)
const actionBtnSx = (tone: Tone) =>
  ({
    p: 0.5,
    ml: 0.5,
    borderRadius: 1,
    color: `${tone}.main`,
    bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.1),
    '&:hover': { bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.22) },
  }) as const;

/* ---------------------- Multiple values in one cell (Vessel) ---------------------- */

const splitValues = (value: string) =>
  (value ?? '')
    .split(/[\n,;|]+/)
    .map((v) => v.trim())
    .filter(Boolean);

function MultiValue({ value, max = 2 }: { value: string; max?: number }) {
  const items = splitValues(value);
  if (items.length === 0) return <>—</>;

  const shown = items.slice(0, max);
  const rest = items.slice(max);

  return (
    <Stack spacing={0.25} alignItems="flex-start">
      {shown.map((v, i) => (
        <Box key={`${v}-${i}`} component="span" sx={{ display: 'block' }}>
          {v}
        </Box>
      ))}
      {rest.length > 0 && (
        <Tooltip arrow title={<Box sx={{ whiteSpace: 'pre-line' }}>{rest.join('\n')}</Box>}>
          <Chip
            size="small"
            label={`+${rest.length} more`}
            sx={{
              height: 18,
              fontSize: 10.5,
              fontWeight: 600,
              cursor: 'default',
              color: 'primary.main',
              bgcolor: (t: Theme) => alpha(t.palette.primary.main, 0.12),
            }}
          />
        </Tooltip>
      )}
    </Stack>
  );
}

/* ---------------------- Cell content (colours per column) ---------------------- */

function renderValue(col: Column, s: Manifest, maxVessel = 2): ReactNode {
  const value = s[col.key];

  switch (col.key) {
    case 'manifest_status':
      return <StatusChip status={value} />;
    case 'vessel':
      return <MultiValue value={value} max={maxVessel} />;
    case 'manifest_no':
      return <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>{value}</Box>;
    case 'internal_status':
      return (
        <Select
          size="small"
          displayEmpty
          defaultValue={value || ''}
          disabled={!isPreAlert(s.manifest_status)}
          renderValue={(v) => (v ? String(v) : <span style={{ opacity: 0.6 }}>Select an option</span>)}
          sx={{ minWidth: 150, fontSize: 12, '& .MuiSelect-select': { py: 0.4 } }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In progress">In progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      );
    default:
      return value || '—';
  }
}

/* -------------------- Multi-file (PDF + image) control -------------------- */

const fileMeta = {
  pdf: { label: 'PDF', Icon: PictureAsPdfIcon, color: 'error' },
} as const;

// TODO: remove when real files come from the API. Shown for any row without a `files` array.
const STATIC_FILES: ManifestFile[] = [
  { id: 's1', name: 'Packing list.pdf', url: '#', type: 'pdf' },
];

function ManifestFiles({ files }: { files?: ManifestFile[] }) {
  const allFiles = files ?? STATIC_FILES;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openType, setOpenType] = useState<ManifestFile['type'] | null>(null);

  const close = () => {
    setAnchorEl(null);
    setOpenType(null);
  };

  const openList = (e: React.MouseEvent<HTMLElement>, type: ManifestFile['type']) => {
    setAnchorEl(e.currentTarget);
    setOpenType(type);
  };

  const list = openType ? allFiles.filter((f) => f.type === openType) : [];

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        {(Object.keys(fileMeta) as ManifestFile['type'][]).map((type) => {
          const { label, Icon, color } = fileMeta[type];
          const count = allFiles.filter((f) => f.type === type).length;

          return (
            <Tooltip
              key={type}
              arrow
              title={count ? `${count} ${label}${count > 1 ? 's' : ''}` : `No ${label}`}
            >
              <span>
                <IconButton
                  size="small"
                  disabled={count === 0}
                  onClick={(e) => openList(e, type)}
                  aria-label={`View ${label} files`}
                  sx={{
                    p: 0.6,
                    borderRadius: 1.5,
                    color: `${color}.main`,
                    bgcolor: (t: Theme) => alpha(t.palette[color].main, 0.12),
                    '&:hover': { bgcolor: (t: Theme) => alpha(t.palette[color].main, 0.24) },
                    '&.Mui-disabled': { color: 'text.disabled', bgcolor: 'action.hover' },
                  }}
                >
                  <Badge
                    badgeContent={count}
                    color={color}
                    max={99}
                    sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 15, minWidth: 15, px: 0.5 } }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </Badge>
                </IconButton>
              </span>
            </Tooltip>
          );
        })}
      </Stack>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ sx: { width: 280, maxWidth: 'calc(100vw - 32px)', borderRadius: 2 } }}
      >
        {openType && (
          <>
            <Typography
              sx={{
                px: 1.5,
                py: 1,
                fontSize: 12,
                fontWeight: 700,
                color: `${fileMeta[openType].color}.main`,
              }}
            >
              {fileMeta[openType].label} files ({list.length})
            </Typography>
            <Divider />
            <List dense disablePadding sx={{ maxHeight: 260, overflowY: 'auto' }}>
              {list.map((file) => {
                const { Icon, color } = fileMeta[file.type];
                return (
                  <ListItemButton
                    key={file.id}
                    component="a"
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e: React.MouseEvent) => {
                      if (file.url === '#') e.preventDefault(); // static placeholder
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        variant="rounded"
                        src={file.type === 'image' && file.url !== '#' ? file.url : undefined}
                        sx={{
                          width: 28,
                          height: 28,
                          color: `${color}.main`,
                          bgcolor: (t: Theme) => alpha(t.palette[color].main, 0.14),
                        }}
                      >
                        <Icon sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={file.name}
                      primaryTypographyProps={{ noWrap: true, fontSize: 12.5 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </>
        )}
      </Popover>
    </>
  );
}

/* ------------------------------ Row actions ------------------------------ */
// charges · edit · copy · email · view · delete · Create PreAlert
// Hidden buttons leave an empty slot (table) so the icons line up across rows.

const Slot = ({ width = 25 }: { width?: number }) => (
  <Box
    component="span"
    sx={{ display: 'inline-block', width, ml: 0.5, verticalAlign: 'middle' }}
  />
);

function RowActions({
  row,
  onEdit,
  onView,
  compact = false,
}: {
  row: Manifest;
  onEdit: (row: Manifest) => void;
  onView: () => void;
  compact?: boolean; // mobile cards: no empty slots
}) {
  const preAlert = isPreAlert(row.manifest_status);
  const empty = (width?: number) => (compact ? null : <Slot width={width} />);

  return (
    <>
      {row.has_charges ? (
        <Tooltip title="Charges" placement="top">
          <IconButton size="small" aria-label="Charges" sx={actionBtnSx('success')}>
            <MonetizationOnIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      ) : (
        empty()
      )}

      {!preAlert ? (
        <Tooltip title="Edit" placement="top">
          <IconButton
            size="small"
            aria-label="Edit"
            onClick={() => onEdit(row)}
            sx={actionBtnSx('primary')}
          >
            <EditIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      ) : (
        empty()
      )}

      <Tooltip title="Copy" placement="top">
        <IconButton size="small" aria-label="Copy" sx={actionBtnSx('warning')}>
          <ContentCopyIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Email" placement="top">
        <IconButton size="small" aria-label="Email" sx={actionBtnSx('info')}>
          <EmailIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="View" placement="top">
        <IconButton size="small" aria-label="View" onClick={onView} sx={actionBtnSx('info')}>
          <VisibilityIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>

      {!preAlert ? (
        <Tooltip title="Delete" placement="top">
          <IconButton size="small" aria-label="Delete" sx={actionBtnSx('error')}>
            <DeleteIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      ) : (
        empty()
      )}

      {!preAlert ? (
        <Button
          size="small"
          variant="contained"
          disableElevation
          sx={{
            ml: 0.75,
            width: 112,
            py: 0.25,
            fontSize: 11.5,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 1,
            verticalAlign: 'middle',
          }}
        >
          Create PreAlert
        </Button>
      ) : (
        empty(112)
      )}
    </>
  );
}

/* ------------------------------ Component ------------------------------ */

export default function ManifestTable({
  manifests,
  paginatedManifests,
  page,
  rowsPerPage,
  selected,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
}: ManifestTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isSelected = (id: number) => selected.includes(id);

  const pageSelectedCount = paginatedManifests.filter((s) => isSelected(s.id)).length;
  const allOnPageSelected =
    paginatedManifests.length > 0 && pageSelectedCount === paginatedManifests.length;
  const someOnPageSelected =
    pageSelectedCount > 0 && pageSelectedCount < paginatedManifests.length;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<Manifest | null>(null);

  // View modal (static for now; later store the selected row and pass its id to ManifestView)
  const [viewOpen, setViewOpen] = useState(false);

  const handleEdit = (manifest: Manifest) => {
    setSelectedManifest(manifest);
    setDrawerOpen(true);
  };

  // keep these if your drawer component uses them
  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedManifest(null);
  };
  void drawerOpen;
  void selectedManifest;
  void handleClose;

  /* ---------------------------- Desktop / tablet ---------------------------- */
  const renderTable = () => (
    <TableContainer
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': { height: 8 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 4 },
      }}
    >
      <Table size="small" aria-label="Manifest list" sx={{ minWidth: 1900 }}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" sx={{ ...headCellSx, ...stickyLeft, px: 1 }}>
              <Checkbox
                size="small"
                checked={allOnPageSelected}
                indeterminate={someOnPageSelected}
                onChange={onSelectAllOnPage}
                sx={{ p: 0.5 }}
              />
            </TableCell>

            {columns.map((col) => (
              <TableCell key={col.key} sx={{ ...headCellSx, ...(col.numeric ? numericSx : {}) }}>
                {col.label}
              </TableCell>
            ))}

            <TableCell align="center" sx={headCellSx}>
              PDF
            </TableCell>
            <TableCell align="right" sx={{ ...headCellSx, ...stickyRight, px: 1.5, minWidth: 320 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedManifests.map((manifest) => {
            const checked = isSelected(manifest.id);

            return (
              <TableRow
                key={manifest.id}
                hover
                selected={checked}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell padding="checkbox" sx={{ ...cellSx, ...stickyLeft, px: 1 }}>
                  <Checkbox
                    size="small"
                    checked={checked}
                    onChange={() => onSelectRow(manifest.id)}
                    sx={{ p: 0.5 }}
                  />
                </TableCell>

                {columns.map((col) => (
                  <TableCell key={col.key} sx={{ ...cellSx, ...(col.numeric ? numericSx : {}) }}>
                    {renderValue(col, manifest)}
                  </TableCell>
                ))}

                <TableCell align="center" sx={cellSx}>
                  <ManifestFiles files={manifest.files} />
                </TableCell>

                <TableCell align="right" sx={{ ...cellSx, ...stickyRight, px: 1 }}>
                  <RowActions
                    row={manifest}
                    onEdit={handleEdit}
                    onView={() => setViewOpen(true)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  /* ------------------------------- Mobile cards ------------------------------- */
  const renderCards = () => (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{
          px: 1.25,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (t: Theme) => alpha(t.palette.primary.main, 0.06),
        }}
      >
        <Checkbox
          size="small"
          checked={allOnPageSelected}
          indeterminate={someOnPageSelected}
          onChange={onSelectAllOnPage}
          sx={{ p: 0.5 }}
        />
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
          {pageSelectedCount > 0 ? `${pageSelectedCount} selected` : 'Select all on page'}
        </Typography>
      </Stack>

      <Stack spacing={1.25} sx={{ p: 1.25 }}>
        {paginatedManifests.map((manifest) => {
          const checked = isSelected(manifest.id);
          const tone = getStatusTone(manifest.manifest_status);

          return (
            <Paper
              key={manifest.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                p: 1.25,
                borderColor: checked ? 'primary.main' : 'divider',
                borderLeft: '4px solid',
                borderLeftColor: `${tone}.main`, // status colour accent
                bgcolor: checked
                  ? (t: Theme) => alpha(t.palette.primary.main, 0.05)
                  : 'background.paper',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Checkbox
                  size="small"
                  checked={checked}
                  onChange={() => onSelectRow(manifest.id)}
                  sx={{ p: 0.5 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>
                    {manifest.vessel}
                  </Typography>
                  <Typography noWrap sx={{ fontSize: 11.5, fontWeight: 600, color: 'primary.main' }}>
                    {manifest.manifest_no}
                  </Typography>
                </Box>
                <StatusChip status={manifest.manifest_status} />
              </Stack>

              <Divider sx={{ my: 1.25 }} />

              <Box
                sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.25 }}
              >
                {columns
                  .filter((c) => !CARD_HEADER_KEYS.includes(c.key))
                  .map((col) => (
                    <Box key={col.key} sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                        {col.label}
                      </Typography>
                      <Box
                        component="div"
                        sx={{
                          fontSize: 12.5,
                          wordBreak: 'break-word',
                          fontVariantNumeric: col.numeric ? 'tabular-nums' : undefined,
                        }}
                      >
                        {renderValue(col, manifest, 99)}
                      </Box>
                    </Box>
                  ))}
              </Box>

              <Divider sx={{ my: 1.25 }} />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                <ManifestFiles files={manifest.files} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
                  <RowActions
                    row={manifest}
                    onEdit={handleEdit}
                    onView={() => setViewOpen(true)}
                    compact
                  />
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        // The table's wide content must never make the page wider: only the table scrolls.
        contain: 'inline-size',
      }}
    >
      {isMobile ? renderCards() : renderTable()}

      <TablePagination
        component="div"
        count={manifests.length}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
        labelRowsPerPage="Rows"
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          minHeight: 40,
          '.MuiTablePagination-toolbar': {
            minHeight: 40,
            px: 1,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          },
          '.MuiTablePagination-spacer': { display: 'none' },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: 12,
            m: 0,
          },
          '.MuiTablePagination-select': { fontSize: 12 },
        }}
      />

      {/* <ViewModal open={viewOpen} title="Manifest" onClose={() => setViewOpen(false)}>
        <ManifestView />
      </ViewModal> */}
    </Paper>
  );
}