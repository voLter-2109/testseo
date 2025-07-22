import { USER_AGREEMENT, USER_AGREEMENT_TITLE } from '../../constant/documents';

const UserAgreement = () => {
  return (
    <article>
      <h3>{USER_AGREEMENT_TITLE}</h3>
      {USER_AGREEMENT}
    </article>
  );
};

export default UserAgreement;
