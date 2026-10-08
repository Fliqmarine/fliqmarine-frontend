import {
  Box,
  Chip,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

/* ------------------------------- Static data ------------------------------- */
// TODO: replace with data from the API (fetch with `id`) when the backend is ready.

const stock = {
  stock_no: 'STK-10458',
  cargo_status: 'Received',
  station: 'Chennai',
  vessel: 'MV Ocean Star',
  client: 'Acme Trading LLC',
  supplier: 'Global Foods Ltd',
  po_number: 'PO-20458',
  arrival_date: '07-10-2026',
  entry_date: '07-10-2026',
  country_of_origin: 'India',
  cargo_description: 'Frozen seafood, packed in cartons',
  hs_code: '0306.17',
  storage_type: 'Frozen',
  mode_of_arrival: 'Sea',
  transit_id_no: 'TR-450021',
  eu_reference: 'EU-88213',
  currency: 'USD',
  cargo_value: '12,500.00',
  pickup_charges: true,
  fumigation: false,
  comments: 'Handle with care. Keep frozen at -18°C during transfer.',
};

const files = [
  { name: 'Packing list.pdf', type: 'pdf' },
  { name: 'Commercial invoice.pdf', type: 'pdf' },
  { name: 'Cargo photo 1.jpg', type: 'image' },
  { name: 'Cargo photo 2.jpg', type: 'image' },
  { name: 'Seal photo.jpg', type: 'image' },
] as const;

const charges = [
  { description: 'Handling', agent: 'Blue Line Agents', invoice_no: 'INV-1001', currency: 'USD', amount: 250 },
  { description: 'Customs clearance', agent: 'Prime Customs', invoice_no: 'INV-1002', currency: 'USD', amount: 180 },
];

// Rename to match your three icon columns on the form.
const FLAGS = [
  { key: 'flag1', label: 'Non-stackable', Icon: CancelOutlinedIcon, color: 'error' },
  { key: 'flag2', label: 'Turnable', Icon: AutorenewIcon, color: 'success' },
  { key: 'flag3', label: 'Dangerous', Icon: MedicalServicesIcon, color: 'error' },
] as const;

type CargoRow = {
  length: number; width: number; height: number;
  pieces: number; weight: number;
  flag1: boolean; flag2: boolean; flag3: boolean;
  package_type: string; cbm: number; cwt_air: number; cwt_cour: number; whl: string;
};

const cargoRows: CargoRow[] = [
  { length: 120, width: 80, height: 90, pieces: 10, weight: 450, flag1: false, flag2: true, flag3: false, package_type: 'Carton', cbm: 0.864, cwt_air: 144, cwt_cour: 172.8, whl: '' },
  { length: 100, width: 60, height: 70, pieces: 4, weight: 180, flag1: true, flag2: false, flag3: false, package_type: 'Pallet', cbm: 0.42, cwt_air: 70, cwt_cour: 84, whl: '' },
];

/* ------------------------------- Helpers ------------------------------- */

const sum = (n: number[]) => n.reduce((a, b) => a + b, 0);
const fmt = (n: number, d = 2) =>
  n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

type Tone = 'primary' | 'success' | 'warning' | 'info' | 'error';
const STATUS_RULES: { test: RegExp; tone: Tone }[] = [
  { test: /(receiv|in stock|available|arriv|complete|deliver)/i, tone: 'success' },
  { test: /(pend|hold|wait|partial|transit)/i, tone: 'warning' },
  { test: /(releas|dispatch|ship|load)/i, tone: 'info' },
  { test: /(damag|reject|cancel|short|missing|block)/i, tone: 'error' },
];
const statusTone = (s: string): Tone => STATUS_RULES.find((r) => r.test.test(s))?.tone ?? 'primary';

const shipmentInfo: [string, string][] = [
  ['Station', stock.station],
  ['Vessel', stock.vessel],
  ['Client', stock.client],
  ['Supplier', stock.supplier],
  ['PO Number', stock.po_number],
  ['Arrival Date', stock.arrival_date],
  ['Entry Date', stock.entry_date],
  ['Country of Origin', stock.country_of_origin],
];

const cargoInfo: [string, string][] = [
  ['Description', stock.cargo_description],
  ['HS Code', stock.hs_code],
  ['Storage Type', stock.storage_type],
  ['Mode of Arrival', stock.mode_of_arrival],
  ['Transit ID No', stock.transit_id_no],
  ['EU Reference', stock.eu_reference],
  ['Currency', stock.currency],
];

// Every grid wrapper uses this: without minmax(0, 1fr) a wide child (nowrap table) stretches the
// whole page and causes sideways scrolling.
const oneCol = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', minWidth: 0, width: '100%' } as const;

/* ---------------------------- Building blocks ---------------------------- */

function Heading({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 12.5,
        fontWeight: 700,
        color: 'text.primary',
        pb: 0.5,
        mb: 0.25,
        borderBottom: '2px solid',
        borderColor: (t: Theme) => alpha(t.palette.primary.main, 0.55),
      }}
    >
      {children}
    </Typography>
  );
}

