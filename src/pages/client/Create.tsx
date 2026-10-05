import type { ReactNode } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import type { OutlinedTextFieldProps } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

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

// Darker, tinted heading bar
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
  color: "text.primary", // full-strength text instead of the old faded secondary
};

// 12-column grid so any field can span 4, 6, 8 or 12 columns
const fieldGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 1.75,
  p: 2,
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
interface SectionCardProps {
  label: string;
  children: ReactNode;
}

function SectionCard({ label, children }: SectionCardProps) {
  return (
    <Box sx={cardSx}>
      <Box sx={sectionHeaderSx}>
        <Box sx={sectionAccentSx} />
        <Typography sx={sectionLabelSx}>{label}</Typography>
      </Box>
      {children}
    </Box>
  );
}

type Span = 4 | 6 | 8 | 12;

// Accepts any normal TextField prop (name, value, onChange, error, ...)
type FieldProps = Omit<OutlinedTextFieldProps, "variant" | "label"> & {
  label: string;
  span?: Span; // columns out of 12 on sm+ screens (full width on mobile)
};

function Field({ label, span = 6, ...props }: FieldProps) {
  return (
    <TextField
      label={label}
      size="small"
      fullWidth
      sx={{ gridColumn: { xs: "span 12", sm: `span ${span}` } }}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Create() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto",
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
          Create contact
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2.5,
          alignItems: "start",
        }}
      >
        {/* ------------------------- Left column ------------------------- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <SectionCard label="Company information">
            <Box sx={fieldGridSx}>
              <Field label="Company" span={8} />
              <Field label="Country" span={4} />
              <Field label="City" span={4} />
              <Field label="Postal code" span={4} />
              <Field label="VAT no" span={4} />
              <Field label="Address" span={12} />
            </Box>
          </SectionCard>

          <SectionCard label="Contact person">
            <Box sx={fieldGridSx}>
              <Field label="Name" span={4} />
              <Field label="Email" span={4} />
              <Field label="Phone" span={4} />
            </Box>
          </SectionCard>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <SectionCard label="Opp. manager">
              <Box sx={fieldGridSx}>
                <Field label="Opp manager" span={12} />
              </Box>
            </SectionCard>

            <SectionCard label="Bank info">
              <Box sx={fieldGridSx}>
              <Field label="Bank detail" span={12} />
            </Box>
            </SectionCard>
          </Box>
        </Box>

        {/* ------------------------- Right column ------------------------ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <SectionCard label="Billing information">
            <Box sx={fieldGridSx}>
              <Field label="Name" span={8} />
              <Field label="Phone" span={4} />
              <Field label="Email" span={8} />
              <Field label="Country" span={4} />
              <Field label="Credit limit" span={4} />
              <Field label="Payment term" span={4} />
              <Field label="Currency" span={4} />
              <Field multiline rows={2} label="Billing address" span={12} />
              <Field label="Special instructions" span={12} />
            </Box>
          </SectionCard>

          <SectionCard label="Email">
            
            <Box sx={fieldGridSx}>
                <Field label="Multiple email" span={12} />
              </Box>
          </SectionCard>
        </Box>
      </Box>
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            px: 2.5,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            // onClick={handleClose}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            // onClick={handleSubmit}
            // disabled={!values.name || !values.code || !values.rate}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Create
          </Button>
        </Box>
    </Box>
  );
}