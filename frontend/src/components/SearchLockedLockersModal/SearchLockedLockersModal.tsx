import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Modal, { ModalProps } from "../Modal/Modal";

import LockerState from "../../types/lockerState.type";
import {
  CombinationFormFields as FormFields,
  CombinationValidators as Validators,
} from "../../types/formTypes.type";
import SubmissionWorkflow from "../../constants/submissionWorkflows";

import { getLockedLocker } from "../../store/data.store";
import { getExpiryDate } from "../../store/date.store";

import {
  DEFAULT_COMBINATION_FORM_FIELDS as DEFAULT_FORM_FIELDS,
  DEFAULT_COMBINATION_VALIDATORS as DEFAULT_VALIDATORS,
} from "../../constants/defaults";

import "./SearchLockedLockersModal.css";
import "../AddNewLinkModal/AddNewLinkModal.css";

type SearchLockedLockersModalProps = ModalProps & {};
export default function SearchLockedLockersModal(
  props: SearchLockedLockersModalProps
) {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormFields>(DEFAULT_FORM_FIELDS);
  const [validators, setValidators] = useState<Validators>(DEFAULT_VALIDATORS);
  const [workflow, setWorkflow] = useState<SubmissionWorkflow>(
    SubmissionWorkflow.default
  );
  const [nextLocker, setNextLocker] = useState<number | undefined>();

  useEffect(() => {
    switch (workflow) {
      case SubmissionWorkflow.submitting: {
        (async () => {
          const res = await getLockedLocker(formFields.combination);
          if (res.success) {
            setNextLocker(res.payload);
            setWorkflow(SubmissionWorkflow.success);
          } else {
            setWorkflow(SubmissionWorkflow.failure);
          }
        })();
        break;
      }
      case SubmissionWorkflow.failure: {
        break;
      }
      case SubmissionWorkflow.success: {
        const lockerState: LockerState = {
          date: getExpiryDate("locker"),
          combination: formFields.combination,
        };
        props.handleClose();
        navigate(`locker/${nextLocker}`, { state: lockerState });
      }
    }
  }, [workflow]);

  const handleSubmit = () => {
    if (formFields.combination) {
      setWorkflow(SubmissionWorkflow.submitting);
    }
  };
  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormFields({ combination: e.target.value });
    setValidators({
      combination: {
        touched: true,
        valid: e.target.value.length > 0 ? true : false,
      },
    });
  };
  const handleInputOnBlur = () => {
    if (!validators.combination.touched) {
      setValidators({
        combination: { touched: true, valid: validators.combination.valid },
      });
    }
  };
  const getStyle = (type: "border" | "label") => {
    const errorColor = "#ff7575";
    const isError =
      !validators.combination.valid && validators.combination.touched;
    switch (type) {
      case "border": {
        return {
          boxShadow: `0 1px 5px ${isError ? errorColor : "rgba(0,0,0,0.2)"}`,
        };
      }
      case "label": {
        return {
          color: isError ? errorColor : "#6a6a6a",
        };
      }
    }
  };
  return (
    <Modal show={props.show} handleClose={props.handleClose}>
      <div className="search-locked-locker-modal-wrapper">
        <div className="search-locked-locker-form">
          <h2 className="form-name">Search for a Locker</h2>
          <div className="form-fields">
            <div className="form-row">
              <p className="row-title">Combination</p>
              <div className="form-input">
                <input
                  name="locker-combination"
                  value={formFields.combination}
                  onChange={handleInputOnChange}
                  onBlur={() => handleInputOnBlur()}
                  style={getStyle("border")}
                />
                <label htmlFor="locker-combination" style={getStyle("label")}>
                  required
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="submit-button-wrapper">
          <button
            className="submit-form-button"
            disabled={!formFields.combination}
            onClick={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.code === "Space") {
                handleSubmit();
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}
