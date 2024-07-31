import { useState } from "react";

import { IconSearch } from "@tabler/icons-react";

import SearchLockedLockersModal from "../SearchLockedLockersModal/SearchLockedLockersModal";

import "./SearchLockedLockersButton.css";

type SearchLockedLockersButtonProps = {};
export default function SearchLockedLockersButton(
  _: SearchLockedLockersButtonProps
) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className="locker-button"
        tabIndex={0}
        onClick={() => setShowModal(true)}
      >
        <IconSearch size={24} />
      </div>
      <SearchLockedLockersModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
}
