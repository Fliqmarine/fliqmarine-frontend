import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  RefreshOutlined,
  SearchOutlined,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import type { AllStageFilters } from '../AllStage';

type FilterOptions = Partial<Record<keyof AllStageFilters, string[]>>;

type FilterProps = {
  filters: AllStageFilters;
  options?: FilterOptions;
  search: string;
  onFilterChange: (key: keyof AllStageFilters, value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
};

type SelectField = { key: keyof AllStageFilters; label: string };

// Row 1 (always visible)
const primaryFields: SelectField[] = [
  { key: 'client', label: 'Client' },
  { key: 'vessel', label: 'Vessel' },
  { key: 'hub', label: 'Hub' },
  { key: 'status', label: 'Status' },
  { key: 'vesselPo', label: 'Vessel PO' },
];

// Row 2 (expanded)
const secondaryFields: SelectField[] = [
  { key: 'keyAccountManager', label: 'Key Account Manager' },
  { key: 'consignee', label: 'Consignee' },
  { key: 'portOfDestination', label: 'Port Of Destination' },
  { key: 'stages', label: 'Stages' },
  { key: 'refNo', label: 'Manifest No' },
  { key: 'awbNumber', label: 'AWB Number' },
];

// One height for EVERY control
const H = { xs: 36, sm: 30 };

// Same grid for all rows so columns line up
const GRID_COLUMNS = {
  xs: 'repeat(2, minmax(0, 1fr))',
  sm: 'repeat(3, minmax(0, 1fr))',
  md: 'minmax(0, 1.2fr) repeat(5, minmax(0, 1fr)) auto',
};

const fieldSx = {
  width: '100%',
  '& .MuiInputBase-root': { height: H, fontSize: 12 },
  '& .MuiInputBase-input': {
    fontSize: 12,
    height: '100%',
    py: 0,
    px: '12px',
    boxSizing: 'border-box',
  },
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    height: '100% !important',
    minHeight: '0 !important',
    py: '0 !important',
    pl: '12px',
    pr: '28px !important',
    boxSizing: 'border-box',
  },
  '& .MuiSelect-icon': { fontSize: 18, right: 6 },
  '& .MuiInputLabel-root': {
    fontSize: 12,
    transform: { xs: 'translate(12px, 10px)', sm: 'translate(12px, 7px)' },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(12px, -8px) scale(0.75)',
    },
  },
};

const iconBtnSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  width: H,
  height: H,
  p: 0,
  flexShrink: 0,
};

const rowSx = {
  display: 'grid',
  gap: 1,
  gridTemplateColumns: GRID_COLUMNS,
  alignItems: 'center',
} as const;

type FieldSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FieldSelect({ label, value, options, onChange }: FieldSelectProps) {
  return (
    <TextField
      select
      size="small"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={fieldSx}
    >
      <MenuItem value="" sx={{ fontSize: 12, minHeight: 30 }}>
        All
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option} sx={{ fontSize: 12, minHeight: 30 }}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

type FieldDateProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function FieldDate({ label, value, onChange }: FieldDateProps) {
  return (
    <TextField
      size="small"
      type="date"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ inputLabel: { shrink: true } }}
      sx={fieldSx}
    />
  );
}

export default function Filter({
  filters,
  options = {},
  search,
  onFilterChange,
  onSearchChange,
  onReset,
}: FilterProps) {
  const [expanded, setExpanded] = useState(false);

  const renderSelect = ({ key, label }: SelectField) => (
    <FieldSelect
      key={key}
      label={label}
      value={filters[key]}
      options={options[key] ?? []}
      onChange={(v) => onFilterChange(key, v)}
    />
  );

  return (
    <Box sx={{ mb: 1 }}>
      {/* Row 1: Search + Client, Vessel, Hub, Status, Vessel PO + actions */}
      <Box sx={rowSx}>
        {/* Search + actions: one line on mobile, spread into the grid on desktop */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'contents' },
            gridColumn: { xs: '1 / -1', md: 'auto' },
            gap: 1,
          }}
        >
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ fontSize: 16 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ ...fieldSx, flex: { xs: 1, md: 'initial' }, order: 0 }}
          />

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              order: { xs: 0, md: 1 },
              flexShrink: 0,
            }}
          >
            <Tooltip title="Reset filters">
              <IconButton onClick={onReset} size="small" sx={iconBtnSx}>
                <RefreshOutlined sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={expanded ? 'Show less' : 'Show more'}>
              <IconButton
                onClick={() => setExpanded((prev) => !prev)}
                size="small"
                aria-expanded={expanded}
                aria-label={expanded ? 'Show fewer filters' : 'Show more filters'}
                sx={iconBtnSx}
              >
                {expanded ? (
                  <KeyboardArrowUp sx={{ fontSize: 18 }} />
                ) : (
                  <KeyboardArrowDown sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {primaryFields.map(renderSelect)}
      </Box>

      {/* Rows 2 & 3: shown when expanded */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {/* Row 2: fills all 6 field columns */}
        <Box sx={{ ...rowSx, mt: 1 }}>{secondaryFields.map(renderSelect)}</Box>

        {/* Row 3: dates */}
        <Box sx={{ ...rowSx, mt: 1 }}>
          <FieldDate
            label="Date From"
            value={filters.dateFrom}
            onChange={(v) => onFilterChange('dateFrom', v)}
          />
          <FieldDate
            label="Date To"
            value={filters.dateTo}
            onChange={(v) => onFilterChange('dateTo', v)}
          />
        </Box>
      </Collapse>
    </Box>
  );
}