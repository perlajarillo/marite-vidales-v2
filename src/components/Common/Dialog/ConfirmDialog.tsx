interface ConfirmDialogProps {
  dialogTitle: string;
  dialogBody: string | React.ReactNode;
  confirmAction: () => void;
  cancelAction: () => void;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { dialogTitle, dialogBody, confirmAction, cancelAction } = props;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-brand-primary">
          {dialogTitle}
        </h3>
        <p className="text-sm text-slate-600">{dialogBody}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelAction}
            className="rounded border border-slate-300 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmAction}
            className="rounded bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
