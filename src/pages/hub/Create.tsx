import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  Box,
  Button,
  ButtonBase,
  Divider,
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
export interface HubFormValues {
  // hub details
  companyName: string;
  stationCode: string;
  country: string;
  city: string;
  postalCode: string;
  vatNo: string;
  address: string;
  notifyParty: string;
  // coordinator in charge
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhoneCountry: string; // ISO code, e.g. "IN"
  coordinatorPhone: string;
  // accounting details
  accName: string;
  accEmail: string;
  accPhoneCountry: string;
  accPhone: string;
  accCountry: string;
  creditLimit: string;
  currency: string;
  paymentTerms: string;
  billingAddress: string;
  specialInstructions: string;
  // right column
  multipleEmail: string; // comma separated
  oppManager: string;
  bankDetails: string;
}

type FieldName = keyof HubFormValues;
type FormErrors = Partial<Record<FieldName, string>>;

interface CreateHubFormProps {
  onSave?: (values: HubFormValues) => void;
  onCancel?: () => void;
}

// ---------------------------------------------------------------------------
// Options (replace with API data)
// ---------------------------------------------------------------------------
interface Country {
  iso: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string;
}

// Used for both the phone prefix and the Country dropdowns
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

const COUNTRY_NAMES = COUNTRIES.map((c) => c.name);

const initialValues: HubFormValues = {
  companyName: "",
  stationCode: "",
  country: "",
  city: "",
  postalCode: "",
  vatNo: "",
  address: "",
  notifyParty: "",
  coordinatorName: "",
  coordinatorEmail: "",
  coordinatorPhoneCountry: "IN",
  coordinatorPhone: "",
  accName: "",
  accEmail: "",
  accPhoneCountry: "IN",
  accPhone: "",
  accCountry: "",
  creditLimit: "",
  currency: "",
  paymentTerms: "",
  billingAddress: "",
  specialInstructions: "",
  multipleEmail: "",
  oppManager: "",
  bankDetails: "",
};

