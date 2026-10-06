import { useState } from "react";
import {
    Box,
    Button,
    ButtonBase,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    ListItemText,
    Menu,
    MenuItem,
    OutlinedInput,
    TextField,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";

// ─────────────────────────────────────────────────────────────────
// Height of the app's top navbar (px). The form fills the rest of the screen,
// so change this number if your navbar is taller / shorter.
// ─────────────────────────────────────────────────────────────────
const APP_BAR_HEIGHT = 68;

// ─────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────
const CARD_SX = {
    bgcolor: "background.paper",
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 1px 3px rgba(16,24,40,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
} as const;

const CARD_HEADER_SX = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 2,
    py: 0.9,
    bgcolor: (t: Theme) => alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.22 : 0.12),
    borderBottom: "1px solid",
    borderColor: (t: Theme) => alpha(t.palette.primary.main, 0.28),
} as const;

// Multiline fields stretch to fill the free height of their card
const MULTILINE_GROW_SX = {
    "& .MuiInputBase-root": { height: "100%", alignItems: "flex-start" },
    "& .MuiInputBase-inputMultiline": { height: "100% !important", overflow: "auto !important" },
} as const;

// ─────────────────────────────────────────────────────────────────
// Phone field: ONE input with [flag ▾ +91 | number] inside it.
// Stored value is the full number, e.g. "+919876543210" ("" when empty).
// ─────────────────────────────────────────────────────────────────
const COUNTRY_LIST = getCountries();
const countryName = (c: Country) => (en as Record<string, string>)[c] || c;

function FlagIcon({ country }: { country: Country }) {
    const Flag = flags[country];
    return (
        <Box
            sx={{
                width: 22,
                height: 15,
                flexShrink: 0,
                borderRadius: "2px",
                overflow: "hidden",
                display: "flex",
                "& svg": { width: "100%", height: "100%", display: "block" },
            }}
        >
            {Flag && <Flag title={countryName(country)} />}
        </Box>
    );
}

interface PhoneFieldProps {
    label: string;
    required?: boolean;
    error?: boolean;
    country: Country;
    value: string; // full number incl. country code
    onChange: (country: Country, fullValue: string) => void;
}

