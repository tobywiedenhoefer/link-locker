import { useEffect, useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { toast } from "react-toastify";

import Link from "../../types/link.type";
import LinkTags from "../LinkTags/LinkTags";

import { default as swf } from "../../constants/submissionWorkflows";

import "./LinkCard.css";

type LinkCardProps = {
  link: Link;
  removeable: boolean;
  removeLinkId: (id: number) => void;
  onClick: () => void;
};
export default function LinkCard({
  link,
  removeable,
  onClick,
  removeLinkId,
}: LinkCardProps) {
  const [showConfirmRemove, setShowConfirmRemove] = useState<boolean>(false);
  const [workflow, setWorkflow] = useState<swf>(swf.default);
  useEffect(() => {
    if (!removeable) {
      setShowConfirmRemove(false);
    }
  }, [removeable]);
  useEffect(() => {
    (async () => {
      switch (workflow) {
        case swf.submitting: {
          setWorkflow(swf.success);
          break;
        }
        case swf.success: {
          removeLinkId(link.id);
          toast.success("Link removed!", {
            position: "bottom-right",
            draggable: true,
          });
          break;
        }
        case swf.failure: {
          setWorkflow(swf.default);
          toast.error(
            "Link could not be removed right now. Please try again later.",
            {
              position: "bottom-right",
              draggable: true,
            }
          );
          break;
        }
      }
    })();
  }, [workflow]);
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
          <div
            className="confirm-removal-button"
            onClick={() => setWorkflow(swf.submitting)}
          >
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
