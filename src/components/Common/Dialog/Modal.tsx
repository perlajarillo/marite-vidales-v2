import { useRef, useEffect, type KeyboardEvent, type MouseEvent } from "react";
import styles from "./Modal.module.css";
import intl from "../../../locales/en.json";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { isOpen, onClose, children } = props;

  // Sync the native browser dialog state with the React isOpen prop
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (isOpen) {
      dialogElement.showModal(); // API method to open as modal overlay
    } else {
      dialogElement.close(); // API method to close safely
    }
  }, [isOpen]);

  // Handle closing when user presses the Escape key
  const handleCancel = (event: KeyboardEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  // Close the dialog when clicking on the backdrop area
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={styles.dialogWrapper}
    >
      <div className={styles.modalContainer}>
        {/* Container to prevent nested click bugs */}
        <div className={styles.modalContent}>
          {/* Header */}

          <div className={styles.modalHeader}>
            <button
              onClick={onClose}
              className={styles.modalCloseButton}
              aria-label={intl.close}
            >
              ✕
            </button>
          </div>

          {/* Content Body */}
          <div className={styles.modalBody}>{children}</div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
