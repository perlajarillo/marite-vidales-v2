import styles from "./Modal.module.css";

interface ConfirmDialogProps {
  dialogTitle: string;
  dialogBody: string | React.ReactNode;
  confirmAction: () => void;
  cancelAction: () => void;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { dialogTitle, dialogBody, confirmAction, cancelAction } = props;
  return (
    <div className={styles.confirmDialog} role="dialog" aria-modal="true">
      <div className={styles.confirmDialogContainer}>
        <h3 className={styles.dialogTitle}>{dialogTitle}</h3>
        <p className={styles.confirmDialogBody}>{dialogBody}</p>
        <div className={styles.confirmDialogActionBar}>
          <button
            type="button"
            onClick={cancelAction}
            className={styles.dialogSecondaryButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmAction}
            className={styles.dialogPrimaryButton}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
