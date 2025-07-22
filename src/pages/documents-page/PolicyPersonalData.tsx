import {
  POLICY_PERSONAL_DATA,
  POLICY_PERSONAL_DATA_TITLE,
} from '../../constant/documents';

const PolicyPersonalData = () => {
  return (
    <article>
      <h3>{POLICY_PERSONAL_DATA_TITLE}</h3>
      {POLICY_PERSONAL_DATA}
    </article>
  );
};

export default PolicyPersonalData;
