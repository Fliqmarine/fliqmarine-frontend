import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
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
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TuneIcon from '@mui/icons-material/Tune';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SyncIcon from '@mui/icons-material/Sync';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useState } from 'react';
import type { ReactNode } from 'react';

/* ------------------------------- Types ------------------------------- */

type Tone = 'primary' | 'success' | 'warning' | 'info' | 'error';

type StockTextKey =
  | 'station'
  | 'vessel'
  | 'client'
  | 'supplier'
  | 'po_number'
  | 'arrival_date'
  | 'entry_date'
  | 'country_of_origin'
  | 'cargo_status'
  | 'cargo_description'
  | 'hs_code'
  | 'currency'
  | 'cargo_value'
  | 'mode_of_arrival'
  | 'eu_reference'
  | 'transit_id_no'
  | 'storage_type';

export type StockForm = Record<StockTextKey, string> & {
  pickup_charges: 'yes' | 'no';
  fumigation: boolean;
  comments: string;
};

export type Charge = {
  id: number;
  description: string;
  agent: string;
  invoice_no: string;
  currency: string;
  amount: string;
};

export type Cargo = {
  id: number;
  length: string;
  width: string;
  height: string;
  pieces: string;
  weight: string;
  non_stackable: boolean;
  turnable: boolean;
  fragile: boolean;
  package_type: string;
  whl: string;
};

export type CreateStockPayload = {
  form: StockForm;
  charges: Charge[];
  cargo: Cargo[];
  documents: File[];
  images: File[];
};

type CreateStockFormProps = {
  onSave?: (payload: CreateStockPayload) => void;
  onCancel?: () => void;
  navHeight?: number; // height in px of your top navbar, used to lock the page to the screen
};

/* --------------------- Dropdown options (replace with API data) --------------------- */

const OPTIONS = {
  station: ['Chennai', 'Mumbai', 'Dubai'],
  vessel: ['Vessel A', 'Vessel B'],
  supplier: ['Supplier A', 'Supplier B'],
  country: ['India', 'China', 'UAE', 'Germany'],
  cargo_status: ['Received', 'Pending', 'On hold'],
  currency: ['USD', 'EUR', 'GBP', 'INR', 'AED'],
  mode_of_arrival: ['Sea', 'Air', 'Road'],
  storage_type: ['Ambient', 'Cold', 'Bonded'],
  package_type: ['Carton', 'Pallet', 'Crate', 'Drum'],
};

/* ---------------------- Calculated cargo fields (assumptions) ---------------------- */
// Dimensions in cm, weight in kg (total for the line). Change these to match your rules.
const AIR_KG_PER_CBM = 167;
const COURIER_DIVISOR = 5000; // cm³ per kg

const num = (v: string) => Number(v) || 0;
const fmt = (n: number, d = 2) => (n ? n.toFixed(d) : '');

const calcCargo = (c: Cargo) => {
  const volume = num(c.length) * num(c.width) * num(c.height) * num(c.pieces); // cm³
  const kg = num(c.weight);
  const cbm = volume / 1_000_000;
  return {
    cbm: fmt(cbm, 3),
    cwtAir: fmt(Math.max(kg, cbm * AIR_KG_PER_CBM)),
    cwtCour: fmt(Math.max(kg, volume / COURIER_DIVISOR)),
  };
};

/* ------------------------------ Field config ------------------------------ */

type StockField = {
  key: StockTextKey;
  label: string;
  type?: 'text' | 'number' | 'date';
  options?: string[];
  disabled?: boolean; // auto-filled / read only
  full?: boolean; // spans both columns
};

