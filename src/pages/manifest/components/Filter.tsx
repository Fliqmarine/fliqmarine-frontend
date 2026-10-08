import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  RefreshOutlined,
  SearchOutlined,
} from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';

export type ExtraFilters = {
  client: string;
  vessel: string;
  hub: string;
  keyAccountManager: string;
  consignee: string;
  portOfDestination: string;
  mode: string;
  dateFrom: string;
  dateTo: string;
  internalStatus: string;
  manifestNo: string;
  mailSent: boolean;
};

const emptyExtraFilters: ExtraFilters = {
  client: '',
  vessel: '',
  hub: '',
  keyAccountManager: '',
  consignee: '',
  portOfDestination: '',
  mode: '',
  dateFrom: '',
  dateTo: '',
  internalStatus: '',
  manifestNo: '',
  mailSent: false,
};

type FilterOptions = {
  clients: string[];
  vessels: string[];
  hubs: string[];
  keyAccountManagers: string[];
  consignees: string[];
  portsOfDestination: string[];
  modes: string[];
  internalStatuses: string[];
  manifestNos: string[];
};

const defaultOptions: FilterOptions = {
  clients: ['V.Ships Offshore (Asia) Pte Ltd'],
  vessels: ['AM PASSION'],
  hubs: ['PVG-HUB'],
  keyAccountManagers: [],
  consignees: [],
  portsOfDestination: [],
  modes: ['Air', 'Sea'],
  internalStatuses: [],
  manifestNos: [],
};

type FilterProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  onExtraFiltersChange?: (filters: ExtraFilters) => void;
  options?: Partial<FilterOptions>;
};

// One height for EVERY control (search, selects, text field, buttons)
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
  // floating label tuned for the compact height
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

type FieldCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function FieldCheckbox({ label, checked, onChange }: FieldCheckboxProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          sx={{ p: 0.5, mr: 0.25, '& .MuiSvgIcon-root': { fontSize: 18 } }}
        />
      }
      label={label}
      sx={{
        m: 0,
        height: H,
        alignItems: 'center',
        whiteSpace: 'nowrap',
        '& .MuiFormControlLabel-label': { fontSize: 12, fontWeight: 500 },
      }}
    />
  );
}

export default function Filter({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
  onExtraFiltersChange,
  options,
}: FilterProps) {
  const [expanded, setExpanded] = useState(false);
  const [extra, setExtra] = useState<ExtraFilters>(emptyExtraFilters);

  const opts = { ...defaultOptions, ...options };

  const updateExtra = <K extends keyof ExtraFilters>(
    key: K,
    value: ExtraFilters[K],
  ) => {
    const next = { ...extra, [key]: value };
    setExtra(next);
    onExtraFiltersChange?.(next);
  };

  const handleReset = () => {
    setExtra(emptyExtraFilters);
    onExtraFiltersChange?.(emptyExtraFilters);
    onReset();
  };

  return (
    <Box sx={{ mb: 1 }}>
      {/* Row 1: Client, Vessel, Hub, Status, Key Account Manager */}
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: GRID_COLUMNS,
          alignItems: 'center',
        }}
      >
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
            placeholder="Search manifests..."
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
              <IconButton onClick={handleReset} size="small" sx={iconBtnSx}>
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

        <FieldSelect
          label="Client"
          value={extra.client}
          options={opts.clients}
          onChange={(v) => updateExtra('client', v)}
        />
        <FieldSelect
          label="Vessel"
          value={extra.vessel}
          options={opts.vessels}
          onChange={(v) => updateExtra('vessel', v)}
        />
        <FieldSelect
          label="Hub"
          value={extra.hub}
          options={opts.hubs}
          onChange={(v) => updateExtra('hub', v)}
        />
        <FieldSelect
          label="Status"
          value={status}
          options={['Active', 'InActive']}
          onChange={onStatusChange}
        />
        <FieldSelect
          label="Key Account Manager"
          value={extra.keyAccountManager}
          options={opts.keyAccountManagers}
          onChange={(v) => updateExtra('keyAccountManager', v)}
        />
      </Box>

      {/* Rows 2 & 3: shown when expanded */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {/* Row 2: fills all 6 field columns */}
        <Box
            sx={{
            display: 'grid',
            gap: 1,
            mt: 1,
            gridTemplateColumns: GRID_COLUMNS,
            alignItems: 'center',
            }}
        >
            <FieldSelect
            label="Consignee"
            value={extra.consignee}
            options={opts.consignees}
            onChange={(v) => updateExtra('consignee', v)}
            />
            <FieldSelect
            label="Port Of Destination"
            value={extra.portOfDestination}
            options={opts.portsOfDestination}
            onChange={(v) => updateExtra('portOfDestination', v)}
            />
            <FieldSelect
            label="Mode"
            value={extra.mode}
            options={opts.modes}
            onChange={(v) => updateExtra('mode', v)}
            />
            <FieldDate
            label="Date From"
            value={extra.dateFrom}
            onChange={(v) => updateExtra('dateFrom', v)}
            />
            <FieldDate
            label="Date To"
            value={extra.dateTo}
            onChange={(v) => updateExtra('dateTo', v)}
            />
            <FieldSelect
            label="Internal status"
            value={extra.internalStatus}
            options={opts.internalStatuses}
            onChange={(v) => updateExtra('internalStatus', v)}
            />
        </Box>

        {/* Row 3: Manifest No, Mail Sent */}
        <Box
            sx={{
            display: 'grid',
            gap: 1,
            mt: 1,
            gridTemplateColumns: GRID_COLUMNS,
            alignItems: 'center',
            }}
        >
            <FieldSelect
            label="Manifest No"
            value={extra.manifestNo}
            options={opts.manifestNos}
            onChange={(v) => updateExtra('manifestNo', v)}
            />
            <FieldCheckbox
            label="Mail Sent"
            checked={extra.mailSent}
            onChange={(v) => updateExtra('mailSent', v)}
            />
        </Box>
        </Collapse>
    </Box>
  );
}