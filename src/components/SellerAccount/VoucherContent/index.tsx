import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Divider,
  Form,
  Input,
  InputGroup,
  Table,
  Tabs,
  Tooltip,
} from 'react-daisyui';
import { CgMathPercent } from 'react-icons/cg';
import {
  HiOutlineClipboardCopy,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiPlus,
  HiSearch,
  HiOutlinePencil,
  HiOutlineXCircle,
} from 'react-icons/hi';
import {
  DISCOUNT_TYPE,
  LIMIT_SELLER_VOUCHER_LIST,
  VOUCHER_STATUS,
} from '../../../constants';
import { MerchantVoucherQuery } from '../../../types/query';
import { Merchant } from '../../../types/component';
import { useGetAllMerchantVoucherQuery } from '../../../store/services/shopService';
import { useDeleteMerchantVoucherMutation } from '../../../store/services/myShopService';
import { toMerchantVoucherQuery } from '../../../utils/mapperDTO';
import { ConfirmationModal, Pager } from '../../common';
import { stringCompare } from '../../../utils/validation';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toRupiah, toStringDate, toStringTime } from '../../../utils/convert';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { DeleteMerchantVoucherResponse } from '../../../types/response';
import NoData from '../../common/NoData';

type ContentProps = {
  profile: Merchant;
};

type OpenMerchantVoucherModal = {
  delete: boolean;
};

