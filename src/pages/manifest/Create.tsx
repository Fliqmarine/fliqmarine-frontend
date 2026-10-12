import {
  Autocomplete, Box, Button, Checkbox, Chip, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/* ------------------------------- Sample data ------------------------------- */

const CLIENTS = ['Providence Ship Management pte ltd', 'V.Ships Offshore (Asia) Pte Ltd'];
const VESSELS = ['SOL STRAITS (Providence Ship Management pte ltd)', 'AM PASSION (V.Ships Offshore (Asia) Pte Ltd)', 'JAG LAXMAN'];
const STATIONS = ['SIN-HUB', 'DXB-STEADFAST', 'PVG-HUB'];
const MODES = ['Air', 'Courier', 'Release', 'Onboard Delivery'];
const AIRPORTS = ['SIN (Singapore)', 'DXB (Dubai)', 'AMS (Netherlands)', 'BNE (Australia)'];
const COUNTRIES = ['Singapore', 'United Arab Emirates', 'Netherlands', 'Australia'];

const STOCK = [
  { id: 1, vessel: 'SOL STRAITS', stock_no: 'SIN0071', station: 'SIN-HUB', date: '21-08-2023', supplier: 'BORPO MARINE', po: 'STR-S235052B', pkgs: 1, weight: 1, cbm: 0.104098, value: 100, status: 'Stock' },
  { id: 2, vessel: 'SOL STRAITS', stock_no: 'SIN0072', station: 'SIN-HUB', date: '22-08-2023', supplier: 'BORPO MARINE', po: 'STR-S235053C', pkgs: 3, weight: 12, cbm: 0.25, value: 1285, status: 'Hold' },
  { id: 3, vessel: 'SOL STRAITS', stock_no: 'SIN0073', station: 'SIN-HUB', date: '24-08-2023', supplier: 'BORPO MARINE', po: 'STR-S235054D', pkgs: 2, weight: 8, cbm: 0.18, value: 1000, status: 'Pending' },
];
type Row = (typeof STOCK)[number];

// [column title, row key, right-aligned number?]
const COLUMNS = [
  ['Vessel', 'vessel'], ['Stock ID', 'stock_no'], ['Station', 'station'], ['Date', 'date'],
  ['Supplier', 'supplier'], ['PO no', 'po'], ['Pkgs', 'pkgs', true], ['Weight (kg)', 'weight', true],
  ['CBM', 'cbm', true], ['Value', 'value', true],
] as const;

/* --------------------------------- Helpers --------------------------------- */

const usd = (n: number) => `${n.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`;
const statusColor = (s: string) => (/hold|pend/i.test(s) ? 'warning' : 'success');
const show = (row: Row, key: keyof Row) => (key === 'value' ? usd(row.value) : key === 'cbm' ? row.cbm.toFixed(6) : row[key]);
const shortName = (s: string) => s.split(' (')[0]; // "SOL STRAITS (Client)" -> "SOL STRAITS"

// Makes the page exactly as tall as the free screen space, so only the table scrolls (tablet/desktop).
function useFitHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const fit = () => setHeight(window.innerHeight - ref.current!.getBoundingClientRect().top);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return { ref, height };
}

// Every field is the same height: bigger and 16px text on phones (easy to tap, no iOS zoom)
const FIELD_HEIGHT = { xs: 44, md: 36 };
const FONT_SIZE = { xs: 16, md: 13 };
const inputSx = {
  '& .MuiOutlinedInput-root': { fontSize: FONT_SIZE, minHeight: FIELD_HEIGHT, py: '3px !important' },
  '& .MuiOutlinedInput-input': { py: '0 !important', height: 'auto' },
  '& .MuiInputBase-multiline': { py: '8px !important' }, // address box may be taller
};
const buttonSx = { textTransform: 'none', height: FIELD_HEIGHT, px: 3, flex: { xs: 1, md: 'none' } } as const;

// Field grid: 1 column on phones, 2 on large phones, then `md` / `lg` columns
const grid = (md: number, lg: number) => ({
  display: 'grid',
  gap: { xs: 1.5, md: 1.25 },
  p: 1.5,
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: `repeat(${md}, minmax(0, 1fr))`,
    lg: `repeat(${lg}, minmax(0, 1fr))`,
  },
});

