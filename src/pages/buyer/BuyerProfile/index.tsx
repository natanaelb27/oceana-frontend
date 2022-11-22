import { UserAccount } from '../../../components';
import { useGetProfileQuery } from '../../../store/services/profileService';

const BuyerProfile = () => {
  const { data } = useGetProfileQuery();

  if (!data?.data) {
    return null;
  }

  return <UserAccount profile={data.data} />;
};

export default BuyerProfile;
