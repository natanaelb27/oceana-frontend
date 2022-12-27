import { ChangeEvent, FormEvent, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Input,
  InputGroup,
  Table,
  Tabs,
  Tooltip,
} from 'react-daisyui';
import { BiCheckDouble, BiHeart, BiPencil } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { HiPlus, HiSearch } from 'react-icons/hi';
import Zoom from 'react-medium-image-zoom';
import { useNavigate } from 'react-router-dom';
import {
  LIMIT_SELLER_PRODUCT_LIST,
  PRODUCT_STATUS,
} from '../../../constants/index';
import {
  useDeleteMerchantVoucherMutation,
  useGetAllMyShopProductsQuery,
} from '../../../store/services/myShopService';
import { Merchant } from '../../../types/component';
import { ProductQuery } from '../../../types/query';
import { DeleteMerchantVoucherResponse } from '../../../types/response';
import { ProductsSortByString } from '../../../types/sort';
import { toProductQuery } from '../../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { stringCompare } from '../../../utils/validation';
import { ConfirmationModal, Image, Pager } from '../../common';
import NoData from '../../common/NoData';
import { toRupiah } from '../../../utils/convert';
import ClassNames from '../../../utils/classnames';

type ContentProps = {
  profile: Merchant;
};

type OpenModal = {
  delete: boolean;
};

const ProductContent = ({ profile }: ContentProps) => {
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState<string>(
    PRODUCT_STATUS.ACTIVE
  );
  const [search, setSearch] = useState<string>('');
  const [productQuery, setProductQuery] = useState<ProductQuery>({
    search: search,
    sort: '',
    sortBy: ProductsSortByString.Newest,
    limit: LIMIT_SELLER_PRODUCT_LIST,
    page: 1,
    merchantID: 0,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    rating: 0,
    merchantCities: [],
    courierServices: [],
    status: filterStatus,
  });

  const { data: response } = useGetAllMyShopProductsQuery(
    toProductQuery(productQuery)
  );

  const handlePageChange = (n: number) => {
    setProductQuery({
      ...productQuery,
      page: n,
    });
  };

  const [id, setId] = useState<number | null>(null);

  const [deleteMerchantVoucher, { error: deleteMerchantVoucherError }] =
    useDeleteMerchantVoucherMutation();

  const [openModal, setOpenModal] = useState<OpenModal>({
    delete: false,
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setProductQuery({
      ...productQuery,
      page: 1,
      search,
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    setProductQuery({
      ...productQuery,
      page: 1,
      search,
    });
  };

  const handleFilterStatusClick = (status: string) => {
    setFilterStatus(status);
    setProductQuery({
      ...productQuery,
      page: 1,
      status,
      search,
    });
  };

  const handleCreateClick = () => {
    navigate('/seller/marketing/products/add');
  };

  const handleEditClick = (id: number) => {
    navigate(`/seller/marketing/products/edit/${id}`);
  };

  const handleModalClose = () => {
    setOpenModal({
      delete: false,
    });
    setId(null);
  };

  const handleDelete = () => {
    setOpenModal({
      delete: false,
    });

    if (!id) {
      return;
    }

    deleteMerchantVoucher(id)
      .unwrap()
      .then(() => {
        notifySuccessToast('Data has been deleted!');
      })
      .finally(() => {
        setId(null);

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
        <h5 className='font-bold text-2xl text-primary'>Products</h5>
        <Button
          className='w-full md:w-auto'
          startIcon={<HiPlus className='text-xl' />}
          color='primary'
          onClick={handleCreateClick}
        >
          Product
        </Button>
      </div>
      <Divider />
      <Tabs
        variant='bordered'
        value={filterStatus}
        onChange={handleFilterStatusClick}
        className='mb-3 border-b-2'
      >
        <Tabs.Tab value={PRODUCT_STATUS.ACTIVE}>Active</Tabs.Tab>
        <Tabs.Tab value={PRODUCT_STATUS.INACTIVE}>Inactive</Tabs.Tab>
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
        {response?.data && response?.data.length > 0 ? (
          <Table className='w-[100%]'>
            <Table.Head>
              <span>Name</span>
              <span>Variations</span>
              <div className='flex justify-center'>Prices</div>
              <div className='flex justify-center'>Stocks</div>
              <div className='flex justify-center'>Total Salse</div>
              <span>Action</span>
            </Table.Head>
            <Table.Body>
              {response?.data.map((data) => {
                return (
                  <Table.Row key={'products-table-row-' + data.id} align='left'>
                    {/* column: name */}
                    <div className='flex items-center justify-start w-full h-full gap-5'>
                      <Zoom>
                        <Image
                          className='w-36 hover:scale-105 transition-all'
                          src={data.images?.[0] || ''}
                        />
                      </Zoom>
                      <div className='flex flex-col max-w-xs'>
                        {/* total view count */}
                        <div className='flex flex-col max-w-sm'>
                          <span className='truncate'>{data.name}</span>
                        </div>
                        {/* total like count */}
                        <div className='flex gap-5'>
                          <Tooltip message='Total View Count'>
                            <div className='flex items-center gap-2 text-base-content/50'>
                              <BsEye />
                              <span>-</span>
                            </div>
                          </Tooltip>
                          <Tooltip message='Total Like Count'>
                            <div className='flex items-center gap-2 text-base-content/50'>
                              <BiHeart />
                              <span>{data.like_count}</span>
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    {/* column: variations */}
                    <div className='text-sm flex flex-col gap-4'>
                      {data.product_model.map((value, index) => (
                        <div key={`product-model${index}`} className='flex'>
                          {value.product_variations || '-'}
                        </div>
                      ))}
                    </div>
                    {/* column: prices */}
                    <div className='text-sm flex flex-col items-end gap-4'>
                      {data.product_model.map((value, index) => (
                        <div key={`product-model${index}`} className='flex'>
                          {toRupiah(value.price) || 'Rp. -'}
                        </div>
                      ))}
                    </div>
                    {/* column: stocks */}
                    <div className='text-sm flex flex-col items-end gap-4'>
                      {data.product_model.map((value, index) => (
                        <div key={`product-model${index}`} className='flex'>
                          <span
                            className={ClassNames([
                              value.stock_quantity === 0 ? 'text-red-600' : '',
                            ])}
                          >
                            {value.stock_quantity || 'sold out'}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* column: total sales */}
                    <div className='text-sm flex flex-col items-end gap-4'>
                      {data.total_purchased || '0'}
                    </div>
                    {/* column: actions */}
                    <div className='flex gap-1 justify-left'>
                      <div className='flex flex-col gap-1'>
                        <Tooltip message='Edit'>
                          <Button
                            color='warning'
                            size='sm'
                            onClick={() => handleEditClick(data.id)}
                            disabled={stringCompare(
                              status,
                              PRODUCT_STATUS.INACTIVE
                            )}
                          >
                            <BiPencil className='text-lg' />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : (
          <NoData
            title='No data?'
            message='Try add new data to see some secrets!'
          />
        )}
      </div>
      <div className='mt-6 flex justify-center'>
        <Pager
          page={productQuery.page}
          totalPage={
            response?.metadata?.total_pages ? response.metadata.total_pages : 0
          }
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmationModal
        open={openModal.delete}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleDelete}
      />
    </div>
  );
};

export default ProductContent;
