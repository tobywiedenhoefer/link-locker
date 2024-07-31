import { useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import AddLockerModal from "../AddLockerModal/AddLockerModal";
import Locker from "../../types/locker.type";

import "./AddLockerButton.css";

type AddLockerButtonProps = { handleSubmit: (locker: Locker) => void };
export default function AddLockerButton(props: AddLockerButtonProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className="locker-button"
        tabIndex={0}
        onClick={() => setShowModal(true)}
      >
        <IconPlus size={24} />
      </div>
      <AddLockerModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={props.handleSubmit}
      />
    </>
  );
}
