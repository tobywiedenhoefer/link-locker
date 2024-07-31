import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FormInputRow from "../../components/FormInputRow/FormInputRow";

import {
  CreateAnAccountFormFields as FormFields,
  CreateAnAccountValidators as Validators,
} from "../../types/formTypes.type";
import SubmissionWorkflow from "../../constants/submissionWorkflows";

import {
  DEFAULT_CREATE_AN_ACCOUNT_FORM_FIELDS as DEFAULT_FORM_FIELDS,
  DEFAULT_CREATE_AN_ACCOUNT_VALIDATORS as DEFAULT_VALIDATORS,
} from "../../constants/defaults";

import "./CreateAnAccount.css";
import "../../shared/form.css";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { createAndAuthenticateLogin } from "../../store/data.store";
import AuthCreds from "../../types/authCreds.type";
import { useAuth } from "../../contexts/AuthContext";

type CreateAnAccountProps = {};
export default function CreateAnAccount(_: CreateAnAccountProps) {
  const navigate = useNavigate();
  const { updateToken } = useAuth();
  const [formFields, setFormFields] = useState<FormFields>(DEFAULT_FORM_FIELDS);
  const [validators, setValidators] = useState<Validators>(DEFAULT_VALIDATORS);
  const [auth, setAuth] = useState<AuthCreds | undefined>();
  const [workflow, setWorkflow] = useState<SubmissionWorkflow>(
    SubmissionWorkflow.default
  );
  useEffect(() => {
    (async () => {
      switch (workflow) {
        case SubmissionWorkflow.submitting: {
          const resp = await createAndAuthenticateLogin(
            formFields.username,
            formFields.password
          );
          if (resp.success) {
            setAuth(resp.payload);
            setWorkflow(SubmissionWorkflow.success);
          } else {
            setWorkflow(SubmissionWorkflow.failure);
          }
          break;
        }
        case SubmissionWorkflow.success: {
          setWorkflow(SubmissionWorkflow.default);
          updateToken(auth!.token);
          break;
        }
        case SubmissionWorkflow.failure: {
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
    const minValidLength = k === "password" || k === "confirmPassword" ? 7 : 1;
    setValidators({
      ...validators,
      [k]: { touched: true, valid: v.length > minValidLength },
    });
  };
  return (
    <div className="create-an-account-form-container">
      <div className="create-an-account-form">
        <h2 className="form-name">Create an Account</h2>
        <div className="form-fields">
          <FormInputRow
            title="Username"
            keyName={"username"}
            validators={validators}
            formFields={formFields}
            setValidators={handleSetValidators}
            setFormFields={handleSetFormFields}
            required
          />
          <FormInputRow
            title="Password"
            keyName={"password"}
            validators={validators}
            formFields={formFields}
            setValidators={handleSetValidators}
            setFormFields={handleSetFormFields}
            required
          />
          <FormInputRow
            title="Confirm Password"
            keyName={"confirmPassword"}
            validators={validators}
            formFields={formFields}
            setValidators={handleSetValidators}
            setFormFields={handleSetFormFields}
            required
          />
        </div>
        <SubmitButton
          disabled={
            !formFields.username ||
            !formFields.password ||
            formFields.password !== formFields.confirmPassword
          }
          handleSubmit={() => setWorkflow(SubmissionWorkflow.submitting)}
        />
        <div className="already-have-an-account-subtext">
          <span>
            {"Already have an account? "}
            <a onClick={() => navigate("/login")}>Log In!</a>{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