const stockFields: StockField[] = [
  { key: 'station', label: 'Station', options: OPTIONS.station, full: true },
  { key: 'vessel', label: 'Vessel', options: OPTIONS.vessel },
  { key: 'client', label: 'Client', disabled: true },
  { key: 'supplier', label: 'Supplier', options: OPTIONS.supplier },
  { key: 'po_number', label: 'PO Number' },
  { key: 'arrival_date', label: 'Arrival Date', type: 'date' },
  { key: 'entry_date', label: 'Entry Date', type: 'date', disabled: true },
  { key: 'country_of_origin', label: 'Country of Origin', options: OPTIONS.country },
  { key: 'cargo_status', label: 'Cargo Status', options: OPTIONS.cargo_status },
  { key: 'cargo_description', label: 'Cargo Description' },
  { key: 'hs_code', label: 'HS Code', disabled: true },
  { key: 'currency', label: 'Currency', options: OPTIONS.currency },
  { key: 'cargo_value', label: 'Cargo Value', type: 'number' },
  { key: 'mode_of_arrival', label: 'Mode of Arrival', options: OPTIONS.mode_of_arrival },
  { key: 'eu_reference', label: 'EU Reference' },
  { key: 'transit_id_no', label: 'Transit ID No' },
  { key: 'storage_type', label: 'Storage Type', options: OPTIONS.storage_type },
];

type ChargeCol = {
  key: Exclude<keyof Charge, 'id'>;
  label: string;
  type?: 'text' | 'number';
  options?: string[];
  full?: boolean;
};

const chargeCols: ChargeCol[] = [
  { key: 'description', label: 'Description', full: true },
  { key: 'agent', label: 'Agent' },
  { key: 'invoice_no', label: 'Invoice No' },
  { key: 'currency', label: 'Currency', options: OPTIONS.currency },
  { key: 'amount', label: 'Charges', type: 'number' },
];

// Names are guesses from the icons in the design: rename to match your business terms.
const cargoFlags = [
  { key: 'non_stackable', label: 'Non-stackable', Icon: HighlightOffIcon, tone: 'warning' },
  { key: 'turnable', label: 'Turnable', Icon: SyncIcon, tone: 'success' },
  { key: 'fragile', label: 'Fragile', Icon: MedicalServicesIcon, tone: 'error' },
] as const;

const CHARGE_TEMPLATE = 'repeat(5, minmax(110px, 1fr)) 40px';
const CARGO_TEMPLATE =
  'repeat(5, minmax(76px, 1fr)) repeat(3, 36px) minmax(130px, 1.4fr) repeat(4, minmax(76px, 1fr)) 40px';

/* ------------------------------- Styling ------------------------------- */

// Page is locked to the screen height on desktop screens tall enough to fit it.
// On short or small screens it falls back to a normal scrolling page.
// NOTE: must not equal the theme's own md query ('@media (min-width:900px)'), or the two
// rules overwrite each other and the layout breaks.
const FIXED = '@media (min-width:900px) and (min-height:800px)';

// On desktop the whole form renders at 90% size, the same look as browser zoom 90%.
// Change this one number to make it bigger or smaller (1 = no scaling).
const UI_ZOOM = 0.9;

const cardSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  p: { xs: 1.5, sm: 2 },
  minWidth: 0,
  // wide content (cargo grid) must scroll inside the card, never widen the page
  contain: 'inline-size',
} as const;

const fieldSx = {
  '& .MuiInputBase-root': { fontSize: 13, borderRadius: 1.5, bgcolor: 'background.paper' },
  '& .MuiInputBase-root.Mui-disabled': { bgcolor: 'action.hover' },
  '& .MuiInputBase-input': { py: '8.5px' },
  '& .MuiInputLabel-root': { fontSize: 13 },
} as const;

// Same tinted header as the stock table
const gridHeadSx = {
  display: 'grid',
  gap: 1,
  alignItems: 'center',
  px: 1,
  py: 1,
  fontSize: 11.5,
  fontWeight: 700,
  bgcolor: 'background.paper',
  backgroundImage: (t: Theme) =>
    `linear-gradient(${alpha(t.palette.primary.main, 0.1)}, ${alpha(t.palette.primary.main, 0.1)})`,
  borderBottom: '2px solid',
  borderBottomColor: (t: Theme) => alpha(t.palette.primary.main, 0.45),
  position: 'sticky', // header stays visible while the rows scroll
  top: 0,
  zIndex: 1,
} as const;

const gridRowSx = {
  display: 'grid',
  gap: 1,
  alignItems: 'center',
  px: 1,
  py: 0.75,
  borderBottom: '1px solid',
  borderColor: 'divider',
  '&:last-of-type': { borderBottom: 0 },
} as const;

const tableBoxSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1.5,
  overflow: 'hidden',
} as const;

