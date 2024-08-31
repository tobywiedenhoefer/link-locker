import { IconCheck, IconX } from "@tabler/icons-react";

import { default as swf } from "../../constants/submissionWorkflows";

import "./LinkRemovalButtonRow.css";
import "../../shared/loading.css";

type LinkRemovalButtonRowProps = {
  workflow: swf;
  exitRemovalWorkflow: () => void;
  enterSubmittingWorkflow: () => void;
};
export default function (props: LinkRemovalButtonRowProps) {
  return (
    <div className="removal-confirmation-buttons-row">
      {props.workflow !== swf.submitting ? (
        <>
          <div
            className="confirm-removal-button"
            onClick={props.enterSubmittingWorkflow}
          >
            <IconCheck size={24} />
          </div>
          <div
            className="confirm-removal-button"
            onClick={props.exitRemovalWorkflow}
          >
            <IconX size={24} />
          </div>
        </>
      ) : (
        <div className="button-loading-spinner" />
      )}
    </div>
  );
}
