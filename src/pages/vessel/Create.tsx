import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import type { OutlinedTextFieldProps } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface VesselFormValues {
  client: string;
  // vessel details
  vesselName: string;
  imoNo: string;
  shipId: string;
  vesselFlag: string;
  buildYear: string;
  budget: string;
  currency: string;
  email: string;
  telephoneCountry: string; // ISO code, e.g. "IN"
  telephone: string;
  vesselType: string;
  keyAccountManager: string;
  // vessel person in charge
  picName: string;
  picEmail: string;
  picTelephoneCountry: string;
  picTelephone: string;
  // vessel manager info
  suptName: string;
  suptEmail: string;
  suptTelephoneCountry: string;
  suptTelephone: string;
  // invoice info
  billingSame: boolean;
  billingAddress: string;
  vesselAddress: string;
}

type FieldName = keyof VesselFormValues;
type FormErrors = Partial<Record<FieldName, string>>;

interface CreateVesselFormProps {
  onSave?: (values: VesselFormValues) => void;
  onCancel?: () => void;
}

// ---------------------------------------------------------------------------
// Options (replace with API data)
// ---------------------------------------------------------------------------
const CLIENTS = ["Client A", "Client B", "Client C"];
const VESSEL_TYPES = ["Bulk Carrier", "Container Ship", "Tanker", "General Cargo", "Ro-Ro"];
const KEY_ACCOUNT_MANAGERS = ["Manager 1", "Manager 2", "Manager 3"];

interface Country {
  iso: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string;
}

// Add or remove countries as needed
export const COUNTRIES: Country[] = [
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "GR", name: "Greece", dial: "+30" },
  { iso: "CY", name: "Cyprus", dial: "+357" },
  { iso: "NO", name: "Norway", dial: "+47" },
  { iso: "DK", name: "Denmark", dial: "+45" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "TR", name: "Turkey", dial: "+90" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "AU", name: "Australia", dial: "+61" },
];

const initialValues: VesselFormValues = {
  client: "",
  vesselName: "",
  imoNo: "",
  shipId: "",
  vesselFlag: "",
  buildYear: "",
  budget: "",
  currency: "",
  email: "",
  telephoneCountry: "IN",
  telephone: "",
  vesselType: "",
  keyAccountManager: "",
  picName: "",
  picEmail: "",
  picTelephoneCountry: "IN",
  picTelephone: "",
  suptName: "",
  suptEmail: "",
  suptTelephoneCountry: "IN",
  suptTelephone: "",
  billingSame: false,
  billingAddress: "",
  vesselAddress: "", // wire to your vessel address if you have one
};

const REQUIRED: FieldName[] = [
  "client", "vesselName", "imoNo", "shipId", "vesselFlag", "buildYear", "budget",
  "currency", "email", "vesselType", "keyAccountManager",
  "picName", "picEmail", "suptName", "suptEmail", "billingAddress",
];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Shared styles (edit here to change every card at once)
// ---------------------------------------------------------------------------
const cardSx: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 1px 3px rgba(16,24,40,0.08)",
  overflow: "hidden", // clips the header corners to the card radius
};

// Card that grows to fill its column (keeps both columns the same height)
const cardFillSx: SxProps<Theme> = {
  ...(cardSx as object),
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const sectionHeaderSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 2,
  py: 1.1,
  bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.22 : 0.12),
  borderBottom: "1px solid",
  borderColor: (t) => alpha(t.palette.primary.main, 0.28),
};

const sectionAccentSx: SxProps<Theme> = {
  width: 4,
  height: 16,
  borderRadius: 999,
  bgcolor: "primary.main",
};

const sectionLabelSx: SxProps<Theme> = {
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: 0.2,
  color: "text.primary",
};

// 12-column grid so any field can span 3, 4, 6, 8 or 12 columns
const gridBase = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 1.75,
  p: 2,
} as const;

const fieldGridSx: SxProps<Theme> = gridBase;

