import { Badge, Breadcrumbs, Divider, Table } from 'react-daisyui';
import { CgMathPercent } from 'react-icons/cg';
import { useNavigate, useParams } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import { DISCOUNT_TYPE, PROMOTION_STATUS } from '../../../constants';
import { useGetMerchantPromotionDetailsQuery } from '../../../store/services/myShopService';
import { Merchant } from '../../../types/component';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toRupiah, toStringDate, toStringTime } from '../../../utils/convert';
import { stringCompare } from '../../../utils/validation';
import { Image } from '../../common';

type PromotionDetailContentProps = {
  profile: Merchant;
};

const PromotionDetailContent = ({ profile }: PromotionDetailContentProps) => {
  const navigate = useNavigate();
  const params = useParams();

  const {
    data: getMerchantPromotionDetailsData,
    isLoading: getMerchantPromotionDetailsIsLoading,
  } = useGetMerchantPromotionDetailsQuery(Number(params.promotionID));

  const handleGoBack = () => {
    navigate('/seller/marketing/promotions/list');
  };

  const getBadgeColor = (promotionStatus: string) => {
    if (stringCompare(promotionStatus, PROMOTION_STATUS.UPCOMING)) {
      return undefined;
    } else if (stringCompare(promotionStatus, PROMOTION_STATUS.ONGOING)) {
      return 'warning';
    }
    return 'success';
  };

  if (
    !getMerchantPromotionDetailsIsLoading &&
    getMerchantPromotionDetailsData?.data?.merchant_id !== profile.id
  ) {
    navigate('/seller/marketing/promotions/list', { replace: true });
  }

  if (!getMerchantPromotionDetailsData?.data) {
    return null;
  }

  return (
    <div className='p-4 md:p-10'>
      <Breadcrumbs className='mb-4'>
        <Breadcrumbs.Item
          className='text-primary cursor-pointer'
          onClick={handleGoBack}
        >
          Promotion List
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Promotion Detail</Breadcrumbs.Item>
      </Breadcrumbs>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Promotion Detail</h5>
      </div>
      <Divider />
      <div className='flex gap-4 mb-4'>
        <CgMathPercent className='text-white bg-secondary h-12 w-12 md:h-32 md:w-32 rounded-md' />
        <div className='flex flex-col gap-1 justify-center'>
          <span className='font-bold text-xl'>
            {getMerchantPromotionDetailsData.data.name}
          </span>
          <div className='flex items-center gap-3 text-sm md:mb-2'>
            <div className='flex flex-col'>
              <span className='font-bold'>
                {toStringDate(
                  getMerchantPromotionDetailsData.data.start_datetime
                )}
              </span>
              <span className='text-sm opacity-50'>
                {toStringTime(
                  getMerchantPromotionDetailsData.data.start_datetime
                )}
              </span>
            </div>
            <div className='w-2 border-t border-black opacity-50'></div>
            <div className='flex flex-col'>
              <span className='font-bold'>
                {toStringDate(
                  getMerchantPromotionDetailsData.data.end_datetime
                )}
              </span>
              <span className='text-sm opacity-50'>
                {toStringTime(
                  getMerchantPromotionDetailsData.data.end_datetime
                )}
              </span>
            </div>
          </div>
          <Badge
            size='sm'
            className='font-bold p-2'
            color={getBadgeColor(
              getMerchantPromotionDetailsData.data.promotion_status
            )}
          >
            {capitalizeFirstLetter(
              getMerchantPromotionDetailsData.data.promotion_status
            )}
          </Badge>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <Table className='w-[100%]'>
          <Table.Head>
            <span className='w-96'>Product</span>
            <span>Discount</span>
            <span>Quota</span>
          </Table.Head>
          <Table.Body>
            {getMerchantPromotionDetailsData.data.product_merchant_promotion.map(
              ({
                product_id,
                product_name,
                product_image,
                price_min,
                price_max,
                discount,
                discount_type,
                maximum_discount_amount,
                maximum_quota,
                current_quota,
              }) => {
                return (
                  <Table.Row key={product_id}>
                    <div className='flex flex-row items-center md:gap-2'>
                      <Zoom>
                        <Image
                          className='w-16 rounded-lg hidden md:block'
                          src={product_image}
                          alt={product_name}
                        />
                      </Zoom>
                      <div className='flex flex-col'>
                        <span className='font-bold w-48 md:w-96 truncate'>
                          {product_name}
                        </span>
                        <span className='font-bold text-sm text-secondary w-48 md:w-96 truncate'>
                          {price_min === price_max
                            ? toRupiah(price_max)
                            : `${toRupiah(price_min)} - ${toRupiah(price_max)}`}
                        </span>
                      </div>
                    </div>
                    <div className='text-sm'>
                      {stringCompare(discount_type, DISCOUNT_TYPE.NOMINAL) ? (
                        <p>
                          Discount{' '}
                          <span className='font-bold'>{toRupiah(10000)}</span>
                        </p>
                      ) : (
                        <p>
                          Discount{' '}
                          <span className='font-bold'>
                            {discount}% till {toRupiah(maximum_discount_amount)}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className='text-sm'>
                      Quota Used:{' '}
                      <span className='font-bold'>
                        {current_quota}/
                        {maximum_quota >= 0 ? maximum_quota : '∞'}
                      </span>
                    </div>
                  </Table.Row>
                );
              }
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default PromotionDetailContent;
