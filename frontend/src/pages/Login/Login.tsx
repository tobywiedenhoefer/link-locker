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
import { default as swf } from "../../constants/submissionWorkflows";

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
  const [workflow, setWorkflow] = useState<swf>(swf.default);
  const [auth, setAuth] = useState<string>("");
  useEffect(() => {
    (async () => {
      switch (workflow) {
        case swf.submitting: {
          const resp = await authenticateLogin(
            formFields.username,
            formFields.password
          );
          if (resp.success && resp.payload) {
            setAuth(resp.payload);
            setWorkflow(swf.success);
          } else {
            setWorkflow(swf.failure);
          }
          break;
        }
        case swf.success: {
          updateToken(auth);
          setWorkflow(swf.default);
          break;
        }
        case swf.failure: {
          toast.error(
            "Could not login! Please check your credentials and try again.",
            {
              position: "bottom-right",
              draggable: true,
            }
          );
          setWorkflow(swf.default);
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
  const handleSubmit = () => setWorkflow(swf.submitting);
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
            handleSubmit={handleSubmit}
          />
          <FormInputRow
            title={"Password"}
            keyName={"password"}
            validators={validators}
            formFields={formFields}
            setValidators={handleSetValidators}
            setFormFields={handleSetFormFields}
            handleSubmit={handleSubmit}
            isPassword
          />
        </div>
        <SubmitButton
          disabled={
            formFields.username.length < 2 ||
            formFields.password.length < 8 ||
            workflow === swf.submitting
          }
          handleSubmit={handleSubmit}
          isLoading={workflow === swf.submitting}
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
