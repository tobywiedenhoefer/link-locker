import {
  CombinationFormFields,
  CombinationValidators,
  AddLockerFormFields,
  AddLockerValidators,
  AddNewLinkFormFields,
  AddNewLinkValidators,
  LoginFormFields,
  LoginValidators,
  CreateAnAccountFormFields,
  CreateAnAccountValidators,
} from "../types/formTypes.type";

export const DEFAULT_COMBINATION_FORM_FIELDS: CombinationFormFields = {
  combination: "",
};

export const DEFAULT_COMBINATION_VALIDATORS: CombinationValidators = {
  combination: { touched: false, valid: true },
};

export const DEFAULT_ADD_LOCKER_FORM_FIELDS: AddLockerFormFields = {
  name: "",
  locked: false,
  combination: "",
};

export const DEFAULT_ADD_LOCKER_VALIDATORS: AddLockerValidators = {
  name: { touched: false, valid: false },
  combination: { touched: false, valid: false },
};

export const DEFAULT_ADD_NEW_LINK_FORM_FIELDS: AddNewLinkFormFields = {
  name: "",
  url: "",
  tag: "",
  tags: [],
};

export const DEFAULT_ADD_NEW_LINK_VALIDATORS: AddNewLinkValidators = {
  name: { touched: false, valid: false },
  url: { touched: false, valid: false },
};

export const DEFAULT_LOGIN_FORM_FIELDS: LoginFormFields = {
  username: "",
  password: "",
};

export const DEFAULT_LOGIN_VALIDATORS: LoginValidators = {
  username: { touched: false, valid: false },
  password: { touched: false, valid: false },
};

export const DEFAULT_CREATE_AN_ACCOUNT_FORM_FIELDS: CreateAnAccountFormFields =
  {
    username: "",
    password: "",
    confirmPassword: "",
  };

export const DEFAULT_CREATE_AN_ACCOUNT_VALIDATORS: CreateAnAccountValidators = {
  username: { touched: false, valid: false },
  password: { touched: false, valid: false },
  confirmPassword: { touched: false, valid: false },
};
