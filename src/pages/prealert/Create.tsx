import { Autocomplete, Box, Button, Chip, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/* ------------------------------- Sample data ------------------------------- */
// Replace with data from your API / route state.

const SHIPMENT = {
  originCountry: 'SIN-EXP (Singapore)',
  destinationCountry: 'United Arab Emirates',
  consignee: 'Yacht International co LLC. UASC Building -501 opp. Fujairah Sea Port Mina Road, Fujairah, U.A.E',
};

const STOCK = [
  { id: 1, supplier: 'CONSILIUM SAFETY INDIA PRIVATE LIMI', po: '6893-90013', description: 'Spares', stockId: 'SIN-EXP0422', pkgs: 1, weight: 2, value: '5,839.00 SGD' },
];

const AIRPORTS = ['SIN (Singapore)', 'DXB (Dubai)', 'AUH (Abu Dhabi)', 'DOH (Doha)', 'BOM (Mumbai)'];

/* ------------------------------ Transit legs ------------------------------- */

type Leg = {
  id: number; origin: string | null; destination: string | null; flight: string; depDate: string;
  depTime: string; arrDate: string; etaTime: string; ataDate: string; revised: string; delayRemark: string;
};

const newLeg = (id: number): Leg => ({
  id, origin: null, destination: null, flight: '', depDate: '', depTime: '',
  arrDate: '', etaTime: '', ataDate: '', revised: '', delayRemark: '',
});

// [key, label, input type] — shown after Origin and Destination, in this order
const LEG_FIELDS = [
  ['flight', 'Flight detail', 'text'], ['depDate', 'Departure date', 'date'], ['depTime', 'Departure time', 'time'],
  ['arrDate', 'Arrival date', 'date'], ['etaTime', 'ETA time', 'time'], ['ataDate', 'ATA date', 'date'],
  ['revised', 'Revised schedule', 'date'], ['delayRemark', 'Shipment delay remark', 'text'],
] as const;
const LEG_TITLES = ['Origin', 'Destination', ...LEG_FIELDS.map(([, label]) => label)];

// Desktop: all 10 fields + the delete button on ONE row (relative column widths).
// Below that, each leg becomes a card with 1 / 2 / 5 columns.
const LEG_COLUMNS = [1.2, 1.2, 1.1, 1, 0.85, 1, 0.85, 1, 1, 1.2].map((f) => `minmax(0, ${f}fr)`).join(' ') + ' 28px';
const legGrid = {
  display: 'grid',
  gap: { xs: 1.5, lg: 1 },
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(5, minmax(0, 1fr))', lg: LEG_COLUMNS },
};

/* --------------------------------- Styling --------------------------------- */

// All fields share one height: compact on desktop, taller with 16px text on phones (easy to tap, no iOS zoom)
const inputSx = {
  '& .MuiOutlinedInput-root': { fontSize: { xs: 16, md: 12.5 }, minHeight: { xs: 44, md: 32 }, py: '2px !important', bgcolor: 'background.paper' },
  '& .MuiOutlinedInput-input': { py: '0 !important', px: { md: '8px !important' }, height: 'auto' },
  '& .MuiInputBase-multiline': { py: '6px !important' },
};
const buttonHeight = { xs: 44, md: 32 };

// Field grid: 1 column on phones, 2 on large phones, then `md` / `lg` columns
const grid = (md: number, lg: number) => ({
  display: 'grid',
  gap: { xs: 1.5, md: 1.25 },
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: `repeat(${md}, minmax(0, 1fr))`, lg: `repeat(${lg}, minmax(0, 1fr))` },
});

// Makes the page exactly as tall as the free screen space (tablet and desktop)
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

/* -------------------------------- Components -------------------------------- */

function Section({ title, action, children, sx, bodySx }: { title: string; action?: ReactNode; children: ReactNode; sx?: object; bodySx?: object }) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.5, minHeight: { xs: 40, md: 34 }, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography sx={{ fontSize: { xs: 14, md: 13.5 }, fontWeight: 700 }}>{title}</Typography>
        {action}
      </Box>
      <Box sx={{ p: { xs: 1.75, md: 1.25 }, flex: 1, minHeight: 0, ...bodySx }}>{children}</Box>
    </Paper>
  );
}

