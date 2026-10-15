import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import type { Stage3 } from './components/Stage3Table';

/* ------------------------------- Types ------------------------------- */

type Props = {
  id?: number | string; // supplied by ViewHost
  row: Stage3;
  onClose: () => void; // supplied by ViewHost
  onSuccess?: () => void;
  vendors?: string[]; // options for the Vendor Name select
  manifests?: string[]; // options for the Manifest No select (the row's own manifest is always included)
};

type Tone = 'error' | 'info' | 'success';

type Line = {
  key: string;
  vendor_name: string;
  manifest_no: string;
  invoice_no: string;
  invoice_date: string;
  overdue_date: string;
  purchase_amount: string;
  currency: string;
  gst_percent: string;
  final_amount: string; // USD
  final_manual: boolean; // true once the user edits the final amount by hand
  invoice_file: File | null;
};

type DocKey = 'pod' | 'client_po' | 'email_confirmation';

const CURRENCIES = ['USD', 'EUR', 'INR', 'AED', 'GBP', 'SGD'];

// TODO: replace with real data (load from your API, or pass `vendors` / `manifests` through ViewHost props)
const DEFAULT_VENDORS = ['AISPAC AIRCARGO SERVICES PTE LTD', 'Vendor B', 'Vendor C'];

// Set to true to make the three document groups mandatory
const REQUIRE_DOCS = false;

/* ------------------------------ Helpers ------------------------------ */

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const round2 = (n: number) => Math.round(n * 100) / 100;
const gstAmountOf = (l: Line) => round2((num(l.purchase_amount) * num(l.gst_percent)) / 100);
const autoFinal = (l: Line) => round2(num(l.purchase_amount) + gstAmountOf(l));

let seq = 0;
const newLine = (manifest = ''): Line => ({
  key: `line-${Date.now()}-${seq++}`,
  vendor_name: '',
  manifest_no: manifest,
  invoice_no: '',
  invoice_date: '',
  overdue_date: '',
  purchase_amount: '',
  currency: 'USD',
  gst_percent: '',
  final_amount: '',
  final_manual: false,
  invoice_file: null,
});

/* Recompute the final amount unless it's a non-USD line the user typed by hand */
const withFinal = (l: Line): Line => {
  if (l.final_manual && l.currency !== 'USD') return l;
  return { ...l, final_manual: false, final_amount: l.purchase_amount ? String(autoFinal(l)) : '' };
};

/* Columns: `fr` is a flex weight so the whole row always fits (no horizontal scroll).
   `min` is a guaranteed minimum width in px (used so Manifest No is never cut off).
   xs / md = how many grid columns the field spans in the card layout (2 cols on phones, 4 on tablets). */
type ColDef = {
  key: string;
  label: string;
  fr: number;
  min?: number;
  xs: number;
  md: number;
  required?: boolean;
};

const COLS = [
  { key: 'vendor_name', label: 'Vendor Name', fr: 1.5, xs: 2, md: 2, required: true },
  { key: 'manifest_no', label: 'Manifest No', fr: 2.1, min: 165, xs: 2, md: 2, required: true },
  { key: 'invoice_no', label: 'Invoice No', fr: 1.1, xs: 2, md: 1, required: true },
  { key: 'invoice_date', label: 'Invoice Date', fr: 1.3, xs: 2, md: 1, required: true },
  { key: 'overdue_date', label: 'Overdue Date', fr: 1.3, xs: 2, md: 1 },
  { key: 'purchase_amount', label: 'Purchase Amount', fr: 1.1, xs: 1, md: 1, required: true },
  { key: 'currency', label: 'Currency', fr: 0.95, xs: 1, md: 1 },
  { key: 'gst_percent', label: 'GST (%)', fr: 0.75, xs: 1, md: 1 },
  { key: 'gst_amount', label: 'GST Amount', fr: 1, xs: 1, md: 1 },
  { key: 'final_amount', label: 'Final Amount (USD)', fr: 1.2, xs: 2, md: 1 },
  { key: 'invoice_file', label: 'Invoice Upload', fr: 1.2, xs: 2, md: 2 },
] as const satisfies readonly ColDef[];

type ColKey = (typeof COLS)[number]['key'];

const GRID_COLUMNS = `${COLS.map((c: ColDef) => `minmax(${c.min ?? 0}px, ${c.fr}fr)`).join(' ')} 32px`;

