import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, className = "", onClose }) {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;

    if (open && !modal.open) {
      modal.showModal();
    }
    if (!open && modal.open) {
      modal.close();
    }
  }, [open]);

  return createPortal(
    <dialog
      ref={dialog}
      className={`modal ${className}`}
      onClose={onClose}
      data-testid="modal"
    >
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