// `cell`: label is hidden on desktop because the repeater shows one shared header row
function Field({ label, required, wide, cell, children }: { label: string; required?: boolean; wide?: boolean; cell?: boolean; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0, gridColumn: wide ? '1 / -1' : undefined }}>
      <Typography noWrap sx={{ display: cell ? { xs: 'block', lg: 'none' } : 'block', fontSize: { xs: 13, md: 11.5 }, fontWeight: 600, mb: 0.4, color: 'text.secondary' }}>
        {label}
        {required && <Box component="span" sx={{ color: 'error.main' }}> *</Box>}
      </Typography>
      {children}
    </Box>
  );
}

// Text, number, date, time... box. `onChange` gives you the new text directly.
function Input({ label, required, wide, cell, rows, unit, type, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; wide?: boolean; cell?: boolean; rows?: number; unit?: string; type?: string;
}) {
  return (
    <Field label={label} required={required} wide={wide} cell={cell}>
      <TextField
        size="small"
        fullWidth
        type={type}
        value={value}
        multiline={!!rows}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        sx={inputSx}
        slotProps={{
          htmlInput: { 'aria-label': label },
          input: { endAdornment: unit ? <InputAdornment position="end">{unit}</InputAdornment> : undefined },
        }}
      />
    </Field>
  );
}

function Choice({ label, cell, options, value, onChange }: { label: string; cell?: boolean; options: string[]; value: string | null; onChange: (v: string | null) => void }) {
  return (
    <Field label={label} cell={cell}>
      <Autocomplete
        size="small"
        options={options}
        value={value}
        onChange={(_, v) => onChange(v)}
        renderInput={(params) => <TextField {...params} placeholder="Select" inputProps={{ ...params.inputProps, 'aria-label': label }} sx={inputSx} />}
      />
    </Field>
  );
}

// Read-only value (not an input, so it never looks "disabled")
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.15 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, wordBreak: 'break-word' }}>{children}</Typography>
    </Box>
  );
}

/* ----------------------------------- Page ----------------------------------- */

