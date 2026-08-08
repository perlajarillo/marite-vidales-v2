import { useRef, useEffect, type KeyboardEvent, type MouseEvent } from "react";

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
      className="backdrop:bg-black/50 backdrop:backdrop-blur-sm p-2 open:animate-fade-in w-full h-full bg-white border border-gray-100 overflow-hidden"
    >
      <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black/70 p-2">
        {/* Container to prevent nested click bugs */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}

          <div className="flex items-center justify-end border-b border-gray-200 px-4 py-1">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-0 hover:bg-gray-50"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Content Body */}
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-1 sm:px-6">
            {children}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
