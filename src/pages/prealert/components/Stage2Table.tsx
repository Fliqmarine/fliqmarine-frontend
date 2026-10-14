import {
  ContentCopy as ContentCopyIcon,
  DescriptionOutlined,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  Paper,
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
import type { ReactNode } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import MailIcon from '@mui/icons-material/Mail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import VerifiedIcon from '@mui/icons-material/Verified';

/* ------------------------------- Types ------------------------------- */

export type Stage2 = {
  id: number;
  stage: string; // 'Stage 1' | 'Stage 3'
  date: string;
  ref_no: string;
  vessels: string[];
  hub: string;
  mode: string; // Air | Sea | Hand Carry | Onboard Delivery
  origin: string;
  destination: string;
  packages: number;
  weight: number;
  awb_no: string;
  carrier: string;
  etd: string;
  eta: string;
  prealert_docs: number;
  awb_docs: number;
  pod_docs: number;
  distance: number | null;
};

type Stage2TableProps = {
  rows: Stage2[]; // all rows after filtering
  paginatedRows: Stage2[]; // rows on the current page
  page: number; // 0-based
  rowsPerPage: number;
  selected: number[];
  totalCount?: number; // pass the server total when paging on the API
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (id: number) => void;
  onSelectAllOnPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPod?: (row: Stage2) => void;
  onDistance?: (row: Stage2) => void;
  onMailSent?: (row: Stage2) => void;
  onCopy?: (row: Stage2) => void;
};

type Tone = 'primary' | 'success' | 'warning' | 'info' | 'error';

/* ------------------------- Tones (stage / mode) ------------------------- */

const stageTone = (stage: string): Tone => (stage === 'Stage 1' ? 'info' : 'error');
const modeTone = (mode: string): Tone =>
  mode === 'Sea' || mode === 'Onboard Delivery' ? 'info' : 'error';

function ToneChip({ label, tone }: { label: string; tone: Tone }) {
  return (
    <Chip
      size="small"
      label={label}
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

// Header tinted with the primary colour, kept fully opaque for the sticky cells
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

// Action column stays pinned on the right while everything else scrolls under it
const stickyRight = {
  position: 'sticky',
  right: 0,
  zIndex: 2,
  bgcolor: 'background.paper',
  boxShadow: (t: Theme) => `-6px 0 8px -6px ${alpha(t.palette.common.black, 0.2)}`,
} as const;

// Small tinted square icon button
const actionBtnSx = (tone: Tone) =>
  ({
    p: 0.5,
    ml: 0.5,
    borderRadius: 1,
    color: `${tone}.main`,
    bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.1),
    '&:hover': { bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.22) },
  }) as const;

// Small tinted text button (Add POD / Distance / Mail Sent)
const textBtnSx = (tone: Tone) =>
  ({
    minWidth: 0,
    px: 1.25,
    py: 0.25,
    ml: 0.5,
    fontSize: 11.5,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 1,
    color: `${tone}.main`,
    bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.1),
    '&:hover': { bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.22) },
  }) as const;

/* ---------------------- Vessels (several values in one cell) ---------------------- */

function MultiValue({ items, max = 2 }: { items: string[]; max?: number }) {
  if (!items || items.length === 0) return <>—</>;

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

/* ---------------------------- Document count badge ---------------------------- */

function DocBadge({ count, label, tone }: { count: number; label: string; tone: Tone }) {
  const active = count > 0;
  return (
    <Tooltip arrow title={active ? `${count} ${label}` : `No ${label}`}>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          p: 0.6,
          borderRadius: 1.5,
          color: active ? `${tone}.main` : 'text.disabled',
          bgcolor: active ? (t: Theme) => alpha(t.palette[tone].main, 0.12) : 'action.hover',
        }}
      >
        <Badge
          badgeContent={count}
          color={tone}
          max={99}
          sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 15, minWidth: 15, px: 0.5 } }}
        >
          <DescriptionOutlined sx={{ fontSize: 18 }} />
        </Badge>
      </Box>
    </Tooltip>
  );
}

