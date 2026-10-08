import { lazy, Suspense } from 'react';
import type { ComponentType } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ViewModal from './ViewModal';

/* Each view lives in its own feature folder and is loaded only when opened.
   Every view must `export default` a component that accepts an `id` prop. */
const StockView = lazy(() => import('@/pages/stock/StockView'));
// const ManifestView = lazy(() => import('@/pages/manifest/ManifestView'));
// const PreAlertView = lazy(() => import('@/pages/prealert/PreAlertView'));
// const InvoiceView  = lazy(() => import('@/pages/invoice/InvoiceView'));

export type ViewType = 'stock'; // add: | 'manifest' | 'prealert' | 'invoice'

export type ViewTarget = {
  type: ViewType;
  id: number | string;
  label?: string; // shown after the title, e.g. the stock number
};

const VIEWS: Record<ViewType, { title: string; Component: ComponentType<{ id: number | string }> }> = {
  stock: { title: 'Stock', Component: StockView },
  // manifest: { title: 'Manifest',  Component: ManifestView },
  // prealert: { title: 'Pre-alert', Component: PreAlertView },
  // invoice:  { title: 'Invoice',   Component: InvoiceView },
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
    <ViewModal open={Boolean(target)} title={title} onClose={onClose}>
      {view && target && (
        <Suspense
          fallback={
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress size={28} />
            </Box>
          }
        >
          <view.Component id={target.id} />
        </Suspense>
      )}
    </ViewModal>
  );
}