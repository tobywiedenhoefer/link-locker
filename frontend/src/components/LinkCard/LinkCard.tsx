import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconX } from "@tabler/icons-react";

import Link from "../../types/link.type";
import LinkTags from "../LinkTags/LinkTags";

import { removeLink } from "../../store/data.store";
import { ErrorCodes } from "../../shared/errors";

import { default as swf } from "../../constants/submissionWorkflows";

import "./LinkCard.css";
import "../../shared/loading.css";
import LinkRemovalButtonRow from "../LinkRemovalButtonRow/LinkRemovalButtonRow";

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
  const navigate = useNavigate();
  useEffect(() => {
    if (!removeable) {
      setShowConfirmRemove(false);
    }
  }, [removeable]);
  useEffect(() => {
    (async () => {
      switch (workflow) {
        case swf.submitting: {
          const linkRemoved = await removeLink(link.id);
          console.log("response", linkRemoved);
          if (linkRemoved.success) {
            setWorkflow(swf.success);
          } else if (
            linkRemoved.errorCode === ErrorCodes.CacheExpiredOrNotSet
          ) {
            toast.error("Session expired, please log in again.", {
              position: "top-center",
              draggable: true,
            });
            navigate("/", { replace: true });
          } else {
            setWorkflow(swf.failure);
          }
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
          toast.error(
            "Link could not be removed right now. Please try again later.",
            {
              position: "bottom-right",
              draggable: true,
            }
          );
          setWorkflow(swf.default);
          setShowConfirmRemove(false);
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
        <LinkRemovalButtonRow
          workflow={workflow}
          exitRemovalWorkflow={() => setShowConfirmRemove(false)}
          enterSubmittingWorkflow={() => setWorkflow(swf.submitting)}
        />
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
