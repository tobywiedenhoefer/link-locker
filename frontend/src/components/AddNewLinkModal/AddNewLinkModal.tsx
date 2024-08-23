import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal, { ModalProps } from "../Modal/Modal";
import FormInputRow from "../FormInputRow/FormInputRow";
import LinkTag from "../LinkTag/LinkTag";

import { addNewLink } from "../../store/data.store";
import { useAuth } from "../../contexts/AuthContext";

import Link from "../../types/link.type";
import {
  AddNewLinkFormFields as FormFields,
  AddNewLinkValidators as Validators,
} from "../../types/formTypes.type";

import SubmissionWorkflow from "../../constants/submissionWorkflows";
import {
  DEFAULT_ADD_NEW_LINK_FORM_FIELDS as DEFAULT_FORM_FIELDS,
  DEFAULT_ADD_NEW_LINK_VALIDATORS as DEFAULT_VALIDATORS,
} from "../../constants/defaults";

import "./AddNewLinkModal.css";
import "../LinkCard/LinkCard.css";

type AddNewLinkModalProps = {
  lockerId: number;
  handleSubmit: (link: Link) => void;
} & ModalProps;

export default function AddNewLinkModal(props: AddNewLinkModalProps) {
  const [formFields, setFormFields] = useState<FormFields>(DEFAULT_FORM_FIELDS);
  const [workflow, setWorkflow] = useState<SubmissionWorkflow>(
    SubmissionWorkflow.default
  );
  const [validators, setValidators] = useState<Validators>(DEFAULT_VALIDATORS);
  useEffect(() => {
    switch (workflow) {
      case SubmissionWorkflow.submitting: {
        (async () => {
          const newLink: Link = {
            id: -1,
            name: formFields.name,
            url: formFields.url,
            tags: formFields.tags,
          };
          const resp = await addNewLink(props.lockerId, newLink);
          if (resp.success) {
            props.handleSubmit({ ...newLink, id: resp.payload });
            setWorkflow(SubmissionWorkflow.default);
            toast.success("Success!", {
              position: "top-center",
            });
            props.handleClose();
          } else {
            setWorkflow(SubmissionWorkflow.failure);
          }
        })();
        break;
      }
      case SubmissionWorkflow.failure: {
        // TODO: ADD FAILURE WORKFLOW
        break;
      }
    }
  }, [workflow]);
  const handleSetFormFields = (k: keyof FormFields, v: string) => {
    setFormFields({ ...formFields, [k]: v });
  };
  const handleSetValidators = (k: keyof Validators, v: string) => {
    let valid = v.length > 0;
    if (valid && k === "url") {
      try {
        new URL(v);
      } catch {
        valid = false;
      }
    }
    setValidators({
      ...validators,
      [k]: { touched: true, valid: valid },
    });
  };
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formFields.tag.length > 0) {
      if (!formFields.tags.includes(formFields.tag)) {
        setFormFields({
          ...formFields,
          tags: [...formFields.tags, formFields.tag],
          tag: "",
        });
      } else {
        setFormFields({
          ...formFields,
          tag: "",
        });
      }
    }
  };
  const handleSubmit = () => {
    // TODO: validate URL
    if (formFields.name && formFields.url) {
      setWorkflow(SubmissionWorkflow.submitting);
    }
  };
  return (
    <Modal
      show={props.show}
      handleClose={() => {
        setFormFields({ name: "", url: "", tag: "", tags: [] });
        setValidators(DEFAULT_VALIDATORS);
        props.handleClose();
      }}
    >
      <div className="add-new-link-modal-wrapper">
        <div className="add-new-link-form">
          <h2 className="form-name">Add New Link</h2>
          <div className="form-fields">
            <FormInputRow
              title="Link Name"
              keyName="name"
              validators={validators}
              setValidators={handleSetValidators}
              formFields={formFields}
              setFormFields={handleSetFormFields}
              required
            />
            <FormInputRow
              title="URL"
              keyName="url"
              validators={validators}
              formFields={formFields}
              setValidators={handleSetValidators}
              setFormFields={handleSetFormFields}
              required
            />
            <FormInputRow
              title={"Add a Tag"}
              keyName={"tag"}
              validators={validators}
              formFields={formFields}
              setValidators={handleSetValidators}
              setFormFields={handleSetFormFields}
              onKeyUp={handleKeyUp}
            />
            <div className="form-row">
              <p className="row-title">Tags:</p>
              <div className="link-card-tags">
                {formFields.tags.map((tag, ind) => {
                  return (
                    <LinkTag key={`link-tag-${ind}`} name={tag} ind={ind} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="submit-button-wrapper">
          <button
            className="submit-form-button"
            disabled={!formFields.name || !formFields.url}
            onClick={handleSubmit}
            onKeyUp={(e) => {
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