/* -------------------------------- Components -------------------------------- */

function Section({ title, children, sx }: { title: string; children: ReactNode; sx?: object }) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, ...sx }}>
      <Typography sx={{ px: 1.5, py: 0.75, fontSize: 14, fontWeight: 700, bgcolor: 'action.hover', borderBottom: 1, borderColor: 'divider' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

function Field({ label, required, wide, span2, children }: { label: string; required?: boolean; wide?: boolean; span2?: boolean; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0, gridColumn: wide ? '1 / -1' : span2 ? { xs: '1 / -1', md: 'span 2' } : undefined }}>
      <Typography noWrap sx={{ fontSize: { xs: 13, md: 12 }, fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </Typography>
      {children}
    </Box>
  );
}

// Dropdown. With `multiple`: tick-boxes in the list, and every choice shows as a removable chip in the box.
function Select({ options, multiple, defaultValue }: { options: string[]; multiple?: boolean; defaultValue?: any }) {
  return (
    <Autocomplete
      size="small"
      options={options}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      defaultValue={defaultValue ?? (multiple ? [] : null)}
      renderInput={(params) => <TextField {...params} placeholder="Select" sx={inputSx} />}
      renderOption={
        multiple
          ? ({ key, ...props }: any, option: string, { selected }) => (
              <li key={key} {...props}>
                <Checkbox size="small" checked={selected} sx={{ p: 0.5, mr: 1 }} />
                {option}
              </li>
            )
          : undefined
      }
      renderTags={(value: string[], getTagProps) =>
        value.map((v, index) => {
          const { key, ...tag } = getTagProps({ index });
          return <Chip key={key} {...tag} size="small" label={shortName(v)} sx={{ height: 24, fontSize: 12 }} />;
        })
      }
    />
  );
}

// Text / date / email box (add `rows` for a bigger box)
const Input = (props: { type?: string; rows?: number; placeholder?: string }) => (
  <TextField size="small" fullWidth multiline={!!props.rows} sx={inputSx} {...props} />
);

/* ----------------------------------- Page ----------------------------------- */

export default function ManifestForm({
  onCancel = () => console.log('Cancel'),
  onCreate = (ids: number[]) => console.log('Create manifest', ids),
}: {
  onCancel?: () => void;
  onCreate?: (selectedIds: number[]) => void;
}) {
  const { ref, height } = useFitHeight();
  const [selected, setSelected] = useState<number[]>([1]);

  const allChecked = selected.length === STOCK.length;
  const toggle = (id: number) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () => setSelected(allChecked ? [] : STOCK.map((r) => r.id));

  // Totals for the ticked rows
  const rows = STOCK.filter((r) => selected.includes(r.id));
  const sum = (key: 'pkgs' | 'weight' | 'cbm' | 'value') => rows.reduce((total, r) => total + r[key], 0);
  const totals = [
    ['Total packages', `${sum('pkgs')} pcs`],
    ['Total weight', `${sum('weight')} kg`],
    ['Total CBM', sum('cbm').toFixed(6)],
    ['Total value', usd(sum('value'))],
  ];

  return (
    <Box
      ref={ref}
      sx={{
        // Phones: normal page that scrolls. Tablet/desktop: fits the screen, only the table scrolls.
        height: { xs: 'auto', md: height || '100dvh' },
        overflow: { xs: 'visible', md: 'auto', lg: 'hidden' },
        boxSizing: 'border-box',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {/* Manifest + Consignee, side by side on large screens */}
      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
        <Section title="Manifest details">
          <Box sx={grid(4, 3)}>
            <Field label="Client" required><Select options={CLIENTS} defaultValue={CLIENTS[0]} /></Field>
            <Field label="Vessel" required span2><Select options={VESSELS} multiple defaultValue={[VESSELS[0]]} /></Field>
            <Field label="Station code" required><Select options={STATIONS} defaultValue="SIN-HUB" /></Field>
            <Field label="Mode" required><Select options={MODES} /></Field>
            <Field label="Activation" required><Input type="date" /></Field>
            <Field label="Deadline" required><Input type="date" /></Field>
            <Field label="Airport code (origin)" required><Select options={AIRPORTS} defaultValue="SIN (Singapore)" /></Field>
            <Field label="Customer PO ref"><Input placeholder="Enter PO reference" /></Field>
          </Box>
        </Section>

        <Section title="Consignee details">
          <Box sx={grid(3, 3)}>
            <Field label="Consignee" required><Select options={CLIENTS} /></Field>
            <Field label="Country" required><Select options={COUNTRIES} /></Field>
            <Field label="Airport code (destination)" required><Select options={AIRPORTS} /></Field>
            <Field label="Email"><Input type="email" /></Field>
            <Field label="Telephone"><Input type="tel" /></Field>
            <Field label="Notify party"><Input /></Field>
            <Field label="Consignee address" wide><Input rows={2} /></Field>
          </Box>
        </Section>
      </Box>

      {/* Stock: table on tablet/desktop (only part that scrolls), tap-to-select cards on phones */}
      <Section title={`Stock (${selected.length}/${STOCK.length} selected)`} sx={{ flex: 1, minHeight: { md: 130 } }}>
        {/* Phones: cards */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1, p: 1 }}>
          {STOCK.map((row) => {
            const on = selected.includes(row.id);
            return (
              <Paper
                key={row.id}
                variant="outlined"
                onClick={() => toggle(row.id)}
                sx={{ p: 1.5, borderRadius: 2, borderColor: on ? 'primary.main' : 'divider', bgcolor: on ? 'action.selected' : 'transparent' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox checked={on} onChange={() => toggle(row.id)} onClick={(e) => e.stopPropagation()} sx={{ p: 0.5, ml: -0.5 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>{row.stock_no}</Typography>
                    <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{row.vessel} / {row.station}</Typography>
                  </Box>
                  <Chip size="small" variant="outlined" label={row.status} color={statusColor(row.status)} />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1.25 }}>
                  {COLUMNS.slice(3).map(([title, key]) => (
                    <Box key={title} sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{title}</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-word' }}>{show(row, key)}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            );
          })}
        </Box>

        {/* Tablet / desktop: table */}
        <TableContainer sx={{ display: { xs: 'none', md: 'block' }, flex: 1 }}>
          <Table stickyHeader size="small" sx={{ minWidth: 900, '& td, & th': { fontSize: 13, whiteSpace: 'nowrap' } }}>
            <TableHead>
              <TableRow>
                {COLUMNS.map(([title, , right]) => (
                  <TableCell key={title} align={right ? 'right' : 'left'} sx={{ fontWeight: 700 }}>{title}</TableCell>
                ))}
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell padding="checkbox"><Checkbox size="small" checked={allChecked} indeterminate={selected.length > 0 && !allChecked} onChange={toggleAll} /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {STOCK.map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                  {COLUMNS.map(([title, key, right]) => (
                    <TableCell key={title} align={right ? 'right' : 'left'}>{show(row, key)}</TableCell>
                  ))}
                  <TableCell><Chip size="small" variant="outlined" label={row.status} color={statusColor(row.status)} /></TableCell>
                  <TableCell padding="checkbox"><Checkbox size="small" checked={selected.includes(row.id)} onChange={() => toggle(row.id)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* Totals + buttons (pinned to the bottom of the screen on phones) */}
      <Paper
        variant="outlined"
        sx={{
          p: 1.25,
          borderRadius: 2,
          position: { xs: 'sticky', md: 'static' },
          bottom: 0,
          zIndex: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, auto)' }, columnGap: 4, rowGap: 0.5, width: { xs: '100%', md: 'auto' } }}>
          {totals.map(([label, value]) => (
            <Box key={label}>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography>
              <Typography sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 700 }}>{value}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
          <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ ...buttonSx, borderColor: 'divider' }}>Cancel</Button>
          <Button variant="contained" disabled={!selected.length} onClick={() => onCreate(selected)} sx={buttonSx}>Create manifest</Button>
        </Box>
      </Paper>
    </Box>
  );
}