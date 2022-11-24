import { toast } from 'react-toastify';
import { UserAccount } from '../../../components';
import { useGetProfileQuery } from '../../../store/services/profileService';
import { UserAccountContent } from '../../../types/content';
import { GetProfileResponse } from '../../../types/response';
import { notifyErrorToast } from '../../../utils/toast';

const BuyerProfile = () => {
  const { data, error } = useGetProfileQuery();

  if (error && 'data' in error) {
    const response = error.data as GetProfileResponse;

    notifyErrorToast(response.message);
  }

  return (
    <UserAccount profile={data?.data} content={UserAccountContent.Profile} />
  );
};

export default BuyerProfile;
