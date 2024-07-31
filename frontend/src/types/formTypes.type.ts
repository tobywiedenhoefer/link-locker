type InputStateValidation = {
  touched: boolean;
  valid: boolean;
};

export interface BaseValidators {
  [k: string]: InputStateValidation;
}

export interface BaseFormFields {
  [k: string]: string | boolean | string[];
}

export interface AddNewLinkFormFields extends BaseFormFields {
  name: string;
  url: string;
  tag: string;
  tags: string[];
}

export interface AddNewLinkValidators extends BaseValidators {
  name: InputStateValidation;
  url: InputStateValidation;
}

export interface CombinationFormFields extends BaseFormFields {
  combination: string;
}

export interface CombinationValidators extends BaseValidators {
  combination: InputStateValidation;
}

export interface AddLockerFormFields extends BaseFormFields {
  name: string;
  locked: boolean;
  combination: string;
}

export interface AddLockerValidators extends BaseValidators {
  name: InputStateValidation;
  combination: InputStateValidation;
}

export interface LoginFormFields extends BaseFormFields {
  username: string;
  password: string;
}

export interface LoginValidators extends BaseValidators {
  username: InputStateValidation;
  password: InputStateValidation;
}

export interface CreateAnAccountFormFields extends BaseFormFields {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CreateAnAccountValidators extends BaseValidators {
  username: InputStateValidation;
  password: InputStateValidation;
  confirmPassword: InputStateValidation;
}