export default function Create({
  manifestNo = 'FM-NS-26-10-1089',
  vessel = 'nissos kythnos',
  onClose = () => console.log('Close'),
  onSubmit = (data: unknown) => console.log('Create Pre Alert', data),
}: {
  manifestNo?: string;
  vessel?: string;
  onClose?: () => void;
  onSubmit?: (data: unknown) => void;
}) {
  const { ref, height } = useFitHeight();
  const [form, setForm] = useState({ mawb: '', hawb: '', airline: '', etd: '', eta: '', distance: '', remarks: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [legs, setLegs] = useState<Leg[]>([newLeg(1)]);

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));
  const updateLeg = (id: number, patch: Partial<Leg>) => setLegs((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const addLeg = () => setLegs((ls) => [...ls, newLeg(Math.max(0, ...ls.map((l) => l.id)) + 1)]);
  const removeLeg = (id: number) => setLegs((ls) => ls.filter((l) => l.id !== id));
  const addFiles = (list: FileList | null) => list && setFiles((f) => [...f, ...Array.from(list)]);

  const valid = form.mawb && form.airline && form.etd && form.eta && form.distance && files.length > 0;

  return (
    <Box
      ref={ref}
      sx={{
        // Phones: normal page that scrolls. Tablet/desktop: fits the screen exactly.
        height: { xs: 'auto', md: height || '100dvh' },
        overflow: { xs: 'visible', md: 'hidden' },
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'action.hover',
      }}
    >
      {/* Header */}
      <Paper square elevation={0} sx={{ px: { xs: 2, md: 2 }, py: 0.75, borderBottom: 1, borderColor: 'divider', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexShrink: 0 }}>
        <Typography sx={{ fontSize: { xs: 18, md: 16 }, fontWeight: 700 }}>Create Pre Alert</Typography>
        <Box sx={{ display: 'flex', gap: { xs: 2.5, md: 3 }, flexWrap: 'wrap' }}>
          <Fact label="Manifest no">{manifestNo}</Fact>
          {/* <Fact label="Vessel">{vessel}</Fact> */}
        </Box>
      </Paper>

      {/* Content: top rows keep their size; only the Transit area flexes and scrolls */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: { xs: 'visible', md: 'auto' }, p: { xs: 1, md: 1 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'grid', gap: 1, flexShrink: 0, alignItems: 'stretch', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
          {/* Shipment details */}
          <Section title="Shipment details">
            <Box sx={grid(3, 3)}>
              <Box sx={{ gridColumn: '1 / -1', display: 'grid', gap: 1.25, p: 1, borderRadius: 1.5, bgcolor: 'action.hover', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' } }}>
                <Fact label="Origin country">{SHIPMENT.originCountry}</Fact>
                <Fact label="Destination country">{SHIPMENT.destinationCountry}</Fact>
                <Fact label="Consignee">{SHIPMENT.consignee}</Fact>
              </Box>
              <Input label="M AWB number" required value={form.mawb} onChange={set('mawb')} />
              <Input label="H AWB number" value={form.hawb} onChange={set('hawb')} />
              <Input label="Airline name" required value={form.airline} onChange={set('airline')} />
              <Input label="ETD" required type="datetime-local" value={form.etd} onChange={set('etd')} />
              <Input label="ETA" required type="datetime-local" value={form.eta} onChange={set('eta')} />
              <Input label="Distance" required type="number" unit="km" value={form.distance} onChange={set('distance')} />
            </Box>
          </Section>

          {/* Documents + remarks */}
          <Section title="Documents and remarks">
            <Field label="Upload document" required>
              <Box
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                sx={(t: Theme) => ({ p: 1, borderRadius: 1.5, border: '1.5px dashed', borderColor: alpha(t.palette.error.main, 0.45), bgcolor: alpha(t.palette.error.main, 0.06), display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' })}
              >
                <Button component="label" variant="contained" color="error" startIcon={<CloudUploadIcon />} sx={{ textTransform: 'none', fontWeight: 700, height: buttonHeight, borderRadius: 1.5, flexShrink: 0 }}>
                  Upload Documents
                  <input hidden multiple type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                </Button>
                {files.length === 0 && <Typography sx={{ fontSize: 11.5, color: 'error.main', opacity: 0.8 }}>PDF, image or Word. Drag files here too.</Typography>}
                {/* Long file lists scroll inside this box so the layout never grows */}
                {files.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, width: '100%', maxHeight: { md: 52 }, overflowY: 'auto' }}>
                    {files.map((f, i) => (
                      <Chip
                        key={`${f.name}-${i}`}
                        size="small"
                        label={f.name}
                        icon={f.name.toLowerCase().endsWith('.pdf') ? <PictureAsPdfIcon /> : <InsertDriveFileIcon />}
                        deleteIcon={<CancelIcon />}
                        onDelete={() => setFiles((fs) => fs.filter((_, n) => n !== i))}
                        sx={(t: Theme) => ({
                          maxWidth: '100%', fontWeight: 500, color: 'error.main', bgcolor: alpha(t.palette.error.main, 0.12),
                          '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: 'error.main' },
                          '& .MuiChip-deleteIcon:hover': { color: 'error.dark' },
                        })}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Field>
            <Box sx={{ mt: 1.25 }}>
              <Input label="Comment / remarks" rows={4} value={form.remarks} onChange={set('remarks')} />
            </Box>
          </Section>
        </Box>

        {/* Stock details: one row per stock item (never shrinks) */}
        <Section title={`Stock details (${STOCK.length})`} sx={{ flexShrink: 0 }} bodySx={{ maxHeight: 120, overflow: 'auto', py: 0.5 }}>
          {STOCK.map((s) => (
            <Box
              key={s.id}
              sx={{ display: 'grid', gap: 1.25, py: 0.75, alignItems: 'start', '&:not(:last-of-type)': { borderBottom: 1, borderColor: 'divider' },
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: '2.6fr 1fr 1fr 1fr 0.6fr 0.8fr 1.1fr' } }}
            >
              <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}><Fact label="Supplier">{s.supplier}</Fact></Box>
              <Fact label="PO no">{s.po}</Fact>
              <Fact label="Description">{s.description}</Fact>
              <Fact label="Stock ID">{s.stockId}</Fact>
              <Fact label="Packages">{s.pkgs}</Fact>
              <Fact label="Weight (kg)">{s.weight}</Fact>
              <Fact label="Value">{s.value}</Fact>
            </Box>
          ))}
        </Section>

        {/* Transit information: a table-like repeater, one row per leg */}
        <Section
          title="Transit information"
          sx={{ flex: 1, minHeight: { md: 110 } }}
          bodySx={{ overflow: { md: 'auto' }, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, lg: 0.75 } }}
          action={<Button size="small" startIcon={<AddIcon />} onClick={addLeg} sx={{ textTransform: 'none', fontWeight: 600, minHeight: 28 }}>Add to transit Information</Button>}
        >
          {/* Shared header row (desktop only); minWidth keeps the 10 columns readable and scrolls sideways on narrow desktops */}
          <Box sx={{ ...legGrid, display: { xs: 'none', lg: 'grid' }, minWidth: { lg: 1240 }, flexShrink: 0 }}>
            {LEG_TITLES.map((t) => (
              <Typography key={t} noWrap title={t} sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.secondary' }}>{t}</Typography>
            ))}
            <span />
          </Box>

          {legs.map((leg, i) => (
            <Box
              key={leg.id}
              sx={{ ...legGrid, alignItems: 'center', minWidth: { lg: 1240 }, flexShrink: 0, p: { xs: 1.5, lg: 0 }, border: { xs: 1, lg: 0 }, borderColor: 'divider', borderRadius: 2 }}
            >
              {/* Phone / tablet card title */}
              <Box sx={{ gridColumn: '1 / -1', display: { xs: 'flex', lg: 'none' }, alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Leg {i + 1}</Typography>
                <IconButton size="small" color="error" aria-label={`Remove leg ${i + 1}`} disabled={legs.length === 1} onClick={() => removeLeg(leg.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <Choice cell label="Origin" options={AIRPORTS} value={leg.origin} onChange={(v) => updateLeg(leg.id, { origin: v })} />
              <Choice cell label="Destination" options={AIRPORTS} value={leg.destination} onChange={(v) => updateLeg(leg.id, { destination: v })} />
              {LEG_FIELDS.map(([key, label, type]) => (
                <Input key={key} cell label={label} type={type} value={leg[key]} onChange={(v) => updateLeg(leg.id, { [key]: v } as Partial<Leg>)} />
              ))}

              {/* Desktop delete button (last column) */}
              <IconButton size="small" color="error" aria-label={`Remove leg ${i + 1}`} disabled={legs.length === 1} onClick={() => removeLeg(leg.id)} sx={{ display: { xs: 'none', lg: 'inline-flex' }, p: 0.25 }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Section>
      </Box>

      {/* Actions (pinned to the bottom of the screen on phones too) */}
      <Paper square elevation={0} sx={{ position: { xs: 'sticky', md: 'static' }, bottom: 0, zIndex: 2, flexShrink: 0, px: { xs: 2, md: 2 }, py: 0.75, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 12, color: 'text.secondary' }}>
          <Box component="span" sx={{ color: 'error.main' }}>*</Box> Required. {valid ? 'Ready to create.' : 'Fill the required fields to continue.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="outlined" color="inherit" onClick={onClose} sx={{ textTransform: 'none', height: buttonHeight, px: 3, flex: { xs: 1, sm: 'none' }, borderColor: 'divider' }}>Close</Button>
          <Button variant="contained" disabled={!valid} onClick={() => onSubmit({ ...form, files, legs })} sx={{ textTransform: 'none', height: buttonHeight, px: 3, flex: { xs: 1, sm: 'none' } }}>Create Pre Alert</Button>
        </Box>
      </Paper>
    </Box>
  );
}