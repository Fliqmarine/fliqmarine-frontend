import { lazy, Suspense } from 'react';
import type { ComponentType } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ViewModal from './ViewModal';
import type { ViewModalProps } from './ViewModal';

/* Each view is loaded only when opened. Use relative paths (or configure the "@" alias). */
const VendorInvoice = lazy(() => import('../../pages/prealert/VendorInvoice'));
const StockView = lazy(() => import('../../pages/stock/View')); // re-add once the file exists

export type ViewType = 'vendorInvoice'; // add: | 'stock' | 'manifest' ...

export type ViewTarget = {
  type: ViewType;
  id: number | string;
  label?: string; // shown after the title, e.g. the manifest number
  props?: Record<string, unknown>; // extra props forwarded to the view
};

type ViewEntry = {
  title: string;
  maxWidth?: ViewModalProps['maxWidth'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
};

const VIEWS: Record<ViewType, ViewEntry> = {
  vendorInvoice: { title: 'Move to Stage 4 –', maxWidth: 'sm', Component: VendorInvoice },
  stock: { title: 'Stock', Component: StockView },
};

type ViewHostProps = {
  target: ViewTarget | null;
  onClose: () => void;
};

// One modal for every view type: picks the page from VIEWS using target.type.
export default function ViewHost({ target, onClose }: ViewHostProps) {
  const view = target ? VIEWS[target.type] : null;
  const title = view ? `${view.title}${target?.label ? ` ${target.label}` : ''}` : '';

  return (
    <ViewModal open={Boolean(target)} title={title} onClose={onClose} maxWidth={view?.maxWidth}>
      {view && target && (
        <Suspense
          fallback={
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress size={28} />
            </Box>
          }
        >
          <view.Component id={target.id} onClose={onClose} {...target.props} />
        </Suspense>
      )}
    </ViewModal>
  );
}