const REQUIRED: FieldName[] = [
  "companyName", "country", "city", "address",
  "coordinatorName", "coordinatorEmail", "coordinatorPhone",
  "accName", "accEmail", "accPhone", "creditLimit", "currency", "paymentTerms",
  "oppManager", "bankDetails",
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

// Card that grows to fill the free height of its column
const cardFillSx: SxProps<Theme> = {
  ...(cardSx as object),
  flex: 1,
  minHeight: 0,
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

// Same grid, but fills the card height. `rows` decides which rows stretch,
// e.g. "auto auto minmax(64px, 1fr)" -> the last row takes the free space.
const fillGrid = (rows: string): SxProps<Theme> => ({
  ...gridBase,
  flex: 1,
  minHeight: 0,
  gridTemplateRows: rows,
});

// Multiline field that stretches to the height of its grid row
const growSx = {
  "& .MuiInputBase-root": { height: "100%", alignItems: "flex-start" },
  "& .MuiInputBase-inputMultiline": { height: "100% !important", overflow: "auto !important" },
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

const spanSx = (span: Span) => ({
  gridColumn: { xs: "span 12", sm: `span ${span}` },
});

// Accepts any normal TextField prop (name, value, onChange, error, ...)
type FieldProps = Omit<OutlinedTextFieldProps, "variant" | "label"> & {
  label: string;
  span?: Span; // columns out of 12 on sm+ screens (full width on mobile)
  grow?: boolean; // multiline only: stretch to the row height
};

function Field({ label, span = 6, grow = false, ...props }: FieldProps) {
  return (
    <TextField
      label={label}
      size="small"
      fullWidth
      sx={{ ...spanSx(span), ...(grow ? growSx : {}) }}
      {...props}
    />
  );
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
  label?: string;
  country: string; // ISO code
  number: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  onCountryChange: (iso: string) => void;
  onNumberChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// ONE field: [flag ▾ +91 | number]
function PhoneField({
  span = 6,
  name,
  label = "Phone",
  country,
  number,
  required,
  error,
  helperText,
  onCountryChange,
  onNumberChange,
}: PhoneFieldProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selected = COUNTRIES.find((c) => c.iso === country) ?? COUNTRIES[0];

  return (
    <>
      <TextField
        label={label}
        name={name}
        type="tel"
        size="small"
        fullWidth
        required={required}
        error={error}
        helperText={helperText}
        value={number}
        onChange={onNumberChange}
        sx={spanSx(span)}
        FormHelperTextProps={{ sx: { mx: 0.5, mt: 0.25, lineHeight: 1.2 } }}
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
export default function CreateHubForm({ onSave, onCancel }: CreateHubFormProps) {
  const [values, setValues] = useState<HubFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const setCountry = (name: FieldName) => (iso: string) => setValues((v) => ({ ...v, [name]: iso }));

  const validate = (): boolean => {
    const next: FormErrors = {};
    REQUIRED.forEach((f) => {
      if (!String(values[f]).trim()) next[f] = "Required";
    });
    (["coordinatorEmail", "accEmail"] as FieldName[]).forEach((f) => {
      if (values[f] && !emailRe.test(String(values[f]))) next[f] = "Invalid email";
    });
    if (values.multipleEmail.trim()) {
      const list = values.multipleEmail.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
      if (list.some((m) => !emailRe.test(m))) next.multipleEmail = "One or more emails are invalid";
    }
    if (values.creditLimit && Number(values.creditLimit) < 0) next.creditLimit = "Must be positive";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave?.(values);
  };

  // Props every controlled field needs: value, onChange, required, error
  const bind = (name: FieldName) => ({
    name,
    value: values[name],
    onChange: handleChange,
    required: REQUIRED.includes(name),
    error: !!errors[name],
    helperText: errors[name],
    FormHelperTextProps: { sx: { mx: 0.5, mt: 0.25, lineHeight: 1.2 } },
  });

  const phoneBind = (name: FieldName, countryName: FieldName) => ({
    name,
    country: values[countryName],
    number: values[name],
    required: REQUIRED.includes(name),
    error: !!errors[name],
    helperText: errors[name],
    onCountryChange: setCountry(countryName),
    onNumberChange: handleChange,
  });

  const countryOptions = COUNTRY_NAMES.map((n) => (
    <MenuItem key={n} value={n}>
      {n}
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
          Create hub
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2.5,
          alignItems: "stretch", // all columns share the same height
        }}
      >
        {/* ------------------------- Column 1 ------------------------- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <SectionCard label="Hub details" fill>
            <Box sx={fillGrid("auto auto auto minmax(64px, 1fr) minmax(64px, 1fr)")}>
              <Field label="Company name" span={6} {...bind("companyName")} />
              <Field label="Station code" span={6} {...bind("stationCode")} />

              <Field select label="Country" span={6} {...bind("country")}>
                {countryOptions}
              </Field>
              <Field label="City" span={6} {...bind("city")} />

              <Field label="Postal code" span={6} {...bind("postalCode")} />
              <Field label="VAT no" span={6} {...bind("vatNo")} />

              <Field multiline rows={2} grow label="Address" span={12} {...bind("address")} />
              <Field multiline rows={2} grow label="Notify party" span={12} {...bind("notifyParty")} />
            </Box>
          </SectionCard>

          <SectionCard label="Coordinator in charge">
            <Box sx={fieldGridSx}>
              <Field label="Name" span={12} {...bind("coordinatorName")} />
              <Field label="Email" span={6} type="email" {...bind("coordinatorEmail")} />
              <PhoneField span={6} {...phoneBind("coordinatorPhone", "coordinatorPhoneCountry")} />
            </Box>
          </SectionCard>
        </Box>

        {/* ------------------------- Column 2 ------------------------- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <SectionCard label="Accounting details" fill>
            <Box sx={fillGrid("auto auto auto auto minmax(72px, 1fr) minmax(72px, 1fr)")}>
              <Field label="Name" span={12} {...bind("accName")} />

              <Field label="Email" span={6} type="email" {...bind("accEmail")} />
              <PhoneField span={6} {...phoneBind("accPhone", "accPhoneCountry")} />

              <Field select label="Country" span={6} {...bind("accCountry")}>
                {countryOptions}
              </Field>
              <Field
                label="Credit limit"
                span={6}
                type="number"
                inputProps={{ min: 0 }}
                {...bind("creditLimit")}
              />

              <Field label="Currency" span={6} {...bind("currency")} />
              <Field label="Payment terms" span={6} {...bind("paymentTerms")} />

              <Field multiline rows={3} grow label="Billing address" span={12} {...bind("billingAddress")} />
              <Field
                multiline
                rows={3}
                grow
                label="Special instructions"
                span={12}
                {...bind("specialInstructions")}
              />
            </Box>
          </SectionCard>
        </Box>

        {/* ------------------------- Column 3 ------------------------- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <SectionCard label="Multiple email">
            <Box sx={fieldGridSx}>
              <Field
                label="Email"
                span={12}
                placeholder="name@example.com, other@example.com"
                InputLabelProps={{ shrink: true }}
                {...bind("multipleEmail")}
              />
            </Box>
          </SectionCard>

          <SectionCard label="Key account manager">
            <Box sx={fieldGridSx}>
              <Field label="Opp manager" span={12} {...bind("oppManager")} />
            </Box>
          </SectionCard>

          <SectionCard label="Bank details" fill>
            <Box sx={fillGrid("minmax(120px, 1fr)")}>
              <Field multiline rows={6} grow label="Bank details" span={12} {...bind("bankDetails")} />
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