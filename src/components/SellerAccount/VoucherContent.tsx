import { ChangeEvent, FormEvent, useState } from 'react';
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
} from '../../constants';
import { MerchantVoucherQuery } from '../../types/query';
import { Merchant } from '../../types/component';
import { useGetAllMerchantVoucherQuery } from '../../store/services/shopService';
import { toMerchantVoucherQuery } from '../../utils/mapperDTO';
import { Pager } from '../../components/common';
import { stringComparison } from '../../utils/validation';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toRupiah } from '../../utils/convert';

type ContentProps = {
  profile: Merchant;
};

const VoucherContent = ({ profile }: ContentProps) => {
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

  const {
    data: getAllMerchantVoucherData,
    isLoading: getAllMerchantVoucherLoading,
  } = useGetAllMerchantVoucherQuery(toMerchantVoucherQuery(voucherQuery));

  const handlePageChange = (n: number) => {
    setVoucherQuery({
      ...voucherQuery,
      page: n,
    });
  };

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

  const handleEditVoucherClick = () => {
    console.log('edit');
  };

  const handleCancelVoucherClick = () => {
    console.log('cancel');
  };

  const handleDetailVoucherClick = () => {
    console.log('detail');
  };

  return (
    <div className='p-4 md:p-10'>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Voucher List</h5>
        <Button
          className='w-full md:w-auto'
          startIcon={<HiPlus className='text-xl' />}
          color='primary'
          onClick={() => {
            console.log('tes');
          }}
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
        <Table className='w-[100%]'>
          <Table.Head>
            <span>Voucher Information</span>
            <span>Quota</span>
            <span>Period &#38; Status</span>
            <span></span>
          </Table.Head>

          <Table.Body>
            {getAllMerchantVoucherData?.data &&
            getAllMerchantVoucherData?.data.merchant_voucher.length > 0 ? (
              getAllMerchantVoucherData?.data.merchant_voucher.map(
                ({
                  id,
                  merchant_id,
                  code,
                  start_datetime,
                  end_datetime,
                  discount_type,
                  discount,
                  minimum_spend_amount,
                  maximum_discount_amount,
                  maximum_quota,
                  current_quota,
                  voucher_status,
                }) => {
                  const getBadgeColor = (voucherStatus: string) => {
                    if (
                      stringComparison(voucherStatus, VOUCHER_STATUS.UPCOMING)
                    ) {
                      return 'success';
                    } else if (
                      stringComparison(voucherStatus, VOUCHER_STATUS.ONGOING)
                    ) {
                      return 'warning';
                    }
                    return 'error';
                  };

                  return (
                    <Table.Row key={id}>
                      <div className='flex items-center space-x-3'>
                        {stringComparison(
                          discount_type,
                          DISCOUNT_TYPE.NOMINAL
                        ) ? (
                          <HiOutlineCurrencyDollar className='text-white bg-accent h-12 w-12 md:h-15 md:w-15 rounded-md' />
                        ) : (
                          <CgMathPercent className='text-white bg-secondary h-12 w-12 md:h-15 md:w-15 rounded-md' />
                        )}
                        <div>
                          <div className='font-bold text-sm'>{code}</div>
                          {stringComparison(
                            discount_type,
                            DISCOUNT_TYPE.NOMINAL
                          ) ? (
                            <div className='text-sm opacity-50 cursor-pointer'>
                              Discount {toRupiah(discount)}
                            </div>
                          ) : (
                            <div className='text-sm opacity-50 cursor-pointer'>
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
                      <div className='flex flex-col'>
                        <div className='flex gap-2 items-center text-sm'>
                          <div className='flex flex-col'>
                            <span className='font-bold'>{start_datetime}</span>
                            <span>{start_datetime}</span>
                          </div>
                          <span>-</span>
                          <div className='flex flex-col'>
                            <span className='font-bold'>{end_datetime}</span>
                            <span>{end_datetime}</span>
                          </div>
                        </div>
                        <Badge
                          size='sm'
                          className='font-bold p-2'
                          color={getBadgeColor(voucher_status)}
                        >
                          {capitalizeFirstLetter(voucher_status)}
                        </Badge>
                      </div>
                      <div className='flex gap-1 justify-center'>
                        {stringComparison(
                          voucher_status,
                          VOUCHER_STATUS.UPCOMING
                        ) ? (
                          <div className='flex gap-1'>
                            <Tooltip message='Edit'>
                              <HiOutlinePencil
                                className='bg-[#e4ebf5] h-7 w-7 p-1 rounded-md cursor-pointer'
                                onClick={handleEditVoucherClick}
                              />
                            </Tooltip>
                            <Tooltip message='Cancel'>
                              <HiOutlineXCircle
                                className='bg-[#e4ebf5] h-7 w-7 p-1 rounded-md cursor-pointer'
                                onClick={handleCancelVoucherClick}
                              />
                            </Tooltip>
                          </div>
                        ) : stringComparison(
                            voucher_status,
                            VOUCHER_STATUS.ONGOING
                          ) ? (
                          <Tooltip message='Edit'>
                            <HiOutlinePencil
                              className='bg-[#e4ebf5] h-7 w-7 p-1 rounded-md cursor-pointer'
                              onClick={handleEditVoucherClick}
                            />
                          </Tooltip>
                        ) : null}
                        <Tooltip message='Detail'>
                          <HiOutlineClipboardList
                            className='bg-[#e4ebf5] h-7 w-7 p-1 rounded-md cursor-pointer'
                            onClick={handleDetailVoucherClick}
                          />
                        </Tooltip>
                      </div>
                    </Table.Row>
                  );
                }
              )
            ) : (
              <h1>no data</h1>
            )}
          </Table.Body>
        </Table>
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
    </div>
  );
};

export default VoucherContent;
