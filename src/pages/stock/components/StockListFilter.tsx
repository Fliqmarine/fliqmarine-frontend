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
  station: string;
  supplier: string;
  poNo: string;
  transitNo: string;
  stocks30Days: boolean;
  noSupplierDocs: boolean;
  dg: boolean;
  pickup: boolean;
  noChineseDocs: boolean;
};

const emptyExtraFilters: ExtraFilters = {
  client: '',
  vessel: '',
  station: '',
  supplier: '',
  poNo: '',
  transitNo: '',
  stocks30Days: false,
  noSupplierDocs: false,
  dg: false,
  pickup: false,
  noChineseDocs: false,
};

type FilterOptions = {
  clients: string[];
  vessels: string[];
  stations: string[];
  suppliers: string[];
  poNos: string[];
};

const defaultOptions: FilterOptions = {
  clients: ['V.Ships Offshore (Asia) Pte Ltd'],
  vessels: ['AM PASSION'],
  stations: ['PVG-HUB'],
  suppliers: ['BORPO MARINE'],
  poNos: ['6245-00149'],
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

// Same grid for both rows so columns line up
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
      {/* Row 1 */}
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
            placeholder="Search stock lists..."
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
          label="Station"
          value={extra.station}
          options={opts.stations}
          onChange={(v) => updateExtra('station', v)}
        />
        <FieldSelect
          label="Supplier"
          value={extra.supplier}
          options={opts.suppliers}
          onChange={(v) => updateExtra('supplier', v)}
        />
        <FieldSelect
          label="PO No"
          value={extra.poNo}
          options={opts.poNos}
          onChange={(v) => updateExtra('poNo', v)}
        />
      </Box>

      {/* Row 2: shown when expanded */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            mt: 1,
            gridTemplateColumns: GRID_COLUMNS,
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            label="Transit No"
            value={extra.transitNo}
            onChange={(event) => updateExtra('transitNo', event.target.value)}
            sx={fieldSx}
          />

          <FieldSelect
            label="Status"
            value={status}
            options={['Active', 'InActive']}
            onChange={onStatusChange}
          />

          <Box
            sx={{
              gridColumn: { xs: '1 / -1', sm: '1 / -1', md: '3 / -1' },
              display: { xs: 'grid', md: 'flex' },
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
              },
              flexWrap: 'wrap',
              columnGap: { xs: 1, md: 2 },
              alignItems: 'center',
            }}
          >
            <FieldCheckbox
              label="Stocks 30+ days"
              checked={extra.stocks30Days}
              onChange={(v) => updateExtra('stocks30Days', v)}
            />
            <FieldCheckbox
              label="Cargos Without Supplier Docs"
              checked={extra.noSupplierDocs}
              onChange={(v) => updateExtra('noSupplierDocs', v)}
            />
            <FieldCheckbox
              label="DG"
              checked={extra.dg}
              onChange={(v) => updateExtra('dg', v)}
            />
            <FieldCheckbox
              label="Pickup"
              checked={extra.pickup}
              onChange={(v) => updateExtra('pickup', v)}
            />
            <FieldCheckbox
              label="Stocks Without Chinese Docs"
              checked={extra.noChineseDocs}
              onChange={(v) => updateExtra('noChineseDocs', v)}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}