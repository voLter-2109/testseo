import {
  PERSONAL_DATA_AGREEMENT,
  PERSONAL_DATA_AGREEMENT_TITLE,
} from '../../constant/documents';

const PersonalDataAgreement = () => {
  return (
    <article>
      <h3>{PERSONAL_DATA_AGREEMENT_TITLE}</h3>
      {PERSONAL_DATA_AGREEMENT}
    </article>
  );
};

export default PersonalDataAgreement;
