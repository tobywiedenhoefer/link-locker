import React from "react";

import { IconX } from "@tabler/icons-react";

import "./Modal.css";

export type ModalProps = {
  show: boolean;
  handleClose: () => void;
  large?: boolean;
  children?: React.ReactNode | null;
};

export default function Modal({ show, handleClose, children }: ModalProps) {
  const showHideClassName = show ? "display-block" : "display-none";
  return (
    <div
      className={showHideClassName}
      onKeyDownCapture={(e) => {
        if (e.key === "Escape") {
          handleClose();
        }
      }}
    >
      <div className="modal" onClick={handleClose} />
      <section className="modal-main">
        {children}
        <div
          className="modal-close-button"
          onClick={handleClose}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.code === "Space") {
              handleClose();
            }
          }}
          tabIndex={0}
        >
          <IconX size={24} />
        </div>
      </section>
    </div>
  );
}