/* ------------------------- Column configuration ------------------------- */

type Column = {
  key: string;
  label: string;
  numeric?: boolean;
  align?: 'left' | 'center';
  render: (r: Stage2, maxVessel?: number) => ReactNode;
};

const text = (v: string | number | null | undefined) => (v === null || v === undefined || v === '' ? '—' : v);

const columns: Column[] = [
  { key: 'stage', label: 'Stage', render: (r) => <ToneChip label={r.stage} tone={stageTone(r.stage)} /> },
  { key: 'date', label: 'Date', render: (r) => text(r.date) },
  {
    key: 'ref_no',
    label: 'Manifest',
    render: (r) => (
      <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
        {text(r.ref_no)}
      </Box>
    ),
  },
  { key: 'vessels', label: 'Vessel', render: (r, max = 2) => <MultiValue items={r.vessels} max={max} /> },
  { key: 'hub', label: 'Hub', render: (r) => text(r.hub) },
  { key: 'mode', label: 'Mode', render: (r) => <ToneChip label={r.mode} tone={modeTone(r.mode)} /> },
  { key: 'origin', label: 'Origin', render: (r) => text(r.origin) },
  { key: 'destination', label: 'Destination', render: (r) => text(r.destination) },
  { key: 'packages', label: 'No of Packages', numeric: true, render: (r) => text(r.packages) },
  { key: 'weight', label: 'Total Weight (KGS)', numeric: true, render: (r) => text(r.weight) },
  { key: 'awb_no', label: 'AWB No.', render: (r) => text(r.awb_no) },
  { key: 'carrier', label: 'Carrier/Airline Details', render: (r) => text(r.carrier) },
  { key: 'etd', label: 'ETD', render: (r) => text(r.etd) },
  { key: 'eta', label: 'ETA', render: (r) => text(r.eta) },
  {
    key: 'prealert_docs',
    label: 'Prealert Docs',
    align: 'center',
    render: (r) => <DocBadge count={r.prealert_docs} label="Prealert docs" tone="primary" />,
  },
  {
    key: 'awb_docs',
    label: 'AWB',
    align: 'center',
    render: (r) => <DocBadge count={r.awb_docs} label="AWB docs" tone="warning" />,
  },
  {
    key: 'pod_docs',
    label: 'POD',
    align: 'center',
    render: (r) => <DocBadge count={r.pod_docs} label="POD docs" tone="success" />,
  },
  { key: 'distance', label: 'Distance', numeric: true, render: (r) => text(r.distance) },
];

// Fields shown in the mobile card header instead of the grid
const CARD_HEADER_KEYS = ['vessels', 'ref_no', 'stage'];

/* ------------------------------ Row actions ------------------------------ */

type RowActionsProps = {
  row: Stage2;
  onAddPod?: (row: Stage2) => void;
  onDistance?: (row: Stage2) => void;
  onMailSent?: (row: Stage2) => void;
  onCopy?: (row: Stage2) => void;
};

function RowActions({ row, onAddPod, onDistance, onMailSent, onCopy }: RowActionsProps) {
  return (
    <>
      <Tooltip title="Cancel Pre Alert" placement="top">
        <IconButton size="small" aria-label="Cancel" onClick={() => onCopy?.(row)} sx={actionBtnSx('error')}>
          <CancelIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Mail" placement="top">
        <IconButton size="small" aria-label="Cancel" onClick={() => onCopy?.(row)} sx={actionBtnSx('info')}>
          <MailIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Custom Clearance" placement="top">
        <IconButton size="small" aria-label="Custom Clearance" onClick={() => onDistance?.(row)} sx={actionBtnSx('success')}>
          <FactCheckIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Stock Received" placement="top">
        <IconButton size="small" aria-label="Stock Received" onClick={() => onDistance?.(row)} sx={actionBtnSx('warning')}>
          <MoveToInboxIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip> 
      <Tooltip title="Complete" placement="top">
        <IconButton size="small" aria-label="Complete" onClick={() => onDistance?.(row)} sx={actionBtnSx('success')}>
          <VerifiedIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip> 
    </>
  );
}