const iconBtnSx = (tone: Tone) =>
  ({
    p: 0.5,
    borderRadius: 1,
    color: `${tone}.main`,
    bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.1),
    '&:hover': { bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.22) },
  }) as const;

const outlineBtnSx = {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 12,
  borderRadius: 1.5,
  whiteSpace: 'nowrap',
} as const;

let idCounter = 1;
const uid = () => idCounter++;
const emptyCharge = (): Charge => ({
  id: uid(),
  description: '',
  agent: '',
  invoice_no: '',
  currency: '',
  amount: '',
});
const emptyCargo = (): Cargo => ({
  id: uid(),
  length: '',
  width: '',
  height: '',
  pieces: '',
  weight: '',
  non_stackable: false,
  turnable: false,
  fragile: false,
  package_type: '',
  whl: '',
});

const initialForm = (): StockForm => ({
  station: '',
  vessel: '',
  client: '',
  supplier: '',
  po_number: '',
  arrival_date: '',
  entry_date: new Date().toISOString().slice(0, 10),
  country_of_origin: '',
  cargo_status: '',
  cargo_description: '',
  hs_code: '',
  currency: '',
  cargo_value: '',
  mode_of_arrival: '',
  eu_reference: '',
  transit_id_no: '',
  storage_type: '',
  pickup_charges: 'no',
  fumigation: false,
  comments: '',
});

/* --------------------------- Small building blocks --------------------------- */

type FieldProps = {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: 'text' | 'number' | 'date';
  options?: string[];
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  hideLabel?: boolean; // table rows: header already names the column
};

function Field({
  label,
  value,
  onChange,
  type = 'text',
  options,
  required,
  disabled,
  error,
  hideLabel,
}: FieldProps) {
  const isSelect = Boolean(options);

  return (
    <TextField
      fullWidth
      size="small"
      select={isSelect}
      type={isSelect ? undefined : type}
      label={hideLabel ? undefined : label}
      required={required && !hideLabel}
      value={value}
      disabled={disabled}
      error={error}
      onChange={(e) => onChange?.(e.target.value)}
      slotProps={{
        // date inputs: keep the label floating so it never overlaps "dd-mm-yyyy"
        inputLabel: type === 'date' && !hideLabel ? { shrink: true } : undefined,
        htmlInput: isSelect
          ? undefined
          : { 'aria-label': label, ...(type === 'number' ? { min: 0, step: 'any' } : {}) },
        // table rows have no label, so show a "Select" placeholder
        select: isSelect
          ? {
              displayEmpty: hideLabel,
              renderValue: hideLabel
                ? (v: unknown) =>
                    v ? (
                      String(v)
                    ) : (
                      <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                        Select
                      </Box>
                    )
                : undefined,
            }
          : undefined,
      }}
      sx={fieldSx}
    >
      {options?.map((o) => (
        <MenuItem key={o} value={o} sx={{ fontSize: 12 }}>
          {o}
        </MenuItem>
      ))}
    </TextField>
  );
}

