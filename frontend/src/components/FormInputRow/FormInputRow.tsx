import React from "react";

import { BaseFormFields, BaseValidators } from "../../types/formTypes.type";

import "./FormInputRow.css";

type FormInputRowProps<T, U> = {
  title: string;
  keyName: keyof T & keyof U & string;
  validators: U & BaseValidators;
  formFields: T & BaseFormFields;
  setValidators: (k: keyof U, v: string) => void;
  setFormFields: (k: keyof T, v: string) => void;
  handleInputOnBlur?: (k: keyof T & keyof U, v: string) => void;
  required?: boolean;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit?: () => void;
  isPassword?: boolean;
};
export default function FormInputRow<T, U>(props: FormInputRowProps<T, U>) {
  const handleInputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    k: keyof T & keyof U
  ) => {
    props.setFormFields(k, e.target.value);
    props.setValidators(k, e.target.value);
  };
  const handleInputOnBlur = (k: keyof T & keyof U, v: string) => {
    if (props.handleInputOnBlur) {
      props.handleInputOnBlur(k, v);
    } else {
      props.setValidators(k, v);
    }
  };
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && typeof props.handleSubmit !== "undefined") {
      e.preventDefault();
      props.handleSubmit();
    }
  };
  const getStyle = (type: "border" | "label") => {
    const errorColor = "#ff7575";
    const baseHexColor = "#6a6a6a";
    const baseRGBA = "rgba(0,0,0,0.2)";
    const isError =
      !props.validators[props.keyName].valid &&
      props.validators[props.keyName].touched;
    switch (type) {
      case "border": {
        return {
          boxShadow: `0 1px 5px ${isError ? errorColor : baseRGBA}`,
        };
      }
      case "label": {
        return {
          color: isError ? errorColor : baseHexColor,
        };
      }
    }
  };
  return (
    <div className="form-row">
      <p className="row-title">{props.title}</p>
      <div className="form-input">
        <input
          name={props.keyName}
          value={`${props.formFields[props.keyName]}`}
          onChange={(e) => handleInputOnChange(e, props.keyName)}
          onBlur={(e) => handleInputOnBlur(props.keyName, e.target.value)}
          style={!!props.required ? getStyle("border") : {}}
          onKeyUp={!!props.onKeyUp ? props.onKeyUp : undefined}
          onKeyDown={handleOnKeyDown}
          type={props.isPassword ? "password" : "text"}
        />
        {!!props.required ? (
          <label
            htmlFor={props.keyName}
            style={!!props.required ? getStyle("label") : {}}
          >
            required
          </label>
        ) : null}
      </div>
    </div>
  );
}
