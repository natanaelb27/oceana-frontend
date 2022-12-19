import {
  Badge,
  Breadcrumbs,
  Card,
  Countdown,
  Divider,
  Progress,
} from 'react-daisyui';
import { CgMathPercent } from 'react-icons/cg';
import { HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { DISCOUNT_TYPE, VOUCHER_STATUS } from '../../../constants';
import { useGetMarketplaceVoucherDetailsQuery } from '../../../store/services/marketplaceService';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toRupiah, toStringDate, toStringTime } from '../../../utils/convert';
import { computeDatetime, getDateDiffNow } from '../../../utils/date';
import { stringCompare } from '../../../utils/validation';

const AdminDetailVoucher = () => {
  const navigate = useNavigate();
  const params = useParams();

  const {
    data: getMarketplaceVoucherDetailsData,
    isLoading: getMarketplaceVoucherDetailsIsLoading,
    error: getMarketplaceVoucherDetailsError,
  } = useGetMarketplaceVoucherDetailsQuery(Number(params.voucherID));

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

  if (getMarketplaceVoucherDetailsError) {
    navigate('/seller/marketing/vouchers/list', { replace: true });
  }

  return (
    <div className='container mx-auto'>
      <div className='p-4 md:p-10'>
        <Card>
          <Card.Body>
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
              <h5 className='font-bold text-2xl text-primary'>
                Voucher Detail
              </h5>
            </div>
            <Divider />
            <div className='grid grid-cols-12 gap-4'>
              {getMarketplaceVoucherDetailsIsLoading && (
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
              {getMarketplaceVoucherDetailsData?.data && (
                <div className='flex flex-col col-span-12 gap-4'>
                  <div className='flex gap-4'>
                    {stringCompare(
                      getMarketplaceVoucherDetailsData?.data.discount_type,
                      DISCOUNT_TYPE.NOMINAL
                    ) ? (
                      <HiOutlineCurrencyDollar className='text-white bg-accent h-12 w-12 md:h-32 md:w-32 rounded-md' />
                    ) : (
                      <CgMathPercent className='text-white bg-secondary h-12 w-12 md:h-32 md:w-32 rounded-md' />
                    )}
                    <div className='flex flex-col gap-1 justify-center'>
                      <span className='font-bold text-xl'>
                        {getMarketplaceVoucherDetailsData?.data.name}
                      </span>
                      <div className='flex items-center gap-3 text-sm'>
                        <div className='flex flex-col'>
                          <span className='font-bold'>
                            {toStringDate(
                              getMarketplaceVoucherDetailsData?.data
                                .start_datetime
                            )}
                          </span>
                          <span className='text-sm opacity-50'>
                            {toStringTime(
                              getMarketplaceVoucherDetailsData?.data
                                .start_datetime
                            )}
                          </span>
                        </div>
                        <div className='w-2 border-t border-black opacity-50'></div>
                        <div className='flex flex-col'>
                          <span className='font-bold'>
                            {toStringDate(
                              getMarketplaceVoucherDetailsData?.data
                                .end_datetime
                            )}
                          </span>
                          <span className='text-sm opacity-50'>
                            {toStringTime(
                              getMarketplaceVoucherDetailsData?.data
                                .end_datetime
                            )}
                          </span>
                        </div>
                        <Badge
                          size='sm'
                          className='font-bold p-2'
                          color={getBadgeColor(
                            getMarketplaceVoucherDetailsData?.data
                              .voucher_status
                          )}
                        >
                          {capitalizeFirstLetter(
                            getMarketplaceVoucherDetailsData?.data
                              .voucher_status
                          )}
                        </Badge>
                        {stringCompare(
                          getMarketplaceVoucherDetailsData?.data.voucher_status,
                          VOUCHER_STATUS.ONGOING
                        ) ? (
                          <Badge
                            color='warning'
                            className='flex gap-1 bg-opacity-50'
                          >
                            <HiOutlineClock />
                            {computeDatetime(
                              getDateDiffNow(
                                getMarketplaceVoucherDetailsData?.data
                                  .end_datetime
                              )
                            ).days > 0 ? (
                              <div className='font-bold'>
                                <Countdown
                                  value={
                                    computeDatetime(
                                      getDateDiffNow(
                                        getMarketplaceVoucherDetailsData?.data
                                          .end_datetime
                                      )
                                    ).days
                                  }
                                ></Countdown>{' '}
                                days
                              </div>
                            ) : (
                              <div className='font-bold'>
                                <Countdown
                                  value={
                                    computeDatetime(
                                      getDateDiffNow(
                                        getMarketplaceVoucherDetailsData?.data
                                          .end_datetime
                                      )
                                    ).hours
                                  }
                                ></Countdown>
                                {':'}
                                <Countdown
                                  value={
                                    computeDatetime(
                                      getDateDiffNow(
                                        getMarketplaceVoucherDetailsData?.data
                                          .end_datetime
                                      )
                                    ).minutes
                                  }
                                ></Countdown>
                                {':'}
                                <Countdown
                                  value={
                                    computeDatetime(
                                      getDateDiffNow(
                                        getMarketplaceVoucherDetailsData?.data
                                          .end_datetime
                                      )
                                    ).seconds
                                  }
                                ></Countdown>
                              </div>
                            )}
                          </Badge>
                        ) : null}
                      </div>
                      <div className='flex flex-col text-sm'>
                        <span>Quota:</span>
                        {stringCompare(
                          getMarketplaceVoucherDetailsData?.data.voucher_status,
                          VOUCHER_STATUS.UPCOMING
                        ) ? (
                          <span className='font-bold'>
                            {
                              getMarketplaceVoucherDetailsData?.data
                                .maximum_quota
                            }
                          </span>
                        ) : null}

                        {stringCompare(
                          getMarketplaceVoucherDetailsData?.data.voucher_status,
                          VOUCHER_STATUS.ONGOING
                        ) ? (
                          <div className='flex gap-2 items-center'>
                            <Progress
                              className='progress progress-primary w-32'
                              value={
                                getMarketplaceVoucherDetailsData?.data
                                  .current_quota
                              }
                              max={
                                getMarketplaceVoucherDetailsData?.data
                                  .maximum_quota
                              }
                            ></Progress>
                            <div>
                              <span className='font-bold'>
                                {
                                  getMarketplaceVoucherDetailsData?.data
                                    .current_quota
                                }
                                /
                                {
                                  getMarketplaceVoucherDetailsData?.data
                                    .maximum_quota
                                }{' '}
                              </span>
                              <span>used</span>
                            </div>
                          </div>
                        ) : null}

                        {stringCompare(
                          getMarketplaceVoucherDetailsData?.data.voucher_status,
                          VOUCHER_STATUS.ENDED
                        ) ? (
                          <span className='font-bold'>
                            {
                              getMarketplaceVoucherDetailsData?.data
                                .current_quota
                            }
                            /
                            {
                              getMarketplaceVoucherDetailsData?.data
                                .maximum_quota
                            }
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <Divider className='m-0' />
                  {stringCompare(
                    getMarketplaceVoucherDetailsData?.data.discount_type,
                    DISCOUNT_TYPE.NOMINAL
                  ) ? (
                    <div className='grid grid-cols-2 gap-5'>
                      <div className='flex flex-col gap-1 col-span-1'>
                        <span className='uppercase font-light text-sm'>
                          Discount Type
                        </span>
                        <span className='capitalize'>
                          {getMarketplaceVoucherDetailsData?.data.discount_type}
                        </span>
                      </div>
                      <div className='flex flex-col gap-1 col-span-1'>
                        <span className='uppercase font-light text-sm'>
                          Discount Nominal
                        </span>
                        <span>
                          {toRupiah(
                            getMarketplaceVoucherDetailsData?.data.discount
                          )}
                        </span>
                      </div>
                      <div className='flex flex-col gap-1 col-span-1'>
                        <span className='uppercase font-light text-sm'>
                          Minimum Purchase
                        </span>
                        <span>
                          {toRupiah(
                            getMarketplaceVoucherDetailsData?.data
                              .minimum_spend_amount
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
                          {getMarketplaceVoucherDetailsData?.data.discount_type}
                        </span>
                      </div>
                      <div className='flex flex-col gap-1 col-span-1'>
                        <span className='uppercase font-light text-sm'>
                          Discount Percentage
                        </span>
                        <span>
                          {getMarketplaceVoucherDetailsData?.data.discount}%
                        </span>
                      </div>
                      <div className='flex flex-col gap-1 col-span-1'>
                        <span className='uppercase font-light text-sm'>
                          Maximum Discount
                        </span>
                        <span>
                          {toRupiah(
                            getMarketplaceVoucherDetailsData?.data
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
                            getMarketplaceVoucherDetailsData?.data
                              .minimum_spend_amount
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
                      {getMarketplaceVoucherDetailsData.data.discount_type ===
                      DISCOUNT_TYPE.NOMINAL
                        ? toRupiah(
                            getMarketplaceVoucherDetailsData?.data.discount *
                              getMarketplaceVoucherDetailsData?.data
                                .maximum_quota
                          )
                        : toRupiah(
                            getMarketplaceVoucherDetailsData?.data
                              .maximum_discount_amount *
                              getMarketplaceVoucherDetailsData?.data
                                .maximum_quota
                          )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminDetailVoucher;