// Same grid, but stretches to the card height and spreads rows evenly
const fieldGridFillSx: SxProps<Theme> = {
  ...gridBase,
  flex: 1,
  alignContent: "space-between",
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
interface SectionCardProps {
  label: string;
  fill?: boolean;
  children: ReactNode;
}

function SectionCard({ label, fill = false, children }: SectionCardProps) {
  return (
    <Box sx={fill ? cardFillSx : cardSx}>
      <Box sx={sectionHeaderSx}>
        <Box sx={sectionAccentSx} />
        <Typography sx={sectionLabelSx}>{label}</Typography>
      </Box>
      {children}
    </Box>
  );
}

type Span = 3 | 4 | 6 | 8 | 12;

const spanSx = (span: Span): SxProps<Theme> => ({
  gridColumn: { xs: "span 12", sm: `span ${span}` },
});

// Accepts any normal TextField prop (name, value, onChange, error, ...)
type FieldProps = Omit<OutlinedTextFieldProps, "variant" | "label"> & {
  label: string;
  span?: Span; // columns out of 12 on sm+ screens (full width on mobile)
};

function Field({ label, span = 6, ...props }: FieldProps) {
  return <TextField label={label} size="small" fullWidth sx={spanSx(span)} {...props} />;
}

// Flag image (emoji flags don't render on Windows, so we use images)
function Flag({ iso }: { iso: string }) {
  const code = iso.toLowerCase();
  return (
    <Box
      component="img"
      src={`https://flagcdn.com/w20/${code}.png`}
      srcSet={`https://flagcdn.com/w40/${code}.png 2x`}
      alt={iso}
      loading="lazy"
      sx={{ width: 20, height: 14, objectFit: "cover", borderRadius: "2px", flexShrink: 0 }}
    />
  );
}

interface PhoneFieldProps {
  span?: Span;
  name: string;
  country: string; // ISO code
  number: string;
  onCountryChange: (iso: string) => void;
  onNumberChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// ONE field: [flag ▾ +91 | number]
function PhoneField({ span = 6, name, country, number, onCountryChange, onNumberChange }: PhoneFieldProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selected = COUNTRIES.find((c) => c.iso === country) ?? COUNTRIES[0];

  return (
    <>
      <TextField
        label="Telephone"
        name={name}
        type="tel"
        size="small"
        fullWidth
        value={number}
        onChange={onNumberChange}
        sx={spanSx(span)}
        InputLabelProps={{ shrink: true }} // keeps the label clear of the prefix
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0 }}>
              <ButtonBase
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="Select country code"
                sx={{ gap: 0.75, px: 0.75, py: 0.25, borderRadius: 1, "&:hover": { bgcolor: "action.hover" } }}
              >
                <Flag iso={selected.iso} />
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "4px solid",
                    borderTopColor: "text.secondary",
                  }}
                />
                <Typography variant="body2" color="text.primary">
                  {selected.dial}
                </Typography>
              </ButtonBase>
              <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
            </InputAdornment>
          ),
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { maxHeight: 320, minWidth: 260 } } }}
      >
        {COUNTRIES.map((c) => (
          <MenuItem
            key={c.iso}
            selected={c.iso === selected.iso}
            onClick={() => {
              onCountryChange(c.iso);
              setAnchorEl(null);
            }}
            sx={{ gap: 1.25 }}
          >
            <Flag iso={c.iso} />
            <ListItemText primary={c.name} />
            <Typography variant="body2" color="text.secondary">
              {c.dial}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CreateVesselForm({ onSave, onCancel }: CreateVesselFormProps) {
  const [values, setValues] = useState<VesselFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const setCountry = (name: FieldName) => (iso: string) => setValues((v) => ({ ...v, [name]: iso }));

  const handleBillingSame = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValues((v) => ({
      ...v,
      billingSame: checked,
      billingAddress: checked ? v.vesselAddress : v.billingAddress,
    }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    REQUIRED.forEach((f) => {
      if (!String(values[f]).trim()) next[f] = "Required";
    });
    (["email", "picEmail", "suptEmail"] as FieldName[]).forEach((f) => {
      if (values[f] && !emailRe.test(String(values[f]))) next[f] = "Invalid email";
    });
    if (values.buildYear && !/^\d{4}$/.test(values.buildYear)) next.buildYear = "Use 4 digits";
    if (values.budget && Number(values.budget) < 0) next.budget = "Must be positive";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave?.(values);
  };

  // Props every controlled field needs: value, onChange, required, error
  const bind = (name: FieldName) => ({
    name,
    value: values[name] as string,
    onChange: handleChange,
    required: REQUIRED.includes(name),
    error: !!errors[name],
    helperText: errors[name],
    FormHelperTextProps: { sx: { mx: 0.5, mt: 0.25, lineHeight: 1.2 } },
  });

  const options = (list: string[]) =>
    list.map((o) => (
      <MenuItem key={o} value={o}>
        {o}
      </MenuItem>
    ));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto", // only shows a scrollbar if the viewport is too short
        px: { xs: 2, md: 3 },
        py: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        bgcolor: (theme) => theme.palette.background.default,
      }}
    >
      {/* Page title */}
      <Box sx={{ pb: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Create vessel
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 7fr) minmax(0, 5fr)" },
          gap: 2.5,
          alignItems: "stretch", // both columns share the same height
        }}
      >
        {/* ------------------------- Left column ------------------------- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <SectionCard label="Vessel details">
            <Box sx={fieldGridSx}>
              <Field select label="Client" span={4} {...bind("client")}>
                {options(CLIENTS)}
              </Field>
              <Field label="Vessel name" span={4} {...bind("vesselName")} />
              <Field label="IMO no" span={4} {...bind("imoNo")} />

              <Field label="Vessel flag" span={4} />
              <Field
                label="Build year"
                span={4}
                inputProps={{ maxLength: 4, inputMode: "numeric" }}
              />

              <Field label="Budget" span={4} type="number" inputProps={{ min: 0 }} />

              <Field select label="Vessel type" span={4}>
                {options(VESSEL_TYPES)}
              </Field>
              <Field select label="Key account manager" span={4} {...bind("keyAccountManager")}>
                {options(KEY_ACCOUNT_MANAGERS)}
              </Field>
            </Box>
          </SectionCard>

          <SectionCard label="Invoice info">
            <Box sx={fieldGridSx}>
              <FormControlLabel
                sx={{ gridColumn: "span 12", m: 0, mb: -0.5 }}
                control={
                  <Checkbox
                    size="small"
                    name="billingSame"
                    checked={values.billingSame}
                    onChange={handleBillingSame}
                  />
                }
                label={<Typography variant="body2">Billing address same as vessel address</Typography>}
              />
              <Field
                multiline
                rows={4}
                label="Billing address"
                span={12}
                disabled={values.billingSame}
                {...bind("billingAddress")}
              />
            </Box>
          </SectionCard>
        </Box>

        {/* ------------------------- Right column ------------------------ */}
        {/* Cards stretch so the bottom edge lines up with the left column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <SectionCard label="Vessel Coordinator" fill>
            <Box sx={fieldGridFillSx}>
              <Field label="Client PIC name" span={12} {...bind("picName")} />
              <Field label="Client PIC email" span={12} type="email" {...bind("picEmail")} />
              <PhoneField
                span={12}
                name="picTelephone"
                country={values.picTelephoneCountry}
                number={values.picTelephone}
                onCountryChange={setCountry("picTelephoneCountry")}
                onNumberChange={handleChange}
              />
            </Box>
          </SectionCard>

          <SectionCard label="Vessel manager info" fill>
            <Box sx={fieldGridFillSx}>
              <Field label="Supt name" span={12} />
              <Field label="Supt email" span={12} type="email" />
              <PhoneField
                span={12}
                name="suptTelephone"
                country={values.suptTelephoneCountry}
                number={values.suptTelephone}
                onCountryChange={setCountry("suptTelephoneCountry")}
                onNumberChange={handleChange}
              />
            </Box>
          </SectionCard>
        </Box>
      </Box>

      {/* Footer actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          mt: "auto", // pins the footer to the bottom of the page
          px: 2.5,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button onClick={onCancel} sx={{ textTransform: "none", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: "none", fontWeight: 600 }}>
          Create
        </Button>
      </Box>
    </Box>
  );
}