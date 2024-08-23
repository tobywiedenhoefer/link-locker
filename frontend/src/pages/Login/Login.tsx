import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import FormInputRow from "../../components/FormInputRow/FormInputRow";
import SubmitButton from "../../components/SubmitButton/SubmitButton";

import {
  LoginFormFields as FormFields,
  LoginValidators as Validators,
} from "../../types/formTypes.type";

import {
  DEFAULT_LOGIN_FORM_FIELDS as DEFAULT_FORM_FIELDS,
  DEFAULT_LOGIN_VALIDATORS as DEFAULT_VALIDATORS,
} from "../../constants/defaults";
import SubmissionWorkflow from "../../constants/submissionWorkflows";

import { useAuth } from "../../contexts/AuthContext";
import { authenticateLogin } from "../../store/data.store";

import "./Login.css";
import "../../shared/form.css";

type LoginProps = {};
export default function Login(_: LoginProps) {
  const { updateToken } = useAuth();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormFields>(DEFAULT_FORM_FIELDS);
  const [validators, setValidators] = useState<Validators>(DEFAULT_VALIDATORS);
  const [workflow, setWorkflow] = useState<SubmissionWorkflow>(
    SubmissionWorkflow.default
  );
  const [auth, setAuth] = useState<string>("");
  useEffect(() => {
    (async () => {
      switch (workflow) {
        case SubmissionWorkflow.submitting: {
          const resp = await authenticateLogin(
            formFields.username,
            formFields.password
          );
          if (resp.success && resp.payload) {
            setAuth(resp.payload);
            setWorkflow(SubmissionWorkflow.success);
          } else {
            setWorkflow(SubmissionWorkflow.failure);
          }
          break;
        }
        case SubmissionWorkflow.success: {
          updateToken(auth);
          setWorkflow(SubmissionWorkflow.default);
          break;
        }
        case SubmissionWorkflow.failure: {
          toast.error(
            "Could not login! Please check your credentials and try again.",
            {
              position: "bottom-right",
              draggable: true,
            }
          );
          setWorkflow(SubmissionWorkflow.default);
          break;
        }
      }
    })();
  }, [workflow, auth]);

  const handleSetFormFields = (k: keyof FormFields, v: string) => {
    setFormFields({
      ...formFields,
      [k]: v,
    });
  };
  const handleSetValidators = (k: keyof Validators, v: string) => {
    const minLength = k === "password" ? 7 : 0;
    setValidators({
      ...validators,
      [k]: { touched: true, valid: v.length > minLength },
    });
  };
  return (
    <div className="login-form-container">
      <div className="login-form">
        <h2 className="form-name">Log In</h2>
        <div className="form-fields">
          <FormInputRow
            title={"Username"}
            keyName={"username"}
            validators={validators}
            formFields={formFields}
            setValidators={handleSetValidators}
            setFormFields={handleSetFormFields}
          />
          <FormInputRow
            title={"Password"}
            keyName={"password"}
            validators={validators}
            formFields={formFields}
            setValidators={handleSetValidators}
            setFormFields={handleSetFormFields}
            isPassword
          />
        </div>
        <SubmitButton
          disabled={
            formFields.username.length < 2 || formFields.password.length < 8
          }
          handleSubmit={() => {
            setWorkflow(SubmissionWorkflow.submitting);
          }}
        />
        <div className="no-account-text">
          <span>
            Don't have a login?{" "}
            <a onClick={() => navigate("/create-an-account")}>
              Create an account!
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