/* ------------------------------ Component ------------------------------ */

export default function Stage2Table({
  rows,
  paginatedRows,
  page,
  rowsPerPage,
  selected,
  totalCount,
  onChangePage,
  onChangeRowsPerPage,
  onSelectRow,
  onSelectAllOnPage,
  onAddPod,
  onDistance,
  onMailSent,
  onCopy,
}: Stage2TableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const total = totalCount ?? rows.length;

  const isSelected = (id: number) => selected.includes(id);
  const pageSelectedCount = paginatedRows.filter((r) => isSelected(r.id)).length;
  const allOnPageSelected = paginatedRows.length > 0 && pageSelectedCount === paginatedRows.length;
  const someOnPageSelected = pageSelectedCount > 0 && pageSelectedCount < paginatedRows.length;

  const actionProps = { onAddPod, onDistance, onMailSent, onCopy };

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
      <Table size="small" aria-label="All stage list" sx={{ minWidth: 2100 }}>
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
              <TableCell
                key={col.key}
                align={col.align}
                sx={{ ...headCellSx, ...(col.numeric ? numericSx : {}) }}
              >
                {col.label}
              </TableCell>
            ))}

            <TableCell align="right" sx={{ ...headCellSx, ...stickyRight, px: 1.5, minWidth: 300 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedRows.map((row) => {
            const checked = isSelected(row.id);

            return (
              <TableRow
                key={row.id}
                hover
                selected={checked}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell padding="checkbox" sx={{ ...cellSx, ...stickyLeft, px: 1 }}>
                  <Checkbox
                    size="small"
                    checked={checked}
                    onChange={() => onSelectRow(row.id)}
                    sx={{ p: 0.5 }}
                  />
                </TableCell>

                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.align}
                    sx={{ ...cellSx, ...(col.numeric ? numericSx : {}) }}
                  >
                    {col.render(row)}
                  </TableCell>
                ))}

                <TableCell align="right" sx={{ ...cellSx, ...stickyRight, px: 1 }}>
                  <RowActions row={row} {...actionProps} />
                </TableCell>
              </TableRow>
            );
          })}

          {paginatedRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + 2} align="center" sx={{ ...cellSx, py: 4, fontSize: 12 }}>
                No results match your filters.
              </TableCell>
            </TableRow>
          )}
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
        {paginatedRows.length === 0 && (
          <Typography align="center" sx={{ py: 3, fontSize: 12 }}>
            No results match your filters.
          </Typography>
        )}

        {paginatedRows.map((row) => {
          const checked = isSelected(row.id);
          const tone = stageTone(row.stage);

          return (
            <Paper
              key={row.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                p: 1.25,
                borderColor: checked ? 'primary.main' : 'divider',
                borderLeft: '4px solid',
                borderLeftColor: `${tone}.main`, // stage colour accent
                bgcolor: checked
                  ? (t: Theme) => alpha(t.palette.primary.main, 0.05)
                  : 'background.paper',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Checkbox
                  size="small"
                  checked={checked}
                  onChange={() => onSelectRow(row.id)}
                  sx={{ p: 0.5 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>
                    {row.vessels.join(', ') || '—'}
                  </Typography>
                  <Typography noWrap sx={{ fontSize: 11.5, fontWeight: 600, color: 'primary.main' }}>
                    {row.ref_no}
                  </Typography>
                </Box>
                <ToneChip label={row.stage} tone={tone} />
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
                        {col.render(row, 99)}
                      </Box>
                    </Box>
                  ))}
              </Box>

              <Divider sx={{ my: 1.25 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
                <RowActions row={row} {...actionProps} />
              </Box>
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
        // The wide table must never make the page wider: only the table scrolls
        contain: 'inline-size',
      }}
    >
      {isMobile ? renderCards() : renderTable()}

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[10, 15, 25, 50, 100]}
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
    </Paper>
  );
}