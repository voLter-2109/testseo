import * as yup from 'yup';

import {
  INCORRECT_PHONE_NUMBER,
  REQUIRED_TEXT,
} from '../../constant/infoTooltipMessages';

/**
 * @description валидация страницы ввода номера мобильного телефона
 */
const phonePageSchema = yup.object().shape({
  phone_number: yup
    .string()
    .required(REQUIRED_TEXT)
    .matches(/\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}/, INCORRECT_PHONE_NUMBER),
  is_conf_policy_accepted: yup
    .bool()
    .test('isCheked', REQUIRED_TEXT, (value) => {
      if (value === false) {
        return false;
      }
      return true;
    }),
});
export default phonePageSchema;
