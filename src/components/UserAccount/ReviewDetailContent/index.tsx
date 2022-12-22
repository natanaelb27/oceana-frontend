import {
  ChangeEvent,
  createElement,
  forwardRef,
  FormEvent,
  ReactNode,
  Ref,
  useState,
  useRef,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputGroup,
  Rating,
  Tabs,
  Textarea,
} from 'react-daisyui';
import { useOutsideAlerter } from '../../../hooks';
import { Image, Pager } from '../../common';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineShoppingBag,
  HiSearch,
} from 'react-icons/hi';
import {
  LIMIT_TRANSACTION_HISTORY,
  DELIVERY_STATUS,
  REVIEW_STATUS,
} from '../../../constants';
import { TransactionHistoryQuery } from '../../../types/query';
import {
  useGetAllTransactionHistoryQuery,
  useGetOrderDetailsQuery,
} from '../../../store/services/orderService';
import { toTransactionHistoryQuery } from '../../../utils/mapperDTO';
import { toStringDate, toStringDatetime } from '../../../utils/convert';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import moment from 'moment';
import NoData from '../../common/NoData';
import { useNavigate, useParams } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import ReviewForm from './ReviewForm';

const ReviewDetailContent = () => {
  const [filterReviewStatus, setFilterReviewStatus] = useState<string>(
    REVIEW_STATUS.NOT_REVIEWED
  );
  const navigate = useNavigate();
  const params = useParams();

  const {
    data: getOrderDetailsData,
    isLoading: getOrderDetailsIsLoading,
    error: getOrderDetailsError,
  } = useGetOrderDetailsQuery(params.orderID || '');

  if (!getOrderDetailsIsLoading && getOrderDetailsError) {
    navigate('/user/review');
  }

  const handleNavigateShop = (merchantID: number) => {
    navigate(`/shops/${merchantID}`);
  };

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Review Details</h5>
      <Divider />
      {/* <div className='flex flex-col gap-3 mb-5'>
        <div>
          <Tabs
            variant='bordered'
            value={filterReviewStatus}
            onChange={handleFilterReviewStatusClick}
            className='mb-3 border-b-2'
          >
            <Tabs.Tab value={REVIEW_STATUS.NOT_REVIEWED}>
              Waiting for Review
            </Tabs.Tab>
            <Tabs.Tab value={REVIEW_STATUS.REVIEWED}>Review History</Tabs.Tab>
          </Tabs>
        </div>
      </div> */}
      <div className='grid grid-cols-12 gap-4'>
        {getOrderDetailsIsLoading && (
          <Card className='col-span-12 shadow animate-pulse'>
            <div className='p-4'>
              <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
              <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
              <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
            </div>
          </Card>
        )}
        {getOrderDetailsData?.data && (
          <div className='flex flex-col col-span-12 border-2'>
            <div className='flex flex-col md:flex-row justify-between bg-base-200 p-2'>
              <span className='text-sm'>
                Shop:{' '}
                <span
                  className='text-primary cursor-pointer'
                  onClick={() => {
                    handleNavigateShop(
                      getOrderDetailsData?.data?.merchant_id || 0
                    );
                  }}
                >
                  {getOrderDetailsData?.data?.shop_name}
                </span>
              </span>
              <span className='text-sm'>
                Transaction date:{' '}
                {toStringDatetime(
                  getOrderDetailsData?.data?.transaction_datetime
                )}
              </span>
            </div>
            <div>
              {getOrderDetailsData?.data?.order_details.map(
                (order_detail, n) => {
                  if (order_detail.product_review_id) {
                    return (
                      <div
                        key={n}
                        className={`p-3 flex gap-3 ${
                          n + 1 !=
                          getOrderDetailsData?.data?.order_details.length
                            ? 'border-b-4 border-base-200'
                            : ''
                        }`}
                      >
                        <img
                          src={order_detail.product_image || ''}
                          alt={order_detail.product_name || ''}
                          className='h-12 w-12 md:h-20 md:w-20 rounded-md'
                        />
                        <div className='flex flex-col gap-2'>
                          <div>
                            <span className='line-clamp-2 md:line-clamp-1'>
                              {order_detail.product_name}
                            </span>
                            <span className='text-xs font-light'>
                              {order_detail.product_variations}
                            </span>
                          </div>
                          <Rating value={order_detail.rating || 0} size='md'>
                            {[1, 2, 3, 4, 5].map((rating, i) => {
                              return (
                                <Rating.Item
                                  key={i}
                                  name='rating-1'
                                  value={rating}
                                  className='mask mask-star-2 bg-orange-400'
                                />
                              );
                            })}
                          </Rating>
                          {order_detail.review ? (
                            <span className='text-sm font-light'>
                              {order_detail.review}
                            </span>
                          ) : null}

                          {order_detail.review_images?.length ||
                          order_detail.review_videos?.length ||
                          0 > 0 ? (
                            <div className='flex gap-3'>
                              {order_detail.review_images?.map((img, n) => {
                                return (
                                  <Zoom key={n}>
                                    <Image
                                      src={img || ''}
                                      alt={n.toString() || ''}
                                      className='h-12 w-12 md:h-20 md:w-20 rounded-md'
                                    />
                                  </Zoom>
                                );
                              })}
                              {order_detail.review_videos?.map((video, n) => {
                                return (
                                  <video
                                    key={n}
                                    src={video || ''}
                                    controls
                                    className='h-12 w-12 md:h-20 md:w-40 rounded-md'
                                  />
                                );
                              })}
                            </div>
                          ) : null}
                          <span className='text-xs'>
                            {toStringDatetime(
                              order_detail.review_created_datetime || ''
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={n}
                        className={`p-3 ${
                          n + 1 !=
                          getOrderDetailsData?.data?.order_details.length
                            ? 'border-b-4 border-base-200'
                            : ''
                        }`}
                      >
                        <ReviewForm
                          order_detail_length={
                            getOrderDetailsData?.data?.order_details.length || 0
                          }
                          order_detail_data={order_detail}
                        ></ReviewForm>
                      </div>
                    );
                  }
                }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailContent;