// Desktop: label left, value right of it
function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ py: 0.55, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
    >
      <Typography sx={{ fontSize: 12, color: 'text.secondary', width: '38%', flexShrink: 0, lineHeight: 1.5 }}>
        {label}
      </Typography>
      <Box sx={{ fontSize: 12.5, fontWeight: 600, minWidth: 0, wordBreak: 'break-word', lineHeight: 1.5 }}>
        {value || '—'}
      </Box>
    </Stack>
  );
}

// Phone: label above value, two per line
function Cell({ label, value, span }: { label: string; value: ReactNode; span?: boolean }) {
  return (
    <Box sx={{ minWidth: 0, gridColumn: span ? '1 / -1' : undefined }}>
      <Typography sx={{ fontSize: 10.5, color: 'text.secondary', lineHeight: 1.3 }}>{label}</Typography>
      <Box sx={{ fontSize: 12, fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.35 }}>{value || '—'}</Box>
    </Box>
  );
}

function YesNoChips() {
  const chip = (label: string, on: boolean) => (
    <Chip
      key={label}
      size="small"
      label={`${label}: ${on ? 'Yes' : 'No'}`}
      sx={{
        height: 20,
        fontSize: 10.5,
        fontWeight: 600,
        color: on ? 'success.main' : 'text.secondary',
        bgcolor: (t: Theme) =>
          on ? alpha(t.palette.success.main, 0.12) : alpha(t.palette.text.secondary, 0.1),
      }}
    />
  );
  return (
    <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ pt: 0.75 }}>
      {chip('Pickup charges', stock.pickup_charges)}
      {chip('Fumigation', stock.fumigation)}
    </Stack>
  );
}

function Remarks() {
  if (!stock.comments) return null;
  return (
    <Box
      sx={{
        mt: 1,
        px: 1.25,
        py: 0.6,
        borderLeft: '3px solid',
        borderColor: 'warning.main',
        bgcolor: (t: Theme) => alpha(t.palette.warning.main, 0.07),
        borderRadius: '0 6px 6px 0',
      }}
    >
      <Typography sx={{ fontSize: 11.5, lineHeight: 1.45 }}>
        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>Remarks: </Box>
        {stock.comments}
      </Typography>
    </Box>
  );
}

function HandlingChips({ row }: { row: CargoRow }) {
  const active = FLAGS.filter((f) => row[f.key]);
  if (active.length === 0) return <>—</>;
  return (
    <Stack direction="row" gap={0.5} flexWrap="wrap">
      {active.map(({ key, label, Icon, color }) => (
        <Chip
          key={key}
          size="small"
          icon={<Icon sx={{ fontSize: '13px !important' }} />}
          label={label}
          sx={{
            height: 19,
            fontSize: 10.5,
            fontWeight: 600,
            color: `${color}.main`,
            bgcolor: (t: Theme) => alpha(t.palette[color].main, 0.1),
            '& .MuiChip-icon': { color: `${color}.main` },
          }}
        />
      ))}
    </Stack>
  );
}