// Whole line-items area is shown slightly zoomed out on desktop so everything fits comfortably
const DESKTOP_ZOOM = 0.88;

// Hide number spinners (saves width, looks cleaner)
const noSpinners = {
  '& input[type="number"]': { MozAppearance: 'textfield' },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
} as const;

// Native date inputs render inconsistently on phones; normalise height / alignment
const dateFix = {
  '& input[type="date"]': {
    WebkitAppearance: 'none',
    appearance: 'none',
    display: 'block',
    textAlign: 'left',
    minHeight: '1.4375em',
    lineHeight: '1.4375em',
  },
  '& input[type="date"]::-webkit-date-and-time-value': {
    textAlign: 'left',
    margin: 0,
    minHeight: '1.4375em',
  },
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    opacity: 0.7,
    cursor: 'pointer',
  },
} as const;

const compactSx = {
  ...noSpinners,
  ...dateFix,
  '& .MuiInputBase-input': { fontSize: 13, py: '8px', px: '9px' },
  '& .MuiSelect-select': { fontSize: 13, py: '8px !important', pl: '9px', pr: '24px !important' },
  '& .MuiSelect-icon': { right: 2 },
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    ml: 0,
    p: 0,
    width: 15,
    height: 15,
    opacity: 0.7,
  },
} as const;

const cardSx = {
  ...noSpinners,
  ...dateFix,
  '& .MuiInputBase-input': { fontSize: 14 },
} as const;

/* ---------------------------- Upload zone ---------------------------- */

const fileId = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

