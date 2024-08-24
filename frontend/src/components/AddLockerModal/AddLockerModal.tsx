import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { addNewLocker } from "../../store/data.store";

import Modal, { ModalProps } from "../Modal/Modal";
import FormInputRow from "../FormInputRow/FormInputRow";

import Locker from "../../types/locker.type";
import {
  AddLockerFormFields as FormFields,
  AddLockerValidators as Validators,
} from "../../types/formTypes.type";

import {
  DEFAULT_ADD_LOCKER_FORM_FIELDS as DEFAULT_FORM_FIELDS,
  DEFAULT_ADD_LOCKER_VALIDATORS as DEFAULT_VALIDATORS,
} from "../../constants/defaults";
import SubmissionWorkflow from "../../constants/submissionWorkflows";

import "./AddLockerModal.css";

type AddLockerModalProps = {
  handleSubmit: (locker: Locker) => void;
} & ModalProps;
export default function AddLockerModal(props: AddLockerModalProps) {
  const [formFields, setFormFields] = useState<FormFields>(DEFAULT_FORM_FIELDS);
  const [validators, setValidators] = useState<Validators>(DEFAULT_VALIDATORS);
  const [workflow, setWorkflow] = useState<SubmissionWorkflow>(
    SubmissionWorkflow.default
  );
  useEffect(() => {
    (async () => {
      switch (workflow) {
        case SubmissionWorkflow.submitting: {
          const newLocker: Locker = {
            id: -1,
            name: formFields.name,
            user_id: -1,
            locked: formFields.locked,
            combination: formFields.combination,
          };
          const resp = await addNewLocker(newLocker);
          if (resp.success) {
            props.handleSubmit(newLocker);
            setWorkflow(SubmissionWorkflow.default);
            toast.success("Success!", {
              position: "bottom-right",
              draggable: true,
            });
            props.handleClose();
          } else {
            setWorkflow(SubmissionWorkflow.failure);
          }
          break;
        }
        case SubmissionWorkflow.failure: {
          toast.error("Could not add locker! Please try again later.", {
            position: "bottom-right",
            draggable: true,
          });
          setWorkflow(SubmissionWorkflow.default);
          break;
        }
      }
    })();
  }, [workflow]);
  const handleSetFormFields = (k: keyof FormFields, v: string) => {
    setFormFields({
      ...formFields,
      [k]: v,
    });
  };
  const handleSetValidators = (k: keyof Validators, v: string) => {
    setValidators({
      ...validators,
      [k]: { touched: true, valid: v.length > 0 },
    });
  };
  const handleSubmit = () => {
    if (
      formFields.name &&
      (!formFields.locked || (formFields.locked && formFields.combination))
    ) {
      setWorkflow(SubmissionWorkflow.submitting);
    }
  };
  const handleRadioOnChange = (isLocked: boolean) => {
    setFormFields({ ...formFields, locked: isLocked });
  };
  return (
    <Modal
      {...props}
      handleClose={() => {
        setFormFields(DEFAULT_FORM_FIELDS);
        setValidators(DEFAULT_VALIDATORS);
        props.handleClose();
      }}
    >
      <div className="add-locker-modal-wrapper">
        <div className="add-locker-form">
          <h2 className="form-name">Create a Locker</h2>
          <div className="form-fields">
            <FormInputRow
              title="Name"
              keyName="name"
              validators={validators}
              setValidators={handleSetValidators}
              formFields={formFields}
              setFormFields={handleSetFormFields}
              required
            />
            <div className="form-row">
              <p className="row-title">Type</p>
              <div className="radio-buttons">
                <div
                  className="radio-button"
                  onClick={() => handleRadioOnChange(false)}
                >
                  <input
                    type="radio"
                    name="unlocked"
                    checked={!formFields.locked}
                    onChange={() => {}}
                  />
                  <label htmlFor="unlocked">Unlocked</label>
                </div>
                <div
                  className="radio-button"
                  onClick={() => handleRadioOnChange(true)}
                >
                  <input
                    type="radio"
                    name="locked"
                    checked={formFields.locked}
                    onChange={() => {}}
                  />
                  <label htmlFor="locked">Locked</label>
                </div>
              </div>
            </div>
            {formFields.locked ? (
              <FormInputRow
                title="Combination"
                keyName="combination"
                validators={validators}
                setValidators={handleSetValidators}
                formFields={formFields}
                setFormFields={handleSetFormFields}
                required
              />
            ) : null}
          </div>
        </div>
        <div className="submit-button-wrapper">
          <button
            className="submit-form-button"
            disabled={
              !formFields.name || (formFields.locked && !formFields.combination)
            }
            onClick={() => handleSubmit()}
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
