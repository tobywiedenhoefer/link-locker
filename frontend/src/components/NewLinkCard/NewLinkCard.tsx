import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

import AddNewLinkModal from "../AddNewLinkModal/AddNewLinkModal";
import Link from "src/types/link.type";

import "./NewLinkCard.css";
import "../LinkCard/LinkCard.css";

type NewLinkCardProps = {
  lockerId: string;
  handleSubmit: (link: Link) => void;
};

export default function NewLinkCard({
  lockerId,
  handleSubmit,
}: NewLinkCardProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="link-card new-link-card-wrapper">
        <div className="add-button" onClick={() => setShowModal(true)}>
          <IconPlus size={24} />
        </div>
      </div>
      <AddNewLinkModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        lockerId={lockerId}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
