import { useState } from 'react';
import { Badge, Button, Card, Divider } from 'react-daisyui';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { LIMIT_TRANSACTION_HISTORY, DELIVERY_STATUS } from '../../constants';
import { TransactionHistoryQuery } from '../../types/query';
import { useGetAllTransactionHistoryQuery } from '../../store/services/orderService';
import { toTransactionHistoryQuery } from '../../utils/mapperDTO';
import { toRupiah, toStringDate } from '../../utils/convert';
import { limitString } from '../../utils/limitString';

const PurchaseContent = () => {
  const [transactionHistoryQuery] = useState<TransactionHistoryQuery>({
    limit: LIMIT_TRANSACTION_HISTORY,
    page: 1,
    filterOrderStatus: 'all',
    filterOngoingOrderStatus: '',
    filterStartTransactionDate: '',
    filterEndTransactionDate: '',
  });

  const {
    data: getAllTransactionHistoryData,
    isLoading: getAllTransactionHistoryLoading,
  } = useGetAllTransactionHistoryQuery(
    toTransactionHistoryQuery(transactionHistoryQuery)
  );

  const getBadgeColor = (orderStatus: string) => {
    if (orderStatus.toLowerCase() === DELIVERY_STATUS.COMPLETED.toLowerCase()) {
      return 'success';
    }

    if (
      orderStatus.toLowerCase() ===
        DELIVERY_STATUS.CANCELED_BUYER.toLowerCase() ||
      orderStatus.toLowerCase() ===
        DELIVERY_STATUS.CANCELED_SELLER.toLowerCase()
    ) {
      return 'error';
    }

    return 'warning';
  };

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Transaction History</h5>
      <Divider />
      <div className='grid grid-cols-12 gap-4'>
        {getAllTransactionHistoryLoading && (
          <Card className='col-span-12 shadow animate-pulse'>
            <div className='p-4'>
              <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
              <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
              <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
            </div>
          </Card>
        )}
        {getAllTransactionHistoryData?.data &&
          getAllTransactionHistoryData?.data.order_list.map(
            (transactionHistory, n) => {
              const productCount = transactionHistory.order_details.length;
              const firstProduct = transactionHistory.order_details.at(0);
              return (
                <Card
                  className='col-span-12 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                  key={n}
                >
                  <div className='p-4 cursor-pointer lg:cursor-default'>
                    <div className='flex items-center mb-2.5 gap-3'>
                      <HiOutlineShoppingBag className='text-info text-xl' />
                      <span>
                        {toStringDate(transactionHistory.transaction_datetime)}
                      </span>
                      <Badge
                        color={getBadgeColor(transactionHistory.order_status)}
                        size='sm'
                        className='truncate'
                      >
                        {transactionHistory.order_status}
                      </Badge>
                    </div>
                    <div className='mb-1'>
                      <span className='font-bold'>
                        {transactionHistory.shop_name}
                      </span>
                    </div>
                    <div className='flex'>
                      <div className='mr-5'>
                        <img
                          src={firstProduct?.product_image || ''}
                          alt={firstProduct?.product_name || ''}
                          className='h-12 w-12 md:h-20 md:w-20'
                        />
                      </div>
                      <div className='flex flex-col w-[70%]'>
                        <span className='font-bold'>
                          {limitString(firstProduct?.product_name || '')}
                        </span>
                        <span className='font-light text-sm'>
                          {firstProduct?.quantity} item
                          {firstProduct?.quantity || 0 > 1
                            ? 's'
                            : null} &times; {toRupiah(firstProduct?.price || 0)}
                        </span>
                        {productCount > 1 ? (
                          <span className='font-light text-sm'>
                            +{productCount - 1} other product
                            {productCount > 2 ? 's' : null}
                          </span>
                        ) : null}
                      </div>
                      <div className='hidden lg:flex items-center'>
                        <div className='divider divider-horizontal'></div>
                        <div className='flex flex-col'>
                          <span className='font-light text-sm'>
                            Total Amount
                          </span>
                          <span className='font-bold'>
                            {toRupiah(
                              Math.round(transactionHistory?.total_price)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex mt-3 gap-3 items-center justify-between lg:justify-end'>
                      <span className='hidden text-primary font-medium text-sm cursor-pointer lg:block'>
                        View Transaction Details
                      </span>
                      <div className='flex flex-col lg:hidden'>
                        <span className='font-light text-sm'>Total Amount</span>
                        <span className='font-bold'>
                          {toRupiah(
                            Math.round(transactionHistory?.total_price)
                          )}
                        </span>
                      </div>
                      <Button
                        className='normal-case md:w-auto md:pl-7 md:pr-7'
                        color='primary'
                      >
                        Repurchase
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            }
          )}
      </div>
    </div>
  );
};

export default PurchaseContent;
