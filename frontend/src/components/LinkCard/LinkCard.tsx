import { useEffect, useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";

import Link from "../../types/link.type";
import LinkTags from "../LinkTags/LinkTags";

import "./LinkCard.css";

type LinkCardProps = {
  link: Link;
  removeable: boolean;
  onClick: () => void;
};
export default function LinkCard({ link, removeable, onClick }: LinkCardProps) {
  const [showConfirmRemove, setShowConfirmRemove] = useState<boolean>(false);
  useEffect(() => {
    if (!removeable) {
      setShowConfirmRemove(false);
    }
  }, [removeable]);
  return (
    <section
      className={`link-card ${!removeable && "clickable-card"}`}
      onClick={removeable ? () => null : onClick}
    >
      <div className="link-card-text">
        {showConfirmRemove ? "Remove?" : link.name}
      </div>
      {showConfirmRemove ? (
        <div className="removal-confirmation-buttons-row">
          <div className="confirm-removal-button">
            <IconCheck size={24} />
          </div>
          <div
            className="confirm-removal-button"
            onClick={() => setShowConfirmRemove(false)}
          >
            <IconX size={24} />
          </div>
        </div>
      ) : (
        <LinkTags tags={link.tags} />
      )}
      {removeable && (
        <div
          className="remove-card-button"
          onClick={() => setShowConfirmRemove(true)}
          tabIndex={0}
        >
          <IconX size={18} />
        </div>
      )}
    </section>
  );
}
