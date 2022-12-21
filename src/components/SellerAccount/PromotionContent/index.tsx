import { ChangeEvent, useEffect, useState } from 'react';
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
  HiOutlineClipboardList,
  HiOutlinePencil,
  HiOutlineXCircle,
  HiPlus,
  HiSearch,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import {
  LIMIT_SELLER_PROMOTION_LIST,
  PROMOTION_STATUS,
} from '../../../constants';
import {
  useDeleteMerchantPromotionMutation,
  useLazyGetMerchantPromotionQuery,
} from '../../../store/services/myShopService';
import { Merchant } from '../../../types/component';
import { MerchantPromotionQuery } from '../../../types/query';
import { MerchantPromotionDetailsResponse } from '../../../types/response';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toStringDate, toStringTime } from '../../../utils/convert';
import { toMerchantPromotionQuery } from '../../../utils/mapperDTO/merchantPromotion';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { stringCompare } from '../../../utils/validation';
import { ConfirmationModal, NoData } from '../../common';

type PromotionContentProps = {
  profile: Merchant;
};

type OpenModal = {
  delete: boolean;
};

const PromotionContent = ({ profile }: PromotionContentProps) => {
  const [filterStatus, setFilterStatus] = useState<string>(
    PROMOTION_STATUS.ALL
  );
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<MerchantPromotionQuery>({
    limit: LIMIT_SELLER_PROMOTION_LIST,
    page: 1,
    searchPromotionName: '',
    filterPromotionStatus: PROMOTION_STATUS.ALL,
  });
  const [openModal, setOpenModal] = useState<OpenModal>({
    delete: false,
  });
  const [merchantPromotionID, setMerchantPromotionID] = useState<number | null>(
    null
  );

  const navigate = useNavigate();

  const [getAllMerchantPromotion, { data: getAllMerchantPromotionData }] =
    useLazyGetMerchantPromotionQuery();
  const [deleteMerchantPromotion] = useDeleteMerchantPromotionMutation();

  useEffect(() => {
    getAllMerchantPromotion(toMerchantPromotionQuery(query)).unwrap();
  }, [query]);

  const handleFilterStatusClick = (value: string) => {
    setFilterStatus(value);

    setQuery({
      ...query,
      filterPromotionStatus: value,
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    setQuery({
      ...query,
      searchPromotionName: search,
    });
  };

  const getBadgeColor = (voucherStatus: string) => {
    if (stringCompare(voucherStatus, PROMOTION_STATUS.UPCOMING)) {
      return undefined;
    } else if (stringCompare(voucherStatus, PROMOTION_STATUS.ONGOING)) {
      return 'warning';
    }
    return 'success';
  };

  const handleCreatePromotionClick = () => {
    navigate('/seller/marketing/promotions/add');
  };

  const handleEditPromotionClick = (id: number) => {
    navigate(`/seller/marketing/promotions/edit/${id}`);
  };

  const handleCancelPromotionClick = (id: number) => {
    setOpenModal({
      delete: true,
    });

    setMerchantPromotionID(id);
  };

  const handleDetailPromotionClick = (id: number) => {
    navigate(`/seller/marketing/promotions/detail/${id}`);
  };

  const handleDuplicatePromotionClick = (id: number) => {
    navigate(`/seller/marketing/promotions/duplicate/${id}`);
  };

  const handleModalClose = () => {
    setOpenModal({
      delete: false,
    });
    setMerchantPromotionID(null);
  };

  const handleDeleteMerchantPromotion = () => {
    setOpenModal({
      delete: false,
    });

    if (!merchantPromotionID) {
      return;
    }

    deleteMerchantPromotion(merchantPromotionID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Promotion has been deleted!');
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as MerchantPromotionDetailsResponse;

          notifyErrorToast(response.message);
        }
      })
      .finally(() => {
        setMerchantPromotionID(null);
      });
  };

  if (!getAllMerchantPromotionData?.data) {
    return null;
  }

  return (
    <div className='p-4 md:p-10'>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Promotion List</h5>
        <Button
          className='w-full md:w-auto'
          startIcon={<HiPlus className='text-xl' />}
          color='primary'
          onClick={handleCreatePromotionClick}
        >
          Promotion
        </Button>
      </div>
      <Divider />
      <Tabs
        variant='bordered'
        value={filterStatus}
        onChange={handleFilterStatusClick}
        className='mb-3 border-b-2'
      >
        <Tabs.Tab value={PROMOTION_STATUS.ALL}>All</Tabs.Tab>
        <Tabs.Tab value={PROMOTION_STATUS.ONGOING}>Ongoing</Tabs.Tab>
        <Tabs.Tab value={PROMOTION_STATUS.UPCOMING}>Upcoming</Tabs.Tab>
        <Tabs.Tab value={PROMOTION_STATUS.ENDED}>Ended</Tabs.Tab>
      </Tabs>
      <div className='flex mb-4'>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchClick();
          }}
          className='w-full md:w-auto'
        >
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
        {getAllMerchantPromotionData.data.length > 0 ? (
          <Table className='w-[100%]'>
            <Table.Head>
              <span>Promotion Information</span>
              <span>Period Status</span>
              <span></span>
            </Table.Head>
            <Table.Body>
              {getAllMerchantPromotionData.data.map(
                ({
                  id,
                  name,
                  start_datetime,
                  end_datetime,
                  product_merchant_promotion,
                  promotion_status,
                }) => (
                  <Table.Row key={id}>
                    <div className='flex items-center space-x-3'>
                      {stringCompare(
                        promotion_status,
                        PROMOTION_STATUS.ONGOING
                      ) ? (
                        <CgMathPercent className='bg-secondary text-white h-12 w-12 md:h-15 md:w-15 rounded-md' />
                      ) : (
                        <CgMathPercent className='bg-accent text-white h-12 w-12 md:h-15 md:w-15 rounded-md' />
                      )}
                      <div>
                        <div className='text-sm font-bold'>{name}</div>
                        <div className='text-sm opacity-50'>
                          {product_merchant_promotion.length} product(s)
                        </div>
                      </div>
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
                        color={getBadgeColor(promotion_status)}
                      >
                        {capitalizeFirstLetter(promotion_status)}
                      </Badge>
                    </div>
                    <div className='flex gap-1 justify-left'>
                      <div className='flex gap-1'>
                        <Tooltip message='Edit'>
                          <Button
                            color='warning'
                            size='sm'
                            onClick={() => handleEditPromotionClick(id)}
                            disabled={stringCompare(
                              promotion_status,
                              PROMOTION_STATUS.ENDED
                            )}
                          >
                            <HiOutlinePencil className='text-lg' />
                          </Button>
                        </Tooltip>
                        <Tooltip message='Cancel'>
                          <Button
                            color='error'
                            size='sm'
                            onClick={() => handleCancelPromotionClick(id)}
                            disabled={
                              !stringCompare(
                                promotion_status,
                                PROMOTION_STATUS.UPCOMING
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
                            onClick={() => handleDetailPromotionClick(id)}
                          >
                            <HiOutlineClipboardList className='text-lg' />
                          </Button>
                        </Tooltip>
                        <Tooltip message='Duplicate'>
                          <Button
                            color='accent'
                            size='sm'
                            onClick={() => handleDuplicatePromotionClick(id)}
                          >
                            <HiOutlineClipboardCopy className='text-lg' />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table>
        ) : (
          <div className='flex justify-center'>
            <NoData
              title='No promotions?'
              message='How about adding promotion for your customer?'
            />
          </div>
        )}
      </div>
      <ConfirmationModal
        open={openModal.delete}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleDeleteMerchantPromotion}
      />
    </div>
  );
};

export default PromotionContent;
