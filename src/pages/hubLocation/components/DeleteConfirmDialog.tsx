import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type DeleteConfirmDialogProps = {
  open: boolean;
  name?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmDialog({
  open,
  name,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontSize: 16, fontWeight: 700 }}>
        Delete hub location
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ fontSize: 13 }}>
          Delete {name ? `"${name}"` : 'this hub location'}? This can't be
          undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5, gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={onCancel}
          sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}