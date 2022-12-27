import moment from 'moment';
import { ChangeEvent, FormEvent, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputGroup,
  Modal,
  Table,
  Tabs,
  Textarea,
  Tooltip,
} from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import {
  HiCheck,
  HiOutlineChevronRight,
  HiOutlineClipboardList,
  HiSearch,
} from 'react-icons/hi';
import {
  LIMIT_REFUND,
  REFUND_GROUPED_STATUS,
  REFUND_STATUS,
} from '../../constants';
import {
  useAdminCompleteRefundMutation,
  useGetAllRefundsQuery,
} from '../../store/services/adminService';
import { useLazyGetRefundDetailsQuery } from '../../store/services/refundService';
import { RefundQuery } from '../../types/query';
import { UpdateRefundResponse } from '../../types/response';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import {
  toLongStringDatetime,
  toRupiah,
  toStringDate,
  toStringTime,
} from '../../utils/convert';
import { toRefundQuery } from '../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import { stringCompare } from '../../utils/validation';
import { ConfirmationModal, Image, NoData, Pager } from '../common';
import DateCountdown from '../common/DateCountdown';
import Zoom from 'react-medium-image-zoom';

type OpenModal = {
  detailRefund: boolean;
  completeRefund: boolean;
};

const AdminRefunds = () => {
  const [filterStatus, setFilterStatus] = useState<string>(
    REFUND_STATUS.APPROVED
  );

  const [search, setSearch] = useState<string>('');

  const [openModal, setOpenModal] = useState<OpenModal>({
    detailRefund: false,
    completeRefund: false,
  });

  const [refundID, setRefundID] = useState<string | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRefundQuery({
      ...refundQuery,
      page: 1,
      searchInvoice: search,
    });
  };

  const handleSearchClick = () => {
    setRefundQuery({
      ...refundQuery,
      page: 1,
      searchInvoice: search,
    });
  };

  const [refundQuery, setRefundQuery] = useState<RefundQuery>({
    sort: '',
    sortBy: '',
    limit: LIMIT_REFUND,
    page: 1,
    searchInvoice: '',
    filterGroupedStatus: REFUND_GROUPED_STATUS.APPROVED,
    filterStatus: REFUND_STATUS.ALL,
    filterStartDate: '',
    filterEndDate: '',
  });

  const { data: getAllRefundsData, isLoading: getAllRefundsIsLoading } =
    useGetAllRefundsQuery(toRefundQuery(refundQuery));

  const [
    getRefundDetails,
    { data: getRefundDetailsData, isLoading: getRefundDetailsIsLoading },
  ] = useLazyGetRefundDetailsQuery();

  const [adminCompleteRefund, { isLoading: adminCompleteRefundIsLoading }] =
    useAdminCompleteRefundMutation();

  const handleFilterStatusClick = (status: string) => {
    setFilterStatus(status);

    if ([REFUND_GROUPED_STATUS.APPROVED].indexOf(status) >= 0) {
      setRefundQuery({
        ...refundQuery,
        page: 1,
        filterGroupedStatus: status,
        filterStatus: REFUND_STATUS.ALL,
      });
    } else {
      setRefundQuery({
        ...refundQuery,
        page: 1,
        filterGroupedStatus: REFUND_GROUPED_STATUS.ALL,
        filterStatus: status,
      });
    }
  };

  const getBadgeColor = (orderStatus: string) => {
    if (stringCompare(orderStatus, REFUND_STATUS.COMPLETED)) {
      return 'success';
    }

    return 'warning';
  };

  const handleRefundDetailClick = (id: string) => {
    setRefundID(id);
    getRefundDetails(id);

    setOpenModal({
      detailRefund: true,
      completeRefund: false,
    });
  };

  const handleModalClose = () => {
    setOpenModal({
      detailRefund: false,
      completeRefund: false,
    });

    setRefundID(null);
  };

  const handleRefundCompleteClick = (id: string) => {
    setOpenModal({
      detailRefund: false,
      completeRefund: true,
    });

    setRefundID(id);
  };

  const handleRefundComplete = () => {
    setOpenModal({
      detailRefund: false,
      completeRefund: false,
    });

    if (!refundID) {
      return;
    }

    adminCompleteRefund(refundID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Refund has been approved!');
      })
      .catch((err) => {
        if (err && 'data' in err) {
          const response = err.data as UpdateRefundResponse;

          notifyErrorToast(response.message);
        }
      })
      .finally(() => {
        setRefundID(null);
      });
  };

  const handlePageChange = (n: number) => {
    setRefundQuery({
      ...refundQuery,
      page: n,
    });
  };

  return (
    <Card className='shadow-lg bg-base-100'>
      <Card.Body>
        <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
          <h5 className='font-bold text-2xl text-primary'>Refund List</h5>
        </div>
        <Divider />
        <Tabs
          variant='bordered'
          value={filterStatus}
          onChange={handleFilterStatusClick}
          className='mb-3 border-b-2'
        >
          <Tabs.Tab value={REFUND_STATUS.APPROVED}>Approved</Tabs.Tab>
          <Tabs.Tab value={REFUND_STATUS.COMPLETED}>Completed</Tabs.Tab>
        </Tabs>
        <div className='flex mb-4'>
          <Form onSubmit={handleFormSubmit} className='w-full md:w-auto'>
            <InputGroup>
              <Input
                type='text'
                placeholder='Search...'
                className='w-full md:max-w-xs'
                value={search}
                onChange={handleSearchChange}
              />
              <Button onClick={handleSearchClick}>
                <HiSearch className='text-lg' />
              </Button>
            </InputGroup>
          </Form>
        </div>
        <div className='overflow-x-auto'>
          {!getAllRefundsIsLoading &&
            (getAllRefundsData?.data && getAllRefundsData?.data?.length > 0 ? (
              <Table className='w-[100%] z-0'>
                <Table.Head>
                  <span>Invoice No.</span>
                  <span>Products</span>
                  <span>Refund Total</span>
                  <span>Refund Request Date</span>
                  <span></span>
                </Table.Head>
                <Table.Body>
                  {getAllRefundsData?.data?.map(
                    (
                      {
                        refund_id,
                        invoice_number,
                        refund_request_datetime,
                        refund_status,
                        refund_items,
                        total_user_refund_amount,
                        total_merchant_lost_amount,
                      },
                      n
                    ) => {
                      const productCount = refund_items.length;
                      const firstProduct = refund_items.at(0);

                      return (
                        <Table.Row key={n}>
                          <div>
                            <span className='text-sm font-light'>
                              {invoice_number}
                            </span>
                          </div>
                          <div className='flex flex-col max-w-md'>
                            <div className='flex'>
                              <div className='flex mr-5'>
                                <Image
                                  src={firstProduct?.product_image || ''}
                                  alt={firstProduct?.product_name || ''}
                                  className='h-12 w-12 md:h-20 md:w-20 rounded-md'
                                />
                              </div>
                              <div className='flex flex-col w-[70%]'>
                                <div className='flex gap-2 items-center'>
                                  <span className='font-bold line-clamp-2 md:line-clamp-1 mt-0'>
                                    {firstProduct?.product_name || ''}
                                  </span>
                                </div>
                                <span className='font-light text-sm'>
                                  {firstProduct?.refund_quantity} item
                                  {(firstProduct?.refund_quantity || 0) > 1
                                    ? 's'
                                    : null}
                                </span>
                                {productCount > 1 ? (
                                  <span className='font-light text-sm'>
                                    +{productCount - 1} other product
                                    {productCount > 2 ? 's' : null}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className='flex flex-col text-sm'>
                            <div className='flex gap-1'>
                              <span className='font-bold'>
                                Total Buyer Refund:
                              </span>
                              <span>
                                {toRupiah(Math.round(total_user_refund_amount))}
                              </span>
                            </div>
                            <div className='flex gap-1'>
                              <span className='font-bold'>
                                Total Merchant Lost:
                              </span>
                              <span>
                                {toRupiah(
                                  Math.round(total_merchant_lost_amount)
                                )}
                              </span>
                            </div>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <div className='flex flex-col text-sm'>
                              <span className='font-bold'>
                                {toStringDate(refund_request_datetime)}
                              </span>
                              <span className='opacity-50'>
                                {toStringTime(refund_request_datetime)}
                              </span>
                            </div>
                            <Badge
                              size='xs'
                              className='font-bold p-2'
                              color={getBadgeColor(refund_status)}
                            >
                              {refund_status}
                            </Badge>
                          </div>
                          <div className='flex'>
                            <Tooltip message='Detail'>
                              <Button
                                color='info'
                                size='sm'
                                onClick={() =>
                                  handleRefundDetailClick(refund_id)
                                }
                                loading={adminCompleteRefundIsLoading}
                              >
                                <HiOutlineClipboardList className='text-lg' />
                              </Button>
                            </Tooltip>
                          </div>
                        </Table.Row>
                      );
                    }
                  )}
                </Table.Body>
              </Table>
            ) : null)}
          <div className='mt-6 flex justify-center'>
            <Pager
              page={refundQuery.page}
              totalPage={
                getAllRefundsData?.metadata?.total_pages
                  ? getAllRefundsData.metadata.total_pages
                  : 0
              }
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </Card.Body>

      <Modal
        open={openModal.detailRefund}
        responsive
        className={`md:w-12/12 px-0 ${
          getRefundDetailsData?.data?.refund_status === REFUND_STATUS.ONGOING
            ? 'md:max-w-4xl'
            : 'md:max-w-2xl'
        }`}
        onClickBackdrop={handleModalClose}
      >
        <Button
          size='sm'
          shape='circle'
          color='ghost'
          className='absolute right-2 top-2'
          onClick={handleModalClose}
        >
          <CgClose className='text-lg' />
        </Button>
        <Modal.Header className='text-center font-bold'>
          Refund Detail
        </Modal.Header>
        <Modal.Body className='max-h-[48rem] md:grid md:gap-2 md:overflow-hidden'>
          {getRefundDetailsIsLoading && <div>Loading</div>}
          {!getRefundDetailsIsLoading && getRefundDetailsData?.data && (
            <div className='flex flex-col gap-2 md:max-h-[48rem] md:overflow-y-auto md:border-r-2 md:border-base-200'>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-base-200'>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-2 items-center'>
                    <span className='font-bold'>
                      {capitalizeFirstLetter(
                        getRefundDetailsData?.data?.refund_status
                      )}
                    </span>
                  </div>
                </div>
                <Divider className='m-0'></Divider>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>No. Invoice</span>
                  <span className='text-sm text-primary cursor-pointer'>
                    {getRefundDetailsData?.data.invoice_number}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Shop Name</span>
                  <span className='text-sm'>
                    {getRefundDetailsData?.data.shop_name}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Issuer Name</span>
                  <span className='text-sm'>
                    {getRefundDetailsData?.data.user_full_name}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Refund Request Date</span>
                  <span className='text-sm'>
                    {toLongStringDatetime(
                      getRefundDetailsData?.data.refund_request_datetime
                    )}
                  </span>
                </div>
                {stringCompare(
                  getRefundDetailsData?.data?.refund_status,
                  REFUND_STATUS.REJECTED
                ) ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Refund Rejected Date</span>
                    <span className='text-sm'>
                      {toLongStringDatetime(
                        getRefundDetailsData?.data.rejected_datetime
                      )}
                    </span>
                  </div>
                ) : null}
                {stringCompare(
                  getRefundDetailsData?.data?.refund_status,
                  REFUND_STATUS.ONGOING
                ) &&
                getRefundDetailsData?.data
                  ?.refund_seller_confirmation_expiration_datetime ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Approve Refund</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getRefundDetailsData?.data
                            ?.refund_seller_confirmation_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}

                {stringCompare(
                  getRefundDetailsData?.data?.refund_status,
                  REFUND_STATUS.REJECTED
                ) &&
                getRefundDetailsData?.data
                  ?.refund_rejected_auto_complete_order_expiration_datetime ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Complete Order</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getRefundDetailsData?.data
                            ?.refund_rejected_auto_complete_order_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}
              </div>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-base-200'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Refund Media</span>
                </div>
                {getRefundDetailsData?.data?.images?.length ||
                getRefundDetailsData?.data?.videos?.length ||
                0 > 0 ? (
                  <div className='flex flex-wrap gap-4'>
                    {getRefundDetailsData?.data?.videos?.map((video, n) => {
                      return (
                        <video
                          key={n}
                          src={video || ''}
                          controls
                          className='h-20 w-40 rounded-md'
                        />
                      );
                    })}
                    {getRefundDetailsData?.data?.images?.map((image, n) => {
                      return (
                        <Zoom key={n}>
                          <img
                            src={image}
                            className='border rounded-lg w-20 h-20'
                          ></img>
                        </Zoom>
                      );
                    })}
                  </div>
                ) : (
                  <NoData title='It seems that this refund has no media uploaded'></NoData>
                )}
              </div>
              <div className='w-full flex flex-col gap-2 p-5 border-b-8 border-base-200'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Refund Reason</span>
                </div>
                <Textarea
                  className='w-full resize-none min-h-[7rem] disabled:cursor-default'
                  value={
                    getRefundDetailsData?.data?.refund_reason
                      ? getRefundDetailsData?.data?.refund_reason
                      : ''
                  }
                  disabled
                ></Textarea>
              </div>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-base-200'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>
                    Merchant&apos;s Refund Details
                  </span>
                  <div className='flex items-center gap-1 text-primary'>
                    <span className='font-bold text-sm'>
                      {getRefundDetailsData?.data.shop_name}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col gap-4'>
                  {getRefundDetailsData?.data.refund_items.map(
                    (refundItems, n) => {
                      return (
                        <Card
                          className='flex gap-3 p-4 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                          key={n}
                        >
                          <div className='grid grid-cols-5 md:grid-cols-8'>
                            <div className='mr-5 col-span-1'>
                              <Image
                                src={refundItems.product_image || ''}
                                alt={refundItems.product_name || ''}
                                className='h-12 w-12 md:h-18 md:w-18 rounded-md'
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src =
                                    'https://cdn.shopify.com/s/files/1/0332/8881/4637/products/noimageavailable_7b25b64a-d5f8-423b-a498-8a2785ea69b2_2000x.jpg?v=1669356395';
                                }}
                              />
                            </div>
                            <div className='flex flex-col col-span-4'>
                              <span className='font-bold line-clamp-2 md:line-clamp-1 cursor-pointer'>
                                {refundItems.product_name || ''}
                              </span>
                              <span className='font-light text-sm line-clamp-2 md:line-clamp-1'>
                                {refundItems.product_variations}
                              </span>
                              <span className='font-light text-sm'>
                                {refundItems.refund_quantity} &times;{' '}
                                {toRupiah(
                                  Math.round(
                                    (refundItems.merchant_lost_amount || 1) /
                                      (refundItems.refund_quantity || 1)
                                  )
                                )}
                              </span>
                            </div>
                            <div className='hidden md:flex items-center justify-end md:col-span-3'>
                              <div className='divider divider-horizontal'></div>
                              <div className='flex flex-col gap-2'>
                                <div className='flex flex-col text-right'>
                                  <span className='font-light text-sm'>
                                    Refund Amount
                                  </span>
                                  <span className='font-bold'>
                                    {toRupiah(
                                      Math.round(
                                        refundItems.merchant_lost_amount
                                      )
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='flex md:hidden items-center justify-between'>
                            <div className='flex flex-col text-right'>
                              <span className='font-light text-sm'>
                                Refund Amount
                              </span>
                              <span className='font-bold'>
                                {toRupiah(
                                  Math.round(refundItems.merchant_lost_amount)
                                )}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                  )}
                  <div className='flex flex-col items-end'>
                    <span className='font-light'>Total Refund Amount</span>
                    <span className='font-bold'>
                      {toRupiah(
                        getRefundDetailsData?.data?.total_merchant_lost_amount
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2 p-5'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Buyer&apos;s Refund Details</span>
                  <div className='flex items-center gap-1 text-primary'>
                    <span className='font-bold text-sm'>
                      {getRefundDetailsData?.data.user_full_name}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col gap-4'>
                  {getRefundDetailsData?.data.refund_items.map(
                    (refundItems, n) => {
                      return (
                        <Card
                          className='flex gap-3 p-4 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                          key={n}
                        >
                          <div className='grid grid-cols-5 md:grid-cols-8'>
                            <div className='mr-5 col-span-1'>
                              <Image
                                src={refundItems.product_image || ''}
                                alt={refundItems.product_name || ''}
                                className='h-12 w-12 md:h-18 md:w-18 rounded-md'
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src =
                                    'https://cdn.shopify.com/s/files/1/0332/8881/4637/products/noimageavailable_7b25b64a-d5f8-423b-a498-8a2785ea69b2_2000x.jpg?v=1669356395';
                                }}
                              />
                            </div>
                            <div className='flex flex-col col-span-4'>
                              <span className='font-bold line-clamp-2 md:line-clamp-1 cursor-pointer'>
                                {refundItems.product_name || ''}
                              </span>
                              <span className='font-light text-sm line-clamp-2 md:line-clamp-1'>
                                {refundItems.product_variations}
                              </span>
                              <span className='font-light text-sm'>
                                {refundItems.refund_quantity} &times;{' '}
                                {toRupiah(
                                  Math.round(
                                    (refundItems.user_refund_amount || 1) /
                                      (refundItems.refund_quantity || 1)
                                  )
                                )}
                              </span>
                            </div>
                            <div className='hidden md:flex items-center justify-end md:col-span-3'>
                              <div className='divider divider-horizontal'></div>
                              <div className='flex flex-col gap-2'>
                                <div className='flex flex-col text-right'>
                                  <span className='font-light text-sm'>
                                    Refund Amount
                                  </span>
                                  <span className='font-bold'>
                                    {toRupiah(
                                      Math.round(refundItems.user_refund_amount)
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='flex md:hidden items-center justify-between'>
                            <div className='flex flex-col text-right'>
                              <span className='font-light text-sm'>
                                Refund Amount
                              </span>
                              <span className='font-bold'>
                                {toRupiah(
                                  Math.round(refundItems.user_refund_amount)
                                )}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                  )}
                  <div className='flex flex-col items-end'>
                    <span className='font-light'>Total Refund Amount</span>
                    <span className='font-bold'>
                      {toRupiah(
                        getRefundDetailsData?.data?.total_user_refund_amount
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {stringCompare(
                getRefundDetailsData?.data?.refund_status,
                REFUND_STATUS.APPROVED
              ) ||
              stringCompare(
                getRefundDetailsData?.data?.refund_status,
                REFUND_STATUS.APPROVED_BY_SYSTEM
              ) ? (
                <div className='flex gap-2 justify-end px-5 pb-5 mt-0'>
                  <Button
                    className='normal-case btn-success'
                    startIcon={<HiCheck />}
                    onClick={() => {
                      handleRefundCompleteClick(
                        getRefundDetailsData?.data?.refund_id || ''
                      );
                    }}
                  >
                    Complete
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </Modal.Body>
      </Modal>
      <ConfirmationModal
        open={openModal.completeRefund}
        title='Are you sure you want to complete this refund?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleRefundComplete}
      ></ConfirmationModal>
    </Card>
  );
};

export default AdminRefunds;
