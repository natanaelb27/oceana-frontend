import { UserAccount } from '../../../components';
import { useGetProfileQuery } from '../../../store/services/profileService';
import { UserAccountContent } from '../../../types/content';

const BuyerSealabsPay = () => {
  const { data } = useGetProfileQuery();

  if (!data?.data) {
    return null;
  }

  return (
    <UserAccount profile={data.data} content={UserAccountContent.SealabsPay} />
  );
};

export default BuyerSealabsPay;