function SectionTitle({
  icon,
  title,
  tone = 'primary',
  action,
}: {
  icon: ReactNode;
  title: string;
  tone?: Tone;
  action?: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        width: '100%',
        mb: 1.5,
        pb: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: 1.5,
            color: `${tone}.main`,
            bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.12),
          }}
        >
          {icon}
        </Box>
        <Box
          component="span"
          sx={{
            m: 0,
            fontSize: 14,
            fontWeight: 700,
            lineHeight: '32px',
            color: 'text.primary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Box>
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}

function UploadBlock({
  label,
  accept,
  tone,
  icon,
  files,
  onAdd,
  onRemove,
}: {
  label: string;
  accept: string;
  tone: Tone;
  icon: ReactNode;
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: (t: Theme) => alpha(t.palette[tone].main, 0.5),
        bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.04),
        borderRadius: 2,
        p: 1.5,
        minWidth: 0,
      }}
    >
      <Button
        component="label"
        variant="contained"
        color={tone}
        size="small"
        startIcon={<CloudUploadIcon />}
        sx={{ textTransform: 'none', fontWeight: 600, fontSize: 12.5, borderRadius: 1.5 }}
      >
        {label}
        <input
          hidden
          multiple
          type="file"
          accept={accept}
          onChange={(e) => {
            onAdd(Array.from(e.target.files ?? []));
            e.target.value = ''; // allows picking the same file again
          }}
        />
      </Button>

      {files.length > 0 && (
        <Stack
          direction="row"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, width: '100%', mt: 1.25 }}
        >
          {files.map((f, i) => (
            <Chip
              key={`${f.name}-${i}`}
              size="small"
              icon={icon as React.ReactElement}
              label={f.name}
              onDelete={() => onRemove(i)}
              sx={{
                maxWidth: '100%',
                fontSize: 11.5,
                fontWeight: 500,
                color: `${tone}.main`,
                bgcolor: (t: Theme) => alpha(t.palette[tone].main, 0.12),
                '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: 'inherit' },
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

/* ------------------------------- Component ------------------------------- */

export default function CreateStockForm({ onSave, onCancel, navHeight = 76 }: CreateStockFormProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [form, setForm] = useState<StockForm>(initialForm);
  const [charges, setCharges] = useState<Charge[]>(() => [emptyCharge()]);
  const [cargo, setCargo] = useState<Cargo[]>(() => [emptyCargo()]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const setField = (key: StockTextKey, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const updateCharge = <K extends keyof Charge>(id: number, key: K, value: Charge[K]) =>
    setCharges((rows) => rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const updateCargo = <K extends keyof Cargo>(id: number, key: K, value: Cargo[K]) =>
    setCargo((rows) => rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const missing = (value: string, disabled?: boolean) => submitted && !disabled && !value.trim();

  const CARGO_REQUIRED = ['length', 'width', 'height', 'pieces', 'weight', 'package_type'] as const;

  const handleSave = () => {
    setSubmitted(true);
    const stockValid = stockFields.every((f) => f.disabled || form[f.key].trim());
    const cargoValid = cargo.every((c) => CARGO_REQUIRED.every((k) => c[k].trim()));
    if (!stockValid || !cargoValid) return;
    onSave?.({ form, charges, cargo, documents, images });
  };

  const renderActions = (fullWidth = false) => (
    <Stack direction="row" spacing={1} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        sx={{ ...outlineBtnSx, fontSize: 13, px: 2.5, flex: fullWidth ? 1 : 'none' }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleSave}
        sx={{ ...outlineBtnSx, fontSize: 13, px: 3, flex: fullWidth ? 1 : 'none' }}
      >
        Save
      </Button>
    </Stack>
  );

  const addChargeBtn = (
    <Button
      size="small"
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={() => setCharges((r) => [...r, emptyCharge()])}
      sx={outlineBtnSx}
    >
      Add Charges
    </Button>
  );

  const addCargoBtn = (
    <Button
      size="small"
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={() => setCargo((r) => [...r, emptyCargo()])}
      sx={outlineBtnSx}
    >
      Add Cargo Detail
    </Button>
  );

  /* ------------------------------- Charges ------------------------------- */

  const renderCharges = () => {
    if (charges.length === 0) {
      return (
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary', py: 1 }}>
          No charges added yet. Use “Add Charges” to add one.
        </Typography>
      );
    }

    if (isMobile) {
      return (
        <Stack spacing={1.25}>
          {charges.map((row, i) => (
            <Paper
              key={row.id}
              variant="outlined"
              sx={{
                p: 1.25,
                borderRadius: 2,
                borderLeft: '4px solid',
                borderLeftColor: 'warning.main',
              }}
            >
              <Stack
                direction="row"
               
               
                sx={{ alignItems: 'center', justifyContent: 'space-between',  display: 'flex', width: '100%', mb: 1.25 }}
              >
                <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>Charge {i + 1}</Typography>
                <IconButton
                  size="small"
                  aria-label="Delete charge"
                  onClick={() => setCharges((r) => r.filter((x) => x.id !== row.id))}
                  sx={iconBtnSx('error')}
                >
                  <DeleteIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Stack>
              <Box
                sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.25 }}
              >
                {chargeCols.map((col) => (
                  <Box key={col.key} sx={{ gridColumn: col.full ? '1 / -1' : 'auto', minWidth: 0 }}>
                    <Field
                      label={col.label}
                      type={col.type}
                      options={col.options}
                      value={row[col.key]}
                      onChange={(v) => updateCharge(row.id, col.key, v)}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Stack>
      );
    }

    return (
      <Box
        sx={{
          ...tableBoxSx,
          overflow: 'auto', // sideways only: rows grow and the card scrolls vertically
        }}
      >
        <Box sx={{ minWidth: 700 }}>
          <Box sx={{ ...gridHeadSx, gridTemplateColumns: CHARGE_TEMPLATE }}>
            {chargeCols.map((col) => (
              <Box key={col.key}>{col.label}</Box>
            ))}
            <Box />
          </Box>
          {charges.map((row) => (
            <Box key={row.id} sx={{ ...gridRowSx, gridTemplateColumns: CHARGE_TEMPLATE }}>
              {chargeCols.map((col) => (
                <Field
                  key={col.key}
                  hideLabel
                  label={col.label}
                  type={col.type}
                  options={col.options}
                  value={row[col.key]}
                  onChange={(v) => updateCharge(row.id, col.key, v)}
                />
              ))}
              <IconButton
                size="small"
                aria-label="Delete charge"
                onClick={() => setCharges((r) => r.filter((x) => x.id !== row.id))}
                sx={iconBtnSx('error')}
              >
                <DeleteIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  /* ---------------------------------- Cargo ---------------------------------- */

  const dimFields = [
    { key: 'length', label: 'Length' },
    { key: 'width', label: 'Width' },
    { key: 'height', label: 'Height' },
    { key: 'pieces', label: 'Pieces' },
    { key: 'weight', label: 'Weight' },
  ] as const;

  const renderCargo = () => {
    if (isMobile) {
      return (
        <Stack spacing={1.25}>
          {cargo.map((row, i) => {
            const calc = calcCargo(row);
            return (
              <Paper
                key={row.id}
                variant="outlined"
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  borderLeft: '4px solid',
                  borderLeftColor: 'primary.main',
                }}
              >
                <Stack
                  direction="row"
                 
                 
                  sx={{ alignItems: 'center', justifyContent: 'space-between',  display: 'flex', width: '100%', mb: 1.25 }}
                >
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>Cargo {i + 1}</Typography>
                  <IconButton
                    size="small"
                    aria-label="Delete cargo"
                    disabled={cargo.length === 1}
                    onClick={() => setCargo((r) => r.filter((x) => x.id !== row.id))}
                    sx={iconBtnSx('error')}
                  >
                    <DeleteIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 1.25,
                  }}
                >
                  {dimFields.map((f) => (
                    <Field
                      key={f.key}
                      required
                      type="number"
                      label={f.label}
                      value={row[f.key]}
                      error={missing(row[f.key])}
                      onChange={(v) => updateCargo(row.id, f.key, v)}
                    />
                  ))}
                  <Field
                    required
                    label="Package Type"
                    options={OPTIONS.package_type}
                    value={row.package_type}
                    error={missing(row.package_type)}
                    onChange={(v) => updateCargo(row.id, 'package_type', v)}
                  />

                  <Stack
                    direction="row"
                    sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1.5, gridColumn: '1 / -1' }}
                  >
                    {cargoFlags.map(({ key, label, Icon, tone }) => (
                      <FormControlLabel
                        key={key}
                        sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: 12.5 } }}
                        control={
                          <Checkbox
                            size="small"
                            color={tone}
                            checked={row[key]}
                            onChange={(e) => updateCargo(row.id, key, e.target.checked)}
                            sx={{ p: 0.5 }}
                          />
                        }
                        label={
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            <Icon sx={{ fontSize: 16, color: `${tone}.main` }} />
                            <span>{label}</span>
                          </Stack>
                        }
                      />
                    ))}
                  </Stack>

                  <Field label="CBM" value={calc.cbm} disabled />
                  <Field label="CWT Air" value={calc.cwtAir} disabled />
                  <Field label="CWT Cour" value={calc.cwtCour} disabled />
                  <Field
                    label="WHL"
                    value={row.whl}
                    onChange={(v) => updateCargo(row.id, 'whl', v)}
                  />
                </Box>
              </Paper>
            );
          })}
        </Stack>
      );
    }

    return (
      <Box
        sx={{
          ...tableBoxSx,
          overflow: 'auto', // scrolls inside once rows are added
          maxHeight: 240,
          [FIXED]: { maxHeight: 'none', height: 158 }, // header + 2 rows, constant so the page never grows
        }}
      >
        <Box sx={{ minWidth: 1080 }}>
          <Box sx={{ ...gridHeadSx, gridTemplateColumns: CARGO_TEMPLATE }}>
            {dimFields.map((f) => (
              <Box key={f.key}>
                {f.label}
                <Box component="span" sx={{ color: 'error.main' }}> *</Box>
              </Box>
            ))}
            {cargoFlags.map(({ key, label, Icon, tone }) => (
              <Tooltip key={key} arrow title={label}>
                <Box sx={{ display: 'flex', justifyContent: 'center', color: `${tone}.main` }}>
                  <Icon sx={{ fontSize: 18 }} />
                </Box>
              </Tooltip>
            ))}
            <Box>
              Package Type
              <Box component="span" sx={{ color: 'error.main' }}> *</Box>
            </Box>
            <Box>CBM</Box>
            <Box>CWT Air</Box>
            <Box>CWT Cour</Box>
            <Box>WHL</Box>
            <Box />
          </Box>

          {cargo.map((row) => {
            const calc = calcCargo(row);
            return (
              <Box key={row.id} sx={{ ...gridRowSx, gridTemplateColumns: CARGO_TEMPLATE }}>
                {dimFields.map((f) => (
                  <Field
                    key={f.key}
                    hideLabel
                    type="number"
                    label={f.label}
                    value={row[f.key]}
                    error={missing(row[f.key])}
                    onChange={(v) => updateCargo(row.id, f.key, v)}
                  />
                ))}
                {cargoFlags.map(({ key, label, tone }) => (
                  <Checkbox
                    key={key}
                    size="small"
                    color={tone}
                    checked={row[key]}
                    inputProps={{ 'aria-label': label }}
                    onChange={(e) => updateCargo(row.id, key, e.target.checked)}
                    sx={{ p: 0.5, justifySelf: 'center' }}
                  />
                ))}
                <Field
                  hideLabel
                  label="Package Type"
                  options={OPTIONS.package_type}
                  value={row.package_type}
                  error={missing(row.package_type)}
                  onChange={(v) => updateCargo(row.id, 'package_type', v)}
                />
                <Field hideLabel label="CBM" value={calc.cbm} disabled />
                <Field hideLabel label="CWT Air" value={calc.cwtAir} disabled />
                <Field hideLabel label="CWT Cour" value={calc.cwtCour} disabled />
                <Field
                  hideLabel
                  label="WHL"
                  value={row.whl}
                  onChange={(v) => updateCargo(row.id, 'whl', v)}
                />
                <IconButton
                  size="small"
                  aria-label="Delete cargo"
                  disabled={cargo.length === 1}
                  onClick={() => setCargo((r) => r.filter((x) => x.id !== row.id))}
                  sx={iconBtnSx('error')}
                >
                  <DeleteIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  /* --------------------------------- Layout --------------------------------- */

  return (
    // Outer box is NOT zoomed: it fixes the page height in real screen pixels.
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        [FIXED]: {
          height: `calc(100dvh - ${navHeight}px)`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // no page scroll
        },
      }}
    >
    {/* Inner box is scaled down; in the fixed layout it simply fills the outer box. */}
    <Box
      sx={{
        boxSizing: 'border-box',
        minWidth: 0,
        zoom: { xs: 1, md: UI_ZOOM },
        px: { xs: 1.5, sm: 2, md: 3 },
        pt: { xs: 2, md: 3 },
        pb: { xs: 0, md: 3 },
        [FIXED]: {
          flex: '1 1 0',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          pt: 2,
          pb: 2,
        },
      }}
    >
      {/* page header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          width: '100%',
          mb: 2,
          flexShrink: 0,
        }}
      >
        <Box
          component="h1"
          sx={{ m: 0, fontSize: { xs: 17, sm: 19 }, fontWeight: 700, lineHeight: 1.3 }}
        >
          Create Stock
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 'auto', flexShrink: 0 }}>
          {renderActions()}
        </Box>
      </Box>

      {/* top: stock details + additional details */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 5fr) minmax(0, 7fr)' },
          alignItems: 'start',
          [FIXED]: { flex: '1 1 0', minHeight: 0, alignItems: 'stretch', gridTemplateRows: 'minmax(0, 1fr)' },
        }}
      >
        {/* Stock details */}
        <Paper elevation={0} sx={{ ...cardSx, [FIXED]: { minHeight: 0, overflowY: 'auto' } }}>
          <SectionTitle icon={<Inventory2OutlinedIcon fontSize="small" />} title="Stock Details" />
          <Box
            sx={{
              display: 'grid',
              gap: 1.2,
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            {stockFields.map((f) => (
              <Box key={f.key} sx={{ gridColumn: f.full ? { sm: '1 / -1' } : 'auto', minWidth: 0 }}>
                <Field
                  required
                  label={f.label}
                  type={f.type}
                  options={f.options}
                  disabled={f.disabled}
                  value={form[f.key]}
                  error={missing(form[f.key], f.disabled)}
                  onChange={(v) => setField(f.key, v)}
                />
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Additional details */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            display: 'flex',
            flexDirection: 'column',
            [FIXED]: { minHeight: 0, overflowY: 'auto' },
          }}
        >
          <SectionTitle
            icon={<TuneIcon fontSize="small" />}
            title="Additional Details"
            tone="info"
          />

          <Stack
            direction="row"
            sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 3, rowGap: 0.5 }}
          >
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mr: 1 }}>
              Pickup Charges
            </Typography>
            <RadioGroup
              row
              value={form.pickup_charges}
              onChange={(e) =>
                setForm((f) => ({ ...f, pickup_charges: e.target.value as 'yes' | 'no' }))
              }
            >
              {(['yes', 'no'] as const).map((v) => (
                <FormControlLabel
                  key={v}
                  value={v}
                  control={<Radio size="small" />}
                  label={v === 'yes' ? 'Yes' : 'No'}
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                />
              ))}
            </RadioGroup>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={form.fumigation}
                  onChange={(e) => setForm((f) => ({ ...f, fumigation: e.target.checked }))}
                />
              }
              label="Fumigation"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
            />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              mt: 1.5,
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <UploadBlock
              label="Upload Documents"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              tone="error"
              icon={<PictureAsPdfIcon />}
              files={documents}
              onAdd={(files) => setDocuments((d) => [...d, ...files])}
              onRemove={(i) => setDocuments((d) => d.filter((_, idx) => idx !== i))}
            />
            <UploadBlock
              label="Upload Images"
              accept="image/*"
              tone="info"
              icon={<ImageIcon />}
              files={images}
              onAdd={(files) => setImages((d) => [...d, ...files])}
              onRemove={(i) => setImages((d) => d.filter((_, idx) => idx !== i))}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Comments / Remarks"
            value={form.comments}
            onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
            sx={{ ...fieldSx, mt: 1.5, flexShrink: 0 }}
          />

          {/* Charges */}
          <Paper
            variant="outlined"
            sx={{
              mt: 1.5,
              p: { xs: 1.25, sm: 1.5 },
              borderRadius: 2,
              borderColor: (t: Theme) => alpha(t.palette.warning.main, 0.5),
              minWidth: 0,
              flexShrink: 0,
            }}
          >
            <SectionTitle
              icon={<AttachMoneyIcon fontSize="small" />}
              title="Charges"
              tone="warning"
              action={addChargeBtn}
            />
            {renderCharges()}
          </Paper>
        </Paper>
      </Box>

      {/* Cargo details */}
      <Paper elevation={0} sx={{ ...cardSx, mt: 2, [FIXED]: { flexShrink: 0 } }}>
        <SectionTitle
          icon={<LocalShippingOutlinedIcon fontSize="small" />}
          title="Cargo Details"
          tone="success"
          action={addCargoBtn}
        />
        {renderCargo()}
      </Paper>

      {/* mobile / tablet: sticky save bar */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'sticky',
          bottom: 0,
          zIndex: 5,
          mt: 2,
          mx: { xs: -1.5, sm: -2 },
          p: 1.25,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {renderActions(true)}
      </Box>
    </Box>
    </Box>
  );
}