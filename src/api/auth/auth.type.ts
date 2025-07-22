export type TypeGetConfirmationCode = {
  phone_number: string;
};

export type TypeFormRegistrationPage = TypeGetConfirmationCode & {
  is_conf_policy_accepted: boolean;
};

export type TypeGetAuthToken = {
  phone_number: string;
  code: string;
};

export type TypeResponseAuthToken = {
  refresh: string;
  access: string;
};