function ChargesBlock() {
  const total = sum(charges.map((c) => c.amount));
  return (
    <Box sx={{ minWidth: 0 }}>
      <Heading>Charges</Heading>
      {charges.length === 0 ? (
        <Typography sx={{ fontSize: 12, color: 'text.secondary', py: 0.75 }}>No charges added.</Typography>
      ) : (
        <>
          {charges.map((c, i) => (
            <Box
              key={i}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                columnGap: 1.5,
                alignItems: 'center',
                py: 0.55,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.35 }}>
                  {c.description}
                </Typography>
                <Typography noWrap sx={{ fontSize: 10.5, color: 'text.secondary', lineHeight: 1.3 }}>
                  {c.agent}, {c.invoice_no}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                {c.currency} {fmt(c.amount)}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              py: 0.55,
              px: 0.75,
              mt: 0.5,
              borderRadius: 1,
              bgcolor: (t: Theme) => alpha(t.palette.primary.main, 0.07),
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>Total</Typography>
            <Typography sx={{ fontSize: 12.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {charges[0].currency} {fmt(total)}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

function FilesBlock() {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Heading>Attachments</Heading>
      {files.length === 0 ? (
        <Typography sx={{ fontSize: 12, color: 'text.secondary', py: 0.75 }}>No files attached.</Typography>
      ) : (
        files.map((f) => {
          const Icon = f.type === 'pdf' ? PictureAsPdfIcon : ImageIcon;
          const tone = f.type === 'pdf' ? 'error' : 'info';
          return (
            <Box
              key={f.name}
              component="a"
              href="#" // TODO: real file url
              onClick={(e: React.MouseEvent) => e.preventDefault()}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                alignItems: 'center',
                columnGap: 1,
                py: 0.5,
                px: 0.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { bgcolor: 'action.hover' },
                '&:last-child': { borderBottom: 0 },
              }}
            >
              <Icon sx={{ fontSize: 17, color: `${tone}.main` }} />
              <Typography noWrap sx={{ fontSize: 12, fontWeight: 500 }}>{f.name}</Typography>
              <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>
                {f.type === 'pdf' ? 'PDF' : 'Image'}
              </Typography>
            </Box>
          );
        })
      )}
    </Box>
  );
}

const cellSx = { py: 0.55, px: 1.25, fontSize: 12, whiteSpace: 'nowrap', borderColor: 'divider' } as const;
const headCellSx = {
  ...cellSx,
  fontWeight: 700,
  fontSize: 11.5,
  bgcolor: (t: Theme) => alpha(t.palette.primary.main, 0.08),
  borderBottom: '1px solid',
  borderBottomColor: (t: Theme) => alpha(t.palette.primary.main, 0.35),
} as const;
const numSx = { textAlign: 'right', fontVariantNumeric: 'tabular-nums' } as const;

function CargoTable() {
  const totals = {
    pieces: sum(cargoRows.map((r) => r.pieces)),
    weight: sum(cargoRows.map((r) => r.weight)),
    cbm: sum(cargoRows.map((r) => r.cbm)),
  };
  const totalCell = {
    ...cellSx,
    ...numSx,
    fontWeight: 700,
    border: 0,
    bgcolor: (t: Theme) => alpha(t.palette.primary.main, 0.05),
  } as const;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Heading>Cargo lines</Heading>
      <TableContainer sx={{ overflowX: 'auto', mt: 0.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
        <Table size="small" aria-label="Cargo lines" sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headCellSx}>Dimensions (cm)</TableCell>
              <TableCell sx={headCellSx}>Package</TableCell>
              <TableCell sx={{ ...headCellSx, ...numSx }}>Pieces</TableCell>
              <TableCell sx={{ ...headCellSx, ...numSx }}>Weight (kg)</TableCell>
              <TableCell sx={{ ...headCellSx, ...numSx }}>CBM</TableCell>
              <TableCell sx={{ ...headCellSx, ...numSx }}>CWT Air</TableCell>
              <TableCell sx={{ ...headCellSx, ...numSx }}>CWT Cour</TableCell>
              <TableCell sx={{ ...headCellSx, ...numSx }}>WHL</TableCell>
              <TableCell sx={headCellSx}>Handling</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargoRows.map((r, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ ...cellSx, fontWeight: 600 }}>{r.length} × {r.width} × {r.height}</TableCell>
                <TableCell sx={cellSx}>{r.package_type}</TableCell>
                <TableCell sx={{ ...cellSx, ...numSx }}>{fmt(r.pieces, 0)}</TableCell>
                <TableCell sx={{ ...cellSx, ...numSx }}>{fmt(r.weight, 1)}</TableCell>
                <TableCell sx={{ ...cellSx, ...numSx }}>{fmt(r.cbm, 3)}</TableCell>
                <TableCell sx={{ ...cellSx, ...numSx }}>{fmt(r.cwt_air, 1)}</TableCell>
                <TableCell sx={{ ...cellSx, ...numSx }}>{fmt(r.cwt_cour, 1)}</TableCell>
                <TableCell sx={{ ...cellSx, ...numSx }}>{r.whl || '—'}</TableCell>
                <TableCell sx={cellSx}><HandlingChips row={r} /></TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ ...totalCell, textAlign: 'left' }} colSpan={2}>Total</TableCell>
              <TableCell sx={totalCell}>{fmt(totals.pieces, 0)}</TableCell>
              <TableCell sx={totalCell}>{fmt(totals.weight, 1)}</TableCell>
              <TableCell sx={totalCell}>{fmt(totals.cbm, 3)}</TableCell>
              <TableCell sx={totalCell} colSpan={4} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function CargoCards() {
  return (
    <Stack spacing={0.75}>
      {cargoRows.map((r, i) => (
        <Paper key={i} variant="outlined" sx={{ p: 1, borderRadius: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>
              {r.length} × {r.width} × {r.height} cm
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>{r.package_type}</Typography>
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 0.75, my: 0.75 }}>
            <Cell label="Pieces" value={fmt(r.pieces, 0)} />
            <Cell label="Weight" value={`${fmt(r.weight, 1)} kg`} />
            <Cell label="CBM" value={fmt(r.cbm, 3)} />
            <Cell label="CWT Air" value={fmt(r.cwt_air, 1)} />
            <Cell label="CWT Cour" value={fmt(r.cwt_cour, 1)} />
            <Cell label="WHL" value={r.whl} />
          </Box>
          <HandlingChips row={r} />
        </Paper>
      ))}
    </Stack>
  );
}

/* ------------------------------ Page ------------------------------ */

export default function StockView({ id }: { id?: number | string }) {
  void id; // used later to fetch the real record

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tab, setTab] = useState(0);

  const tone = statusTone(stock.cargo_status);
  const totals = [
    { label: 'Pieces', value: fmt(sum(cargoRows.map((r) => r.pieces)), 0) },
    { label: 'Weight (kg)', value: fmt(sum(cargoRows.map((r) => r.weight)), 1) },
    { label: 'CBM', value: fmt(sum(cargoRows.map((r) => r.cbm)), 3) },
    { label: `Value (${stock.currency})`, value: stock.cargo_value },
  ];

  const header = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) auto' },
        alignItems: 'center',
        gap: { xs: 1, md: 3 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontSize: 19, fontWeight: 800, color: 'primary.main', lineHeight: 1.2 }}>
            {stock.stock_no}
          </Typography>
          <Chip
            size="small"
            label={stock.cargo_status}
            sx={{
              height: 21,
              fontSize: 11,
              fontWeight: 700,
              color: `${tone}.main`,
              bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.14),
            }}
          />
        </Stack>
        <Typography noWrap sx={{ fontSize: 12.5, color: 'text.secondary', mt: 0.25 }}>
          {stock.client} from {stock.supplier}
        </Typography>
      </Box>

      {/* <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1px',
          bgcolor: 'divider',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {totals.map((t) => (
          <Box key={t.label} sx={{ bgcolor: 'background.paper', px: { xs: 0.9, md: 2 }, py: 0.6, minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 10.5, color: 'text.secondary', lineHeight: 1.3 }}>
              {t.label}
            </Typography>
            <Typography
              noWrap
              sx={{ fontSize: { xs: 12.5, md: 15.5 }, fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.35 }}
            >
              {t.value}
            </Typography>
          </Box>
        ))}
      </Box> */}
    </Box>
  );

  /* Phone: tabs, each tab fits one screen */
  if (isMobile) {
    return (
      <Box sx={{ ...oneCol, gap: 1 }}>
        {header}

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 34,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': { minHeight: 34, py: 0, fontSize: 12, fontWeight: 600, textTransform: 'none' },
          }}
        >
          <Tab label="Details" />
          <Tab label="Cargo" />
          <Tab label="Charges & files" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
              {shipmentInfo.map(([l, v]) => (
                <Cell key={l} label={l} value={v} />
              ))}
              {cargoInfo.map(([l, v]) => (
                <Cell key={l} label={l} value={v} span={l === 'Description'} />
              ))}
            </Box>
            <YesNoChips />
            <Remarks />
          </Box>
        )}

        {tab === 1 && <CargoCards />}

        {tab === 2 && (
          <Box sx={{ ...oneCol, gap: 1.5 }}>
            <ChargesBlock />
            <FilesBlock />
          </Box>
        )}
      </Box>
    );
  }

  /* Desktop: everything on one screen */
  const colSx = {
    minWidth: 0,
    px: 2.5,
    '&:first-of-type': { pl: 0 },
    '&:last-of-type': { pr: 0 },
    '&:not(:first-of-type)': { borderLeft: '1px solid', borderColor: 'divider' },
  } as const;

  return (
    <Box sx={{ ...oneCol, gap: 1.75 }}>
      {header}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'start' }}>
        <Box sx={colSx}>
          <Heading>Shipment</Heading>
          {shipmentInfo.map(([l, v]) => (
            <Row key={l} label={l} value={v} />
          ))}
        </Box>

        <Box sx={colSx}>
          <Heading>Cargo</Heading>
          {cargoInfo.map(([l, v]) => (
            <Row key={l} label={l} value={v} />
          ))}
          <YesNoChips />
          <Remarks />
        </Box>

        <Box sx={{ ...colSx, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', rowGap: 1.5 }}>
          <ChargesBlock />
          <FilesBlock />
        </Box>
      </Box>

      <CargoTable />
    </Box>
  );
}