const VoucherContent = ({ profile }: ContentProps) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>(VOUCHER_STATUS.ALL);

  const [search, setSearch] = useState<string>('');

  const [voucherQuery, setVoucherQuery] = useState<MerchantVoucherQuery>({
    limit: LIMIT_SELLER_VOUCHER_LIST,
    page: 1,
    sortBy: '',
    sort: '',
    searchVoucherCode: '',
    filterVoucherStatus: VOUCHER_STATUS.ALL,
    merchantID: profile?.id,
  });

  const { data: getAllMerchantVoucherData } = useGetAllMerchantVoucherQuery(
    toMerchantVoucherQuery(voucherQuery)
  );

  const handlePageChange = (n: number) => {
    setVoucherQuery({
      ...voucherQuery,
      page: n,
    });
  };

  const [merchantVoucherID, setMerchantVoucherID] = useState<number | null>(
    null
  );

  const [deleteMerchantVoucher, { error: deleteMerchantVoucherError }] =
    useDeleteMerchantVoucherMutation();

  const [openModal, setOpenModal] = useState<OpenMerchantVoucherModal>({
    delete: false,
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setVoucherQuery({
      ...voucherQuery,
      page: 1,
      searchVoucherCode: search,
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    setVoucherQuery({
      ...voucherQuery,
      page: 1,
      searchVoucherCode: search,
    });
  };

  const handleFilterStatusClick = (status: string) => {
    setFilterStatus(status);
    setVoucherQuery({
      ...voucherQuery,
      page: 1,
      filterVoucherStatus: status,
    });
  };

  const handleCreateVoucherClick = () => {
    navigate('/seller/marketing/vouchers/add');
  };

  const handleEditVoucherClick = (id: number) => {
    navigate(`/seller/marketing/vouchers/edit/${id}`);
  };

  const handleCancelVoucherClick = (id: number) => {
    setOpenModal({
      delete: true,
    });

    setMerchantVoucherID(id);
  };

  const handleDetailVoucherClick = (id: number) => {
    navigate(`/seller/marketing/vouchers/detail/${id}`);
  };

  const handleDuplicateVoucherClick = (id: number) => {
    navigate(`/seller/marketing/vouchers/duplicate/${id}`);
  };

  const handleModalClose = () => {
    setOpenModal({
      delete: false,
    });
    setMerchantVoucherID(null);
  };

  const handleDeleteMerchantVoucher = () => {
    setOpenModal({
      delete: false,
    });

    if (!merchantVoucherID) {
      return;
    }

    deleteMerchantVoucher(merchantVoucherID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Voucher has been deleted!');
      })
      .finally(() => {
        setMerchantVoucherID(null);

        if (
          deleteMerchantVoucherError &&
          'data' in deleteMerchantVoucherError
        ) {
          const response =
            deleteMerchantVoucherError.data as DeleteMerchantVoucherResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  return (
    <div className='p-4 md:p-10'>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Voucher List</h5>
        <Button
          className='w-full md:w-auto'
          startIcon={<HiPlus className='text-xl' />}
          color='primary'
          onClick={handleCreateVoucherClick}
        >
          Voucher
        </Button>
      </div>
      <Divider />
      <Tabs
        variant='bordered'
        value={filterStatus}
        onChange={handleFilterStatusClick}
        className='mb-3 border-b-2'
      >
        <Tabs.Tab value={VOUCHER_STATUS.ALL}>All</Tabs.Tab>
        <Tabs.Tab value={VOUCHER_STATUS.ONGOING}>Ongoing</Tabs.Tab>
        <Tabs.Tab value={VOUCHER_STATUS.UPCOMING}>Upcoming</Tabs.Tab>
        <Tabs.Tab value={VOUCHER_STATUS.ENDED}>Ended</Tabs.Tab>
      </Tabs>
      <div className='flex flex-wrap justify-between mb-4 gap-4'>
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
        {getAllMerchantVoucherData?.data &&
        getAllMerchantVoucherData?.data.merchant_voucher.length > 0 ? (
          <Table className='w-[100%]'>
            <Table.Head>
              <span>Voucher Information</span>
              <span>Quota</span>
              <span>Period &#38; Status</span>
              <span></span>
            </Table.Head>
            <Table.Body>
              {getAllMerchantVoucherData?.data.merchant_voucher.map(
                ({
                  id,
                  code,
                  start_datetime,
                  end_datetime,
                  discount_type,
                  discount,
                  maximum_discount_amount,
                  maximum_quota,
                  current_quota,
                  voucher_status,
                }) => {
                  const getBadgeColor = (voucherStatus: string) => {
                    if (stringCompare(voucherStatus, VOUCHER_STATUS.UPCOMING)) {
                      return undefined;
                    } else if (
                      stringCompare(voucherStatus, VOUCHER_STATUS.ONGOING)
                    ) {
                      return 'warning';
                    }
                    return 'success';
                  };

                  return (
                    <Table.Row key={id}>
                      <div className='flex items-center space-x-3'>
                        {stringCompare(discount_type, DISCOUNT_TYPE.NOMINAL) ? (
                          <HiOutlineCurrencyDollar className='text-white bg-accent h-12 w-12 md:h-15 md:w-15 rounded-md' />
                        ) : (
                          <CgMathPercent className='text-white bg-secondary h-12 w-12 md:h-15 md:w-15 rounded-md' />
                        )}
                        <div>
                          <div className='font-bold text-sm'>{code}</div>
                          {stringCompare(
                            discount_type,
                            DISCOUNT_TYPE.NOMINAL
                          ) ? (
                            <div className='text-sm opacity-50'>
                              Discount {toRupiah(discount)}
                            </div>
                          ) : (
                            <div className='text-sm opacity-50'>
                              Discount {discount}% till{' '}
                              {toRupiah(maximum_discount_amount)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='flex gap-1'>
                        <span className='text-sm'>Quota Used:</span>
                        <span className='text-sm font-bold'>
                          {current_quota}/{maximum_quota}
                        </span>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <div className='flex gap-3 items-center text-sm'>
                          <div className='flex flex-col'>
                            <span className='font-bold'>
                              {toStringDate(start_datetime)}
                            </span>
                            <span className='text-sm opacity-50'>
                              {toStringTime(start_datetime)}
                            </span>
                          </div>
                          <div className='w-2 border-t border-black'></div>
                          <div className='flex flex-col'>
                            <span className='font-bold'>
                              {toStringDate(end_datetime)}
                            </span>
                            <span className='text-sm opacity-50'>
                              {toStringTime(end_datetime)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          size='xs'
                          className='font-bold p-2'
                          color={getBadgeColor(voucher_status)}
                        >
                          {capitalizeFirstLetter(voucher_status)}
                        </Badge>
                      </div>
                      <div className='flex gap-1 justify-left'>
                        <div className='flex gap-1'>
                          <Tooltip message='Edit'>
                            <Button
                              color='warning'
                              size='sm'
                              onClick={() => handleEditVoucherClick(id)}
                              disabled={stringCompare(
                                voucher_status,
                                VOUCHER_STATUS.ENDED
                              )}
                            >
                              <HiOutlinePencil className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Cancel'>
                            <Button
                              color='error'
                              size='sm'
                              onClick={() => handleCancelVoucherClick(id)}
                              disabled={
                                !stringCompare(
                                  voucher_status,
                                  VOUCHER_STATUS.UPCOMING
                                )
                              }
                            >
                              <HiOutlineXCircle className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Detail'>
                            <Button
                              color='info'
                              size='sm'
                              onClick={() => handleDetailVoucherClick(id)}
                            >
                              <HiOutlineClipboardList className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Duplicate'>
                            <Button
                              color='accent'
                              size='sm'
                              onClick={() => handleDuplicateVoucherClick(id)}
                            >
                              <HiOutlineClipboardCopy className='text-lg' />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </Table.Row>
                  );
                }
              )}
            </Table.Body>
          </Table>
        ) : (
          <NoData
            title='No vouchers?'
            message='Try add new voucher to see some secrets!'
          />
        )}
      </div>
      <div className='mt-6 flex justify-center'>
        <Pager
          page={voucherQuery.page}
          totalPage={
            getAllMerchantVoucherData?.metadata?.total_pages
              ? getAllMerchantVoucherData.metadata.total_pages
              : 0
          }
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmationModal
        open={openModal.delete}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleDeleteMerchantVoucher}
      />
    </div>
  );
};

export default VoucherContent;
