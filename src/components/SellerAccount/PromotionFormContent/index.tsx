import { Breadcrumbs, Divider } from 'react-daisyui';
import { useNavigate, useParams } from 'react-router-dom';
import { Merchant } from '../../../types/component';
import { SellerAccountPromotionFormContent } from '../../../types/content';

type PromotionFormContentProps = {
  profile: Merchant;
  content: SellerAccountPromotionFormContent;
};

const PromotionFormContent = ({
  profile,
  content,
}: PromotionFormContentProps) => {
  const navigate = useNavigate();
  const params = useParams();

  const handleGoBack = () => {
    navigate('/seller/marketing/promotions/list');
  };

  const title =
    content === SellerAccountPromotionFormContent.Add
      ? 'Add Promotion'
      : 'Edit Promotion';

  return (
    <div className='p-4 md:p-10'>
      <Breadcrumbs className='mb-4'>
        <Breadcrumbs.Item
          className='text-primary cursor-pointer'
          onClick={handleGoBack}
        >
          Promotion List
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{title}</Breadcrumbs.Item>
      </Breadcrumbs>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>{title}</h5>
      </div>
      <Divider />
    </div>
  );
};

export default PromotionFormContent;