function UploadZone({
  label,
  tone,
  files,
  onAdd,
  onRemove,
  required,
}: {
  label: string;
  tone: Tone;
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  required?: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onAdd(Array.from(e.dataTransfer.files));
      }}
      sx={{
        minWidth: 0,
        p: 2,
        borderRadius: 2,
        border: '1px dashed',
        borderColor: (t: Theme) => alpha(t.palette[tone].main, dragging ? 1 : 0.55),
        bgcolor: (t: Theme) => alpha(t.palette[tone].main, dragging ? 0.14 : 0.05),
        transition: 'all .15s ease',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <Button
          component="label"
          variant="contained"
          color={tone}
          startIcon={<CloudUploadIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 13,
            borderRadius: 1.5,
            px: 2,
            boxShadow: (t: Theme) => `0 3px 8px ${alpha(t.palette[tone].main, 0.35)}`,
          }}
        >
          Upload {label}
          {required && ' *'}
          <input
            hidden
            multiple
            type="file"
            accept=".pdf,image/*,.msg,.eml,.doc,.docx,.xls,.xlsx"
            onChange={(e) => {
              onAdd(Array.from(e.target.files ?? []));
              e.target.value = '';
            }}
          />
        </Button>

        {files.length > 0 && (
          <Chip
            size="small"
            color={tone}
            label={`${files.length} file${files.length > 1 ? 's' : ''}`}
            sx={{ fontWeight: 700, fontSize: 11 }}
          />
        )}
      </Stack>

      {files.length === 0 ? (
        <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 1 }}>
          Click to browse or drag &amp; drop files here
        </Typography>
      ) : (
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.25, maxHeight: 96, overflowY: 'auto' }}
        >
          {files.map((f, i) => (
            <Chip
              key={fileId(f)}
              size="small"
              variant="outlined"
              color={tone}
              icon={<AttachFileIcon sx={{ fontSize: 14 }} />}
              label={f.name}
              onDelete={() => onRemove(i)}
              sx={{
                maxWidth: '100%',
                fontSize: 11.5,
                bgcolor: 'background.paper',
                '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

/* ------------------------------ Component ------------------------------ */

export default function VendorInvoice({
  row,
  onClose,
  onSuccess,
  vendors = DEFAULT_VENDORS,
  manifests = [],
}: Props) {
  const theme = useTheme();
  // Below 1200px the 11 fields can't stay legible on one line, so they become cards
  const useCards = useMediaQuery(theme.breakpoints.down('lg'));

  const manifestOptions = Array.from(new Set([row.ref_no, ...manifests].filter(Boolean)));

  const [docs, setDocs] = useState<Record<DocKey, File[]>>({
    pod: [],
    client_po: [],
    email_confirmation: [],
  });

  const [lines, setLines] = useState<Line[]>([newLine(row.ref_no)]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- document helpers ---- */
  const addDocs = (key: DocKey, incoming: File[]) =>
    setDocs((d) => {
      const known = new Set(d[key].map(fileId));
      return { ...d, [key]: [...d[key], ...incoming.filter((f) => !known.has(fileId(f)))] };
    });
  const removeDoc = (key: DocKey, index: number) =>
    setDocs((d) => ({ ...d, [key]: d[key].filter((_, i) => i !== index) }));

  /* ---- line helpers ---- */
  const updateLine = (key: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.key === key ? withFinal({ ...l, ...patch }) : l)));

  const setFinalManual = (key: string, value: string) =>
    setLines((ls) =>
      ls.map((l) => (l.key === key ? { ...l, final_amount: value, final_manual: true } : l)),
    );

  const addLine = () => setLines((ls) => [...ls, newLine(row.ref_no)]);
  const removeLine = (key: string) =>
    setLines((ls) => (ls.length > 1 ? ls.filter((l) => l.key !== key) : ls));

  const linesValid = lines.every(
    (l) =>
      l.vendor_name.trim() &&
      l.manifest_no.trim() &&
      l.invoice_no.trim() &&
      l.invoice_date &&
      l.purchase_amount,
  );
  const docsValid =
    !REQUIRE_DOCS ||
    (docs.pod.length > 0 && docs.client_po.length > 0 && docs.email_confirmation.length > 0);
  const valid = Boolean(linesValid && docsValid);

  /* ---- submit ---- */
  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      const body = new FormData();
      body.append('manifest_id', String(row.id));
      docs.pod.forEach((f) => body.append('proof_of_delivery[]', f));
      docs.client_po.forEach((f) => body.append('client_po[]', f));
      docs.email_confirmation.forEach((f) => body.append('email_confirmation[]', f));

      lines.forEach((l, i) => {
        body.append(`lines[${i}][vendor_name]`, l.vendor_name);
        body.append(`lines[${i}][manifest_no]`, l.manifest_no);
        body.append(`lines[${i}][invoice_no]`, l.invoice_no);
        body.append(`lines[${i}][invoice_date]`, l.invoice_date);
        body.append(`lines[${i}][overdue_date]`, l.overdue_date);
        body.append(`lines[${i}][purchase_amount]`, l.purchase_amount);
        body.append(`lines[${i}][currency]`, l.currency);
        body.append(`lines[${i}][gst_percent]`, l.gst_percent || '0');
        body.append(`lines[${i}][gst_amount]`, String(gstAmountOf(l)));
        body.append(`lines[${i}][final_amount_usd]`, l.final_amount || '0');
        if (l.invoice_file) body.append(`lines[${i}][invoice_file]`, l.invoice_file);
      });

      // TODO: replace with your API call, e.g.
      // await api.post(`/prealert/${row.id}/move-to-stage-4`, body, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });

      onSuccess?.();
      onClose();
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ---- one input per column ---- */
  const renderCell = (l: Line, col: ColKey, labelled: boolean) => {
    const meta = COLS.find((c) => c.key === col);
    const aria = meta?.label;
    const common = {
      size: 'small' as const,
      fullWidth: true,
      sx: labelled ? cardSx : compactSx,
    };
    const dateProps = { type: 'date' };

    // Labels live outside the field (header row / caption above), so show a placeholder inside selects
    const selectProps = (placeholder: string) => ({
      displayEmpty: true,
      renderValue: (v: unknown) =>
        v ? (
          String(v)
        ) : (
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {placeholder}
          </Box>
        ),
    });

    switch (col) {
      case 'vendor_name':
        return (
          <TextField
            {...common}
            select
            inputProps={{ 'aria-label': aria }}
            SelectProps={selectProps('Select vendor')}
            value={l.vendor_name}
            onChange={(e) => updateLine(l.key, { vendor_name: e.target.value })}
          >
            {vendors.length === 0 && (
              <MenuItem disabled sx={{ fontSize: 13 }}>
                No vendors available
              </MenuItem>
            )}
            {vendors.map((v) => (
              <MenuItem key={v} value={v} sx={{ fontSize: 13 }}>
                {v}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'manifest_no':
        return (
          <TextField
            {...common}
            select
            inputProps={{ 'aria-label': aria }}
            SelectProps={selectProps('Select manifest')}
            value={l.manifest_no}
            onChange={(e) => updateLine(l.key, { manifest_no: e.target.value })}
          >
            {manifestOptions.map((m) => (
              <MenuItem key={m} value={m} sx={{ fontSize: 13 }}>
                {m}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'invoice_no':
        return (
          <TextField
            {...common}
            inputProps={{ 'aria-label': aria }}
            value={l.invoice_no}
            onChange={(e) => updateLine(l.key, { invoice_no: e.target.value })}
          />
        );
      case 'invoice_date':
        return (
          <TextField
            {...common}
            {...dateProps}
            inputProps={{ 'aria-label': aria }}
            value={l.invoice_date}
            onChange={(e) => updateLine(l.key, { invoice_date: e.target.value })}
          />
        );
      case 'overdue_date':
        return (
          <TextField
            {...common}
            {...dateProps}
            inputProps={{ 'aria-label': aria, min: l.invoice_date || undefined }}
            value={l.overdue_date}
            onChange={(e) => updateLine(l.key, { overdue_date: e.target.value })}
          />
        );
      case 'purchase_amount':
        return (
          <TextField
            {...common}
            type="number"
            inputProps={{ 'aria-label': aria, min: 0, step: '0.01', inputMode: 'decimal' }}
            value={l.purchase_amount}
            onChange={(e) => updateLine(l.key, { purchase_amount: e.target.value })}
          />
        );
      case 'currency':
        return (
          <TextField
            {...common}
            select
            inputProps={{ 'aria-label': aria }}
            value={l.currency}
            onChange={(e) => updateLine(l.key, { currency: e.target.value })}
          >
            {CURRENCIES.map((c) => (
              <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'gst_percent':
        return (
          <TextField
            {...common}
            type="number"
            inputProps={{ 'aria-label': aria, min: 0, max: 100, step: '0.01', inputMode: 'decimal' }}
            value={l.gst_percent}
            onChange={(e) => updateLine(l.key, { gst_percent: e.target.value })}
          />
        );
      case 'gst_amount':
        return (
          <TextField
            {...common}
            inputProps={{ 'aria-label': aria }}
            value={l.purchase_amount ? gstAmountOf(l).toFixed(2) : ''}
            InputProps={{ readOnly: true }}
          />
        );
      case 'final_amount':
        return (
          <Tooltip
            arrow
            placement="top"
            title={
              l.currency === 'USD'
                ? 'Purchase amount + GST'
                : 'Enter the USD equivalent (non-USD currency)'
            }
          >
            <TextField
              {...common}
              type="number"
              inputProps={{ 'aria-label': aria, min: 0, step: '0.01', inputMode: 'decimal' }}
              value={l.final_amount}
              InputProps={{ readOnly: l.currency === 'USD' }}
              onChange={(e) => setFinalManual(l.key, e.target.value)}
            />
          </Tooltip>
        );
      case 'invoice_file':
        return (
          <Stack direction="row" alignItems="center" spacing={0.25} sx={{ minWidth: 0 }}>
            <Tooltip
              arrow
              placement="top"
              title={l.invoice_file ? l.invoice_file.name : 'Upload invoice'}
            >
              <Button
                component="label"
                size="small"
                variant={l.invoice_file ? 'contained' : 'outlined'}
                color={l.invoice_file ? 'success' : 'primary'}
                disableElevation
                startIcon={
                  l.invoice_file ? (
                    <CheckCircleIcon sx={{ fontSize: 15 }} />
                  ) : (
                    <CloudUploadIcon sx={{ fontSize: 15 }} />
                  )
                }
                sx={{
                  flex: 1,
                  minWidth: 0,
                  textTransform: 'none',
                  fontSize: 12.5,
                  height: labelled ? 40 : 34,
                  px: 1,
                  justifyContent: 'center',
                  '& .MuiButton-startIcon': { mr: 0.5, ml: 0 },
                }}
              >
                <Box
                  component="span"
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {l.invoice_file ? (labelled ? l.invoice_file.name : 'Added') : 'Upload'}
                </Box>
                <input
                  hidden
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    updateLine(l.key, { invoice_file: e.target.files?.[0] ?? null });
                    e.target.value = '';
                  }}
                />
              </Button>
            </Tooltip>

            {l.invoice_file && (
              <Tooltip title="Remove file" placement="top">
                <IconButton
                  size="small"
                  color="error"
                  aria-label="Remove invoice file"
                  onClick={() => updateLine(l.key, { invoice_file: null })}
                  sx={{ p: 0.4, flexShrink: 0 }}
                >
                  <HighlightOffIcon sx={{ fontSize: 19 }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
    }
  };

  /* ---- desktop: every line on a single row, always fits the width ---- */
  const renderRowRepeater = () => (
    // zoomed out a little; the wrapper scrolls vertically when there are many lines
    <Box sx={{ maxHeight: 'min(46vh, 420px)', overflowY: 'auto', overflowX: 'hidden', pr: 0.5 }}>
      <Box sx={{ zoom: DESKTOP_ZOOM }}>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: GRID_COLUMNS,
            columnGap: 0.75,
            alignItems: 'center',
            px: 0.75,
            py: 1,
            borderRadius: 1,
            bgcolor: 'background.paper',
            backgroundImage: (t: Theme) =>
              `linear-gradient(${alpha(t.palette.primary.main, 0.1)}, ${alpha(
                t.palette.primary.main,
                0.1,
              )})`,
          }}
        >
          {COLS.map((c) => (
            <Typography key={c.key} sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>
              {c.label}
            </Typography>
          ))}
          <Box />
        </Box>

        <Stack spacing={1} sx={{ mt: 1 }}>
          {lines.map((l) => (
            <Box
              key={l.key}
              sx={{
                display: 'grid',
                gridTemplateColumns: GRID_COLUMNS,
                columnGap: 0.75,
                alignItems: 'center',
                px: 0.75,
              }}
            >
              {COLS.map((c) => (
                <Box key={c.key} sx={{ minWidth: 0 }}>
                  {renderCell(l, c.key, false)}
                </Box>
              ))}
              <Tooltip title="Remove line" placement="top">
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Remove line"
                    disabled={lines.length === 1}
                    onClick={() => removeLine(l.key)}
                    sx={{ p: 0.5 }}
                  >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );

  /* ---- tablet / mobile: one card per line ---- */
  const renderCardRepeater = () => (
    <Stack spacing={1.5} sx={{ maxHeight: 'min(58vh, 560px)', overflowY: 'auto', pr: 0.5, pt: 0.5 }}>
      {lines.map((l, i) => (
        <Paper key={l.key} variant="outlined" sx={{ p: 1.5, borderRadius: 2, flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.75 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Line {i + 1}</Typography>
            <IconButton
              size="small"
              color="error"
              aria-label="Remove line"
              disabled={lines.length === 1}
              onClick={() => removeLine(l.key)}
            >
              <DeleteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            {COLS.map((c) => (
              <Box
                key={c.key}
                sx={{
                  gridColumn: { xs: `span ${c.xs}`, md: `span ${c.md}` },
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 0.5, lineHeight: 1.3 }}
                >
                  {c.label}
                  {'required' in c && c.required && (
                    <Box component="span" sx={{ color: 'error.main' }}>
                      {' *'}
                    </Box>
                  )}
                </Typography>
                {renderCell(l, c.key, true)}
              </Box>
            ))}
          </Box>
        </Paper>
      ))}
    </Stack>
  );

  return (
    <Box>
      {/* Documents */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <UploadZone
          label="Proof of Delivery"
          tone="error"
          required={REQUIRE_DOCS}
          files={docs.pod}
          onAdd={(f) => addDocs('pod', f)}
          onRemove={(i) => removeDoc('pod', i)}
        />
        <UploadZone
          label="Client PO"
          tone="info"
          required={REQUIRE_DOCS}
          files={docs.client_po}
          onAdd={(f) => addDocs('client_po', f)}
          onRemove={(i) => removeDoc('client_po', i)}
        />
        <UploadZone
          label="Email Confirmation"
          tone="success"
          required={REQUIRE_DOCS}
          files={docs.email_confirmation}
          onAdd={(f) => addDocs('email_confirmation', f)}
          onRemove={(i) => removeDoc('email_confirmation', i)}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Vendor invoice lines */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 700 }}>Vendor Invoices</Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addLine}
          sx={{ textTransform: 'none', fontSize: 12.5, borderRadius: 1.5, flexShrink: 0 }}
        >
          Add line
        </Button>
      </Stack>

      {useCards ? renderCardRepeater() : renderRowRepeater()}

      {error && (
        <Typography sx={{ fontSize: 12, color: 'error.main', mt: 1.5 }}>{error}</Typography>
      )}

      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 3 }}>
        <Button onClick={onClose} disabled={saving} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSubmit}
          disabled={!valid || saving}
          sx={{ textTransform: 'none' }}
        >
          {saving ? 'Saving…' : 'Save & Move to Stage 4'}
        </Button>
      </Stack>
    </Box>
  );
}