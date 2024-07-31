import { IconEdit, IconCheck } from "@tabler/icons-react";

import "./LockerEditButton.css";

type LockerEditButtonProps = {
  changeStatus: () => void;
  status: "edit" | "view";
};

export default function LockerEditButton({
  changeStatus,
  status,
}: LockerEditButtonProps) {
  return (
    <div className="edit-button-wrapper" onClick={changeStatus}>
      <div className="edit-button" role="button" aria-label="Edit">
        {status === "view" ? <IconEdit size={24} /> : <IconCheck size={24} />}
      </div>
    </div>
  );
}