function PhoneField({ label, required, error, country, value, onChange }: PhoneFieldProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const dial = `+${getCountryCallingCode(country)}`;
    const national = value.startsWith(dial) ? value.slice(dial.length) : "";
    const build = (c: Country, digits: string) => (digits ? `+${getCountryCallingCode(c)}${digits}` : "");
    const fullLabel = required ? `${label} *` : label;

    return (
        <FormControl size="small" fullWidth required={required} error={error} sx={{ flex: 1, minWidth: 0 }}>
            <InputLabel shrink>{label}</InputLabel>
            <OutlinedInput
                label={fullLabel}
                notched
                value={national}
                onChange={(e) => onChange(country, build(country, e.target.value.replace(/\D/g, "")))}
                inputProps={{ inputMode: "numeric" }}
                startAdornment={
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                        <ButtonBase
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            aria-label="Select country"
                            sx={{ gap: 0.75, px: 0.75, py: 0.25, borderRadius: 1, "&:hover": { bgcolor: "action.hover" } }}
                        >
                            <FlagIcon country={country} />
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
                                {dial}
                            </Typography>
                        </ButtonBase>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
                    </InputAdornment>
                }
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                sx={{ "& .MuiPaper-root": { maxHeight: 320, minWidth: 280 } }}
            >
                {COUNTRY_LIST.map((c) => (
                    <MenuItem
                        key={c}
                        selected={c === country}
                        onClick={() => {
                            onChange(c, build(c, national));
                            setAnchorEl(null);
                        }}
                        sx={{ gap: 1.25 }}
                    >
                        <FlagIcon country={c} />
                        <ListItemText primary={countryName(c)} />
                        <Typography variant="body2" color="text.secondary">
                            +{getCountryCallingCode(c)}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </FormControl>
    );
}

// ─────────────────────────────────────────────────────────────────
// Form state
// ─────────────────────────────────────────────────────────────────
interface FormState {
    groupId: string;
    companyName: string;
    eoriUiseNo: string;
    country: string;
    city: string;
    airportCode: string;
    stationCode: string;
    postalCode: string;
    vatNo: string;
    address: string;
    notifyParty: string;
    multipleEmail: string;
    coordinatorInCharge: { name: string; email: string; phone: string };
    accountingDetails: {
        name: string;
        email: string;
        phone: string;
        country: string;
        paymentTerms: string;
        currency: string;
        billingAddress: string;
        specialInstructions: string;
    };
}

const INITIAL_FORM_STATE: FormState = {
    groupId: "TTS Agent",
    companyName: "",
    eoriUiseNo: "",
    country: "",
    city: "",
    airportCode: "",
    stationCode: "",
    postalCode: "",
    vatNo: "",
    address: "",
    notifyParty: "",
    multipleEmail: "",
    coordinatorInCharge: { name: "", email: "", phone: "" },
    accountingDetails: {
        name: "",
        email: "",
        phone: "",
        country: "",
        paymentTerms: "",
        currency: "",
        billingAddress: "",
        specialInstructions: "",
    },
};

// ─────────────────────────────────────────────────────────────────
// Fields per group. This is what decides what is shown / hidden.
// "key" is a dot-path into FormState. Each inner array is one row.
// ─────────────────────────────────────────────────────────────────
interface FieldConfig {
    key: string;
    label: string;
    type?: "text" | "email" | "tel";
    required?: boolean;
    multiline?: boolean;
}

interface GroupConfig {
    showAccounting: boolean; // show the "Accounting details" card or not
    contactRows: FieldConfig[][]; // fields of the "Company information" card
}

const COORDINATOR_ROWS: FieldConfig[][] = [
    [{ key: "coordinatorInCharge.name", label: "Name", required: true }],
    [
        { key: "coordinatorInCharge.email", label: "Email", type: "email", required: true },
        { key: "coordinatorInCharge.phone", label: "Phone", type: "tel", required: true },
    ],
];

const ACCOUNTING_ROWS: FieldConfig[][] = [
    [
        { key: "accountingDetails.name", label: "Name", required: true },
        { key: "accountingDetails.email", label: "Email", type: "email", required: true },
    ],
    [
        { key: "accountingDetails.phone", label: "Phone", type: "tel", required: true },
        { key: "accountingDetails.country", label: "Country" },
    ],
    [
        { key: "accountingDetails.paymentTerms", label: "Payment Terms", required: true },
        { key: "accountingDetails.currency", label: "Currency", required: true },
    ],
    [{ key: "accountingDetails.billingAddress", label: "Billing Address", multiline: true }],
    [{ key: "accountingDetails.specialInstructions", label: "Special Instructions", multiline: true }],
];

const MULTIPLE_EMAIL_ROWS: FieldConfig[][] = [[{ key: "multipleEmail", label: "Email", type: "email" }]];

const AGENT_CONFIG: GroupConfig = {
    showAccounting: true,
    contactRows: [
        [
            { key: "companyName", label: "Company Name", required: true },
            { key: "eoriUiseNo", label: "EORI / UISE No." },
        ],
        [
            { key: "country", label: "Country", required: true },
            { key: "city", label: "City", required: true },
        ],
        [
            { key: "airportCode", label: "Airport Code", required: true },
            { key: "stationCode", label: "Station Code", required: true },
        ],
        [
            { key: "postalCode", label: "Postal Code" },
            { key: "vatNo", label: "Vat No" },
        ],
        [{ key: "address", label: "Address", required: true, multiline: true }],
        [{ key: "notifyParty", label: "Notify Party", multiline: true }],
    ],
};

const GROUP_CONFIGS: Record<string, GroupConfig> = {
    "TTS Agent": AGENT_CONFIG,
    "Sub Agent": AGENT_CONFIG,
    "Sub Agent Onboard": AGENT_CONFIG,
    "Sub Agent Export": AGENT_CONFIG,
    "Owners Agent": {
        showAccounting: false,
        contactRows: [
            [
                { key: "companyName", label: "Company Name", required: true },
                { key: "eoriUiseNo", label: "EORI / UISE No." },
            ],
            [
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [
                { key: "airportCode", label: "Airport Code", required: true },
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
            [{ key: "address", label: "Address", required: true, multiline: true }],
            [{ key: "notifyParty", label: "Notify Party", multiline: true }],
        ],
    },
    Supplier: {
        showAccounting: false,
        contactRows: [
            [
                { key: "companyName", label: "Company Name", required: true },
                { key: "eoriUiseNo", label: "EORI / UISE No." },
            ],
            [
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
            [{ key: "address", label: "Address", required: true, multiline: true }],
            [{ key: "notifyParty", label: "Notify Party", multiline: true }],
        ],
    },
};

// ─────────────────────────────────────────────────────────────────
// Helpers for nested keys like "coordinatorInCharge.name"
// ─────────────────────────────────────────────────────────────────
function getValue(data: FormState, path: string): string {
    let value: unknown = data;
    for (const part of path.split(".")) {
        value = (value as Record<string, unknown>)?.[part];
    }
    return (value as string) ?? "";
}

function setValue(data: FormState, path: string, value: string): FormState {
    const [parent, child] = path.split(".");
    if (!child) return { ...data, [parent]: value };
    const parentValue = (data as unknown as Record<string, unknown>)[parent];
    return { ...data, [parent]: { ...(parentValue as Record<string, unknown>), [child]: value } };
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────
interface Props {
    onCreate?: (data: FormState) => void;
    onCancel?: () => void;
}

export default function CreateContactForm({ onCreate, onCancel }: Props) {
    const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
    const [submitted, setSubmitted] = useState(false); // required fields turn red after clicking Create
    const [phoneCountries, setPhoneCountries] = useState<Record<string, Country>>({}); // flag per phone field

    const config = GROUP_CONFIGS[formData.groupId];

    const updateField = (path: string, value: string) => setFormData((prev) => setValue(prev, path, value));

    const isMissing = (f: FieldConfig) => submitted && !!f.required && !getValue(formData, f.key).trim();

    const handleCreate = () => {
        // only the fields visible for the selected group are checked
        const visibleRows = [
            ...config.contactRows,
            ...COORDINATOR_ROWS,
            ...(config.showAccounting ? ACCOUNTING_ROWS : []),
        ];
        const hasMissing = visibleRows.flat().some((f) => f.required && !getValue(formData, f.key).trim());
        setSubmitted(true);
        if (!hasMissing) onCreate?.(formData);
    };

    const handleCancel = () => {
        setFormData(INITIAL_FORM_STATE);
        setSubmitted(false);
        onCancel?.();
    };

    // ── renderers ───────────────────────────────────────────────
    const renderField = (field: FieldConfig) => {
        if (field.type === "tel") {
            return (
                <PhoneField
                    key={field.key}
                    label={field.label}
                    required={field.required}
                    error={isMissing(field)}
                    country={phoneCountries[field.key] ?? "IN"}
                    value={getValue(formData, field.key)}
                    onChange={(c, full) => {
                        setPhoneCountries((prev) => ({ ...prev, [field.key]: c }));
                        updateField(field.key, full);
                    }}
                />
            );
        }

        const isCountry = field.key === "country" || field.key.endsWith(".country");
        return (
            <TextField
                key={field.key}
                select={isCountry}
                label={field.label}
                type={field.type}
                value={getValue(formData, field.key)}
                onChange={(e) => updateField(field.key, e.target.value)}
                required={field.required}
                error={isMissing(field)}
                multiline={field.multiline}
                rows={field.multiline ? 2 : undefined}
                size="small"
                fullWidth
                sx={{ flex: 1, minWidth: 0, ...(field.multiline ? MULTILINE_GROW_SX : {}) }}
                SelectProps={isCountry ? { MenuProps: { PaperProps: { sx: { maxHeight: 320 } } } } : undefined}
            >
                {isCountry &&
                    getCountries().map((c) => (
                        <MenuItem key={c} value={c}>
                            {(en as Record<string, string>)[c] || c}
                        </MenuItem>
                    ))}
            </TextField>
        );
    };

    const renderRows = (rows: FieldConfig[][]) =>
        rows.map((row, i) => {
            const hasMultiline = row.some((f) => f.multiline);
            return (
                <Box
                    key={i}
                    sx={{ display: "flex", gap: 1.5, ...(hasMultiline && { flex: "1 1 auto", minHeight: 44 }) }}
                >
                    {row.map(renderField)}
                </Box>
            );
        });

    // grow = card stretches to the column height
    const renderCard = (title: string, rows: FieldConfig[][], grow = false) => (
        <Box sx={{ ...CARD_SX, ...(grow ? { flex: "1 1 auto", minHeight: 0 } : { flexShrink: 0 }) }}>
            <Box sx={CARD_HEADER_SX}>
                <Box sx={{ width: 4, height: 16, borderRadius: 999, bgcolor: "primary.main" }} />
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}>{title}</Typography>
            </Box>
            <Box sx={{ p: 1.5, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {renderRows(rows)}
            </Box>
        </Box>
    );

    const columnSx = { display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px", minWidth: 0, minHeight: 0 } as const;

    return (
        <Box
            sx={{
                width: "100%",
                height: { xs: "auto", md: `calc(100vh - ${APP_BAR_HEIGHT}px)` }, // fills the screen under the navbar
                boxSizing: "border-box",
                overflowY: { xs: "auto", md: "hidden" }, // desktop: never scrolls. phones: columns stack, so they scroll
                px: { xs: 2, md: 3 },
                py: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                bgcolor: (theme) => theme.palette.background.default,
                "& .MuiFormLabel-asterisk": { color: "red" },
            }}
        >
            {/* Title (left) + group dropdown (right) */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    pt: 0.5,
                    pb: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography variant="h5" fontWeight={800}>
                    Create contact
                </Typography>
                <TextField
                    select
                    size="small"
                    label="Group ID"
                    value={formData.groupId}
                    onChange={(e) => updateField("groupId", e.target.value)}
                    sx={{ width: 220 }}
                >
                    {Object.keys(GROUP_CONFIGS).map((group) => (
                        <MenuItem key={group} value={group}>
                            {group}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Columns (same height) */}
            <Box sx={{ flex: 1, minHeight: 0, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={columnSx}>
                    {renderCard("Company information", config.contactRows, true)}
                    {renderCard("Coordinator", COORDINATOR_ROWS)}
                </Box>
                <Box sx={columnSx}>
                    {config.showAccounting && renderCard("Accounting details", ACCOUNTING_ROWS, true)}
                    {renderCard("Multiple email", MULTIPLE_EMAIL_ROWS, !config.showAccounting)}
                </Box>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: "auto",
                    px: 2.5,
                    py: 1.25,
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Button onClick={handleCancel} sx={{ textTransform: "none", fontWeight: 600 }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleCreate} sx={{ textTransform: "none", fontWeight: 600 }}>
                    Create
                </Button>
            </Box>
        </Box>
    );
}