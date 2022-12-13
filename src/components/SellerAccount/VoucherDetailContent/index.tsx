import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumbs,
  Card,
  Countdown,
  Divider,
  Progress,
} from 'react-daisyui';
import { CgMathPercent } from 'react-icons/cg';
import { HiOutlineCurrencyDollar, HiOutlineClock } from 'react-icons/hi';
import { DISCOUNT_TYPE, VOUCHER_STATUS } from '../../../constants';
import { Merchant } from '../../../types/component';
import { useGetMerchantVoucherDetailsQuery } from '../../../store/services/shopService';
import { stringCompare } from '../../../utils/validation';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toRupiah, toStringDate, toStringTime } from '../../../utils/convert';
import { computeDatetime, getDateDiffNow } from '../../../utils/date';
import DateCountdown from '../../common/DateCountdown';
import moment from 'moment';

type ContentProps = {
  profile: Merchant;
};

const VoucherDetailContent = ({ profile }: ContentProps) => {
  const navigate = useNavigate();
  const params = useParams();

  const {
    data: getMerchantVoucherDetailsData,
    isLoading: getMerchantVoucherDetailsIsLoading,
  } = useGetMerchantVoucherDetailsQuery(params.voucherID || '');

  if (
    !getMerchantVoucherDetailsIsLoading &&
    getMerchantVoucherDetailsData?.data.merchant_id !== profile.id
  ) {
    navigate('/seller/marketing/vouchers/list', { replace: true });
  }

  const getBadgeColor = (voucherStatus: string) => {
    if (stringCompare(voucherStatus, VOUCHER_STATUS.UPCOMING)) {
      return undefined;
    } else if (stringCompare(voucherStatus, VOUCHER_STATUS.ONGOING)) {
      return 'warning';
    }
    return 'success';
  };

  const handleGoBack = () => {
    navigate('/seller/marketing/vouchers/list', { replace: true });
  };

  return (
    <div className='p-4 md:p-10'>
      <Breadcrumbs className='mb-4'>
        <Breadcrumbs.Item
          className='text-primary cursor-pointer'
          onClick={handleGoBack}
        >
          Voucher List
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Voucher Detail</Breadcrumbs.Item>
      </Breadcrumbs>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Voucher Detail</h5>
      </div>
      <Divider />
      <div className='grid grid-cols-12 gap-4'>
        {getMerchantVoucherDetailsIsLoading && (
          <Card className='col-span-12 shadow animate-pulse'>
            <div className='p-4'>
              <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
              <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
              <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
              <Divider />
              <div className='h-4 bg-base-200 w-1/5 rounded-full'></div>
            </div>
          </Card>
        )}
        {getMerchantVoucherDetailsData?.data && (
          <div className='flex flex-col col-span-12 gap-4'>
            <div className='flex gap-4'>
              {stringCompare(
                getMerchantVoucherDetailsData?.data.discount_type,
                DISCOUNT_TYPE.NOMINAL
              ) ? (
                <HiOutlineCurrencyDollar className='text-white bg-accent h-12 w-12 md:h-32 md:w-32 rounded-md' />
              ) : (
                <CgMathPercent className='text-white bg-secondary h-12 w-12 md:h-32 md:w-32 rounded-md' />
              )}
              <div className='flex flex-col gap-1 justify-center'>
                <span className='font-bold text-xl'>
                  {getMerchantVoucherDetailsData?.data.code}
                </span>
                <div className='flex items-center gap-3 text-sm'>
                  <div className='flex flex-col'>
                    <span className='font-bold'>
                      {toStringDate(
                        getMerchantVoucherDetailsData?.data.start_datetime
                      )}
                    </span>
                    <span className='text-sm opacity-50'>
                      {toStringTime(
                        getMerchantVoucherDetailsData?.data.start_datetime
                      )}
                    </span>
                  </div>
                  <div className='w-2 border-t border-black opacity-50'></div>
                  <div className='flex flex-col'>
                    <span className='font-bold'>
                      {toStringDate(
                        getMerchantVoucherDetailsData?.data.end_datetime
                      )}
                    </span>
                    <span className='text-sm opacity-50'>
                      {toStringTime(
                        getMerchantVoucherDetailsData?.data.end_datetime
                      )}
                    </span>
                  </div>
                  <Badge
                    size='sm'
                    className='font-bold p-2'
                    color={getBadgeColor(
                      getMerchantVoucherDetailsData?.data.voucher_status
                    )}
                  >
                    {capitalizeFirstLetter(
                      getMerchantVoucherDetailsData?.data.voucher_status
                    )}
                  </Badge>
                  {stringCompare(
                    getMerchantVoucherDetailsData?.data.voucher_status,
                    VOUCHER_STATUS.ONGOING
                  ) ? (
                    <Badge color='warning' className='flex gap-1 bg-opacity-50'>
                      <HiOutlineClock />
                      {computeDatetime(
                        getDateDiffNow(
                          getMerchantVoucherDetailsData?.data.end_datetime
                        )
                      ).days > 0 ? (
                        <div className='font-bold'>
                          <Countdown
                            value={
                              computeDatetime(
                                getDateDiffNow(
                                  getMerchantVoucherDetailsData?.data
                                    .end_datetime
                                )
                              ).days
                            }
                          ></Countdown>{' '}
                          days
                        </div>
                      ) : (
                        // <div className='font-bold'>
                        //   <Countdown
                        //     value={
                        //       computeDatetime(
                        //         getDateDiffNow(
                        //           getMerchantVoucherDetailsData?.data
                        //             .end_datetime
                        //         )
                        //       ).hours
                        //     }
                        //   ></Countdown>
                        //   {':'}
                        //   <Countdown
                        //     value={
                        //       computeDatetime(
                        //         getDateDiffNow(
                        //           getMerchantVoucherDetailsData?.data
                        //             .end_datetime
                        //         )
                        //       ).minutes
                        //     }
                        //   ></Countdown>
                        //   {':'}
                        //   <Countdown
                        //     value={
                        //       computeDatetime(
                        //         getDateDiffNow(
                        //           getMerchantVoucherDetailsData?.data
                        //             .end_datetime
                        //         )
                        //       ).seconds
                        //     }
                        //   ></Countdown>
                        // </div>
                        <DateCountdown
                          date={moment(
                            getMerchantVoucherDetailsData?.data.end_datetime
                          ).toDate()}
                        ></DateCountdown>
                      )}
                    </Badge>
                  ) : null}
                </div>
                <div className='flex flex-col text-sm'>
                  <span>Quota:</span>
                  {stringCompare(
                    getMerchantVoucherDetailsData?.data.voucher_status,
                    VOUCHER_STATUS.UPCOMING
                  ) ? (
                    <span className='font-bold'>
                      {getMerchantVoucherDetailsData?.data.maximum_quota}
                    </span>
                  ) : null}

                  {stringCompare(
                    getMerchantVoucherDetailsData?.data.voucher_status,
                    VOUCHER_STATUS.ONGOING
                  ) ? (
                    <div className='flex gap-2 items-center'>
                      <Progress
                        className='progress progress-primary w-32'
                        value={
                          getMerchantVoucherDetailsData?.data.current_quota
                        }
                        max={getMerchantVoucherDetailsData?.data.maximum_quota}
                      ></Progress>
                      <div>
                        <span className='font-bold'>
                          {getMerchantVoucherDetailsData?.data.current_quota}/
                          {getMerchantVoucherDetailsData?.data.maximum_quota}{' '}
                        </span>
                        <span>used</span>
                      </div>
                    </div>
                  ) : null}

                  {stringCompare(
                    getMerchantVoucherDetailsData?.data.voucher_status,
                    VOUCHER_STATUS.ENDED
                  ) ? (
                    <span className='font-bold'>
                      {getMerchantVoucherDetailsData?.data.current_quota}/
                      {getMerchantVoucherDetailsData?.data.maximum_quota}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <Divider className='m-0' />
            {stringCompare(
              getMerchantVoucherDetailsData?.data.discount_type,
              DISCOUNT_TYPE.NOMINAL
            ) ? (
              <div className='grid grid-cols-2 gap-5'>
                <div className='flex flex-col gap-1 col-span-1'>
                  <span className='uppercase font-light text-sm'>
                    Discount Type
                  </span>
                  <span className='capitalize'>
                    {getMerchantVoucherDetailsData?.data.discount_type}
                  </span>
                </div>
                <div className='flex flex-col gap-1 col-span-1'>
                  <span className='uppercase font-light text-sm'>
                    Discount Nominal
                  </span>
                  <span>
                    {toRupiah(getMerchantVoucherDetailsData?.data.discount)}
                  </span>
                </div>
                <div className='flex flex-col gap-1 col-span-1'>
                  <span className='uppercase font-light text-sm'>
                    Minimum Purchase
                  </span>
                  <span>
                    {toRupiah(
                      getMerchantVoucherDetailsData?.data.minimum_spend_amount
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-5'>
                <div className='flex flex-col gap-1 col-span-1'>
                  <span className='uppercase font-light text-sm'>
                    Discount Type
                  </span>
                  <span className='capitalize'>
                    {getMerchantVoucherDetailsData?.data.discount_type}
                  </span>
                </div>
                <div className='flex flex-col gap-1 col-span-1'>
                  <span className='uppercase font-light text-sm'>
                    Discount Percentage
                  </span>
                  <span>{getMerchantVoucherDetailsData?.data.discount}%</span>
                </div>
                <div className='flex flex-col gap-1 col-span-1'>
                  <span className='uppercase font-light text-sm'>
                    Maximum Discount
                  </span>
                  <span>
                    {toRupiah(
                      getMerchantVoucherDetailsData?.data
                        .maximum_discount_amount
                    )}
                  </span>
                </div>
                <div className='flex flex-col gap-1 col-span-1'>
                  <span className='uppercase font-light text-sm'>
                    Minimum Purchase
                  </span>
                  <span>
                    {toRupiah(
                      getMerchantVoucherDetailsData?.data.minimum_spend_amount
                    )}
                  </span>
                </div>
              </div>
            )}
            <div className='bg-accent bg-opacity-30 p-3 rounded flex justify-between items-center'>
              <div className='flex flex-col'>
                <span className='text-sm font-bold'>
                  Estimated Maximum Expenditure
                </span>
                <span className='text-sm'>
                  Deducted from completed transactions
                </span>
              </div>
              <span className='font-bold'>
                {getMerchantVoucherDetailsData.data.discount_type ===
                DISCOUNT_TYPE.NOMINAL
                  ? toRupiah(
                      getMerchantVoucherDetailsData?.data.discount *
                        getMerchantVoucherDetailsData?.data.maximum_quota
                    )
                  : toRupiah(
                      getMerchantVoucherDetailsData?.data
                        .maximum_discount_amount *
                        getMerchantVoucherDetailsData?.data.maximum_quota
                    )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherDetailContent;
