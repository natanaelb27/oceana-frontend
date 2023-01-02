import { useFormik } from 'formik';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Table,
  Tooltip,
} from 'react-daisyui';
import Zoom from 'react-medium-image-zoom';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import {
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineTrash,
  HiPlus,
} from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Merchant,
  ProductMerchantPromotionOption,
  SelectedProductMerchantPromotion,
} from '../../../types/component';
import { SellerAccountPromotionFormContent } from '../../../types/content';
import ProductModal from './ProductModal';
import { roundTimeToFloor, roundTimeToNearest30 } from '../../../utils/date';
import { ConfirmationModal, Image, NoData } from '../../common';
import { toRupiah } from '../../../utils/convert';
import { stringCompare } from '../../../utils/validation';
import { DISCOUNT_TYPE, PROMOTION_STATUS } from '../../../constants';
import PromotionModal from './PromotionModal';
import {
  useCreateMerchantPromotionMutation,
  useLazyGetMerchantPromotionDetailsQuery,
  useUpdateMerchantPromotionMutation,
} from '../../../store/services/myShopService';
import {
  toAvailableProductQuery,
  toMerchantPromotionRequest,
} from '../../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { MerchantPromotionResponse } from '../../../types/response';
import { useLazyGetAvailableProductsQuery } from '../../../store/services/productService';

type PromotionFormContentProps = {
  profile: Merchant;
  content: SellerAccountPromotionFormContent;
};

type DateLimit = {
  min: Moment;
  max: Moment;
};

type OpenModal = {
  add: boolean;
  edit: boolean;
  delete: boolean;
  productWarning: boolean;
};

const PromotionFormContent = ({
  profile,
  content,
}: PromotionFormContentProps) => {
  const navigate = useNavigate();
  const params = useParams();

  const [openModal, setOpenModal] = useState<OpenModal>({
    add: false,
    edit: false,
    delete: false,
    productWarning: false,
  });
  const [startDate, setStartDate] = useState<Date | null>(
    roundTimeToNearest30(moment().add(1, 'd').toDate())
  );
  const [endDate, setEndDate] = useState<Date | null>(
    roundTimeToNearest30(moment().add(7, 'd').toDate())
  );
  const [startDateTemp, setStartDateTemp] = useState<Date | null>(null);
  const [endDateTemp, setEndDateTemp] = useState<Date | null>(null);

  const [startDateLimit, setStartDateLimit] = useState<DateLimit>({
    min: moment().add(1, 'd'),
    max: moment(endDate).isBefore(moment().add(1, 'M'))
      ? moment(endDate)
      : moment().add(1, 'M'),
  });

  const [endDateLimit, setEndDateLimit] = useState<DateLimit>({
    min: moment(startDate).add(1, 'h'),
    max: moment(startDate).add(3, 'M'),
  });

  const [products, setProducts] = useState<SelectedProductMerchantPromotion>(
    []
  );

  const [remainingProducts, setRemainingProducts] =
    useState<SelectedProductMerchantPromotion>([]);

  const [productID, setProductID] = useState<number | null>(null);
  const [promotionStatus, setPromotionStatus] = useState<string | null>(null);

  const [getProducts] = useLazyGetAvailableProductsQuery();

  const filterStartDate = (date: Date) =>
    moment(date).isBetween(startDateLimit.min, startDateLimit.max, 'D', '[]');
  const filterEndDate = (date: Date) =>
    moment(date).isBetween(endDateLimit.min, endDateLimit.max, 'D', '[]');
  const filterStartTime = (date: Date) =>
    moment(date).isBetween(
      startDateLimit.min,
      startDateLimit.max,
      undefined,
      '[]'
    );
  const filterEndTime = (date: Date) =>
    moment(date).isBetween(endDateLimit.min, endDateLimit.max, undefined, '[]');
  const [termsAndConditionsValue, setTermsAndConditionsValue] =
    useState<boolean>(false);

  const [getMerchantPromotion] = useLazyGetMerchantPromotionDetailsQuery();
  const [
    createMerchantPromotion,
    { isLoading: createMerchantPromotionIsLoading },
  ] = useCreateMerchantPromotionMutation();
  const [
    updateMerchantPromotion,
    { isLoading: updateMerchantPromotionIsLoading },
  ] = useUpdateMerchantPromotionMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please enter promotion name'),
    }),
    onSubmit: ({ name }) => {
      if (!startDate || !endDate || Object.keys(products).length <= 0) {
        return;
      }

      if (content === SellerAccountPromotionFormContent.Add) {
        createMerchantPromotion(
          toMerchantPromotionRequest(name, startDate, endDate, products)
        )
          .unwrap()
          .then(() => {
            notifySuccessToast(
              'Yay! You have successfully created a new promotion'
            );
            navigate('/seller/marketing/promotions/list');
          })
          .catch((err) => {
            if ('data' in err) {
              const response = err.data as MerchantPromotionResponse;

              notifyErrorToast(response.message);
            }
          });
      }

      if (content === SellerAccountPromotionFormContent.Edit) {
        const promotionID = params?.promotionID;

        if (!promotionID) {
          return;
        }

        if (isNaN(Number(promotionID))) {
          return;
        }

        updateMerchantPromotion({
          id: Number(promotionID),
          request: toMerchantPromotionRequest(
            name,
            startDate,
            endDate,
            products
          ),
        })
          .unwrap()
          .then(() => {
            notifySuccessToast(
              'Yay! You have successfully updated your promotion'
            );
            navigate('/seller/marketing/promotions/list');
          })
          .catch((err) => {
            if ('data' in err) {
              const response = err.data as MerchantPromotionResponse;

              notifyErrorToast(response.message);
            }
          });
      }
    },
  });

  useEffect(() => {
    const promotionID = params?.promotionID;

    if (!promotionID) {
      return;
    }

    if (isNaN(Number(promotionID))) {
      return;
    }

    getMerchantPromotion(Number(promotionID))
      .unwrap()
      .then((res) => {
        if (!res.data) {
          return;
        }

        if (content === SellerAccountPromotionFormContent.Add) {
          formik.setFieldValue('name', res.data.name);
        } else {
          if (
            stringCompare(PROMOTION_STATUS.ENDED, res.data.promotion_status)
          ) {
            navigate('/seller/marketing/promotions/list');

            return;
          } else if (
            stringCompare(PROMOTION_STATUS.ONGOING, res.data.promotion_status)
          ) {
            setPromotionStatus(PROMOTION_STATUS.ONGOING);
          } else {
            setPromotionStatus(null);
          }

          const newStartDateLimit = {
            min: moment(res.data.start_datetime),
            max: moment(res.data.end_datetime).subtract(1, 'h'),
          };
          const newEndDateLimit = {
            min: moment(res.data.start_datetime).add(1, 'h'),
            max: moment(res.data.end_datetime),
          };

          formik.setFieldValue('name', res.data.name);
          setStartDate(moment(res.data.start_datetime).toDate());
          setEndDate(moment(res.data.end_datetime).toDate());
          setStartDateLimit(newStartDateLimit);
          setEndDateLimit(newEndDateLimit);

          try {
            let newProducts: SelectedProductMerchantPromotion = {};

            res.data.product_merchant_promotion.forEach(
              ({
                product_id,
                product_name,
                product_image,
                price_max,
                price_max_after_discount,
                price_min,
                price_min_after_discount,
                total_stock,
                discount_type,
                discount,
                maximum_discount_amount,
                maximum_quota,
                maximum_user_limit,
                current_quota,
              }) => {
                newProducts = {
                  ...newProducts,
                  [product_id]: {
                    product_id,
                    product_name,
                    product_image,
                    price_max,
                    price_max_after_discount,
                    price_min,
                    price_min_after_discount,
                    total_stock,
                    discount_type,
                    discount,
                    maximum_discount_amount,
                    maximum_quota,
                    maximum_user_limit,
                    current_quota,
                  },
                };
              }
            );
            setProducts(newProducts);
          } catch (e) {
            setProducts({});
          }
        }
      });
  }, [params]);

  useEffect(() => {
    if (content === SellerAccountPromotionFormContent.Add) {
      setStartDateLimit({
        min: moment().add(1, 'd'),
        max: moment(endDate).isBefore(moment().add(1, 'M'))
          ? moment(endDate)
          : moment().add(1, 'M'),
      });

      setEndDateLimit({
        min: moment(startDate).add(1, 'h'),
        max: moment(startDate).add(3, 'M'),
      });
    } else if (content === SellerAccountPromotionFormContent.Edit) {
      setEndDateLimit({
        ...endDateLimit,
        min: moment(startDate).add(1, 'h'),
      });
    }

    if (moment(endDate).diff(moment(startDate), 'h') < 1) {
      setEndDate(moment(startDate).add(1, 'h').toDate());
    }

    if (moment(startDateLimit.min).isAfter(moment(startDate))) {
      setStartDate(roundTimeToNearest30(startDateLimit.min.toDate()));
    }

    if (moment(startDateLimit.max).isBefore(moment(startDate))) {
      setStartDate(roundTimeToFloor(startDateLimit.max.toDate()));
    }

    if (moment(endDateLimit.max).isBefore(moment(endDate))) {
      setEndDate(endDateLimit.max.toDate());
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (date: Date | null) => {
    if (content === SellerAccountPromotionFormContent.Add) {
      getProducts(
        toAvailableProductQuery({
          search: '',
          filterCategory: 0,
          filterStartDatetime: date,
          filterEndDatetime: endDate,
        })
      )
        .unwrap()
        .then((data) => {
          const availableProducts: SelectedProductMerchantPromotion = [];
          const availableProductsArray: number[] = [];
          data?.data?.map(
            ({
              product_id,
              product_name,
              product_image,
              price_max,
              price_min,
              total_stock,
            }) => {
              if (!products?.[product_id]) {
                const availableProductOptions: ProductMerchantPromotionOption =
                  {
                    product_id: product_id,
                    product_name: product_name,
                    product_image: product_image,
                    price_max: Number(price_max),
                    price_min: Number(price_min),
                    total_stock: Number(total_stock),
                  };

                availableProducts[product_id] = availableProductOptions;

                availableProductsArray.push(product_id);
              } else {
                availableProducts[product_id] = products[product_id];

                availableProductsArray.push(product_id);
              }
            }
          );

          const remainingProductsTemp: SelectedProductMerchantPromotion = {};

          Object.keys(products).map((id) => {
            if (availableProductsArray.includes(Number(id))) {
              remainingProductsTemp[Number(id)] = availableProducts[Number(id)];
            }
          });

          if (
            Object.keys(products).length !=
            Object.keys(remainingProductsTemp).length
          ) {
            setRemainingProducts(remainingProductsTemp);
            setStartDateTemp(date);
            setEndDateTemp(endDate);
            setOpenModal({
              ...openModal,
              productWarning: true,
            });
          } else {
            // const newEndDateLimit = {
            //   min: moment(date).add(1, 'h'),
            //   max: moment(date).add(3, 'M'),
            // };

            // setEndDateLimit(newEndDateLimit);

            setStartDate(date);
          }
        });
    } else if (content === SellerAccountPromotionFormContent.Edit) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (content === SellerAccountPromotionFormContent.Add) {
      getProducts(
        toAvailableProductQuery({
          search: '',
          filterCategory: 0,
          filterStartDatetime: startDate,
          filterEndDatetime: date,
        })
      )
        .unwrap()
        .then((data) => {
          const availableProducts: SelectedProductMerchantPromotion = [];
          const availableProductsArray: number[] = [];
          data?.data?.map(
            ({
              product_id,
              product_name,
              product_image,
              price_max,
              price_min,
              total_stock,
            }) => {
              console.log({ product: products[product_id] });
              const availableProductOptions: ProductMerchantPromotionOption = {
                product_id: product_id,
                product_name: product_name,
                product_image: product_image,
                price_max: products?.[product_id]
                  ? products[product_id].price_max
                  : Number(price_max),
                price_min: products?.[product_id]
                  ? products[product_id].price_min
                  : Number(price_min),
                total_stock: products?.[product_id]
                  ? products[product_id].total_stock
                  : Number(total_stock),
              };

              availableProducts[product_id] = availableProductOptions;

              availableProductsArray.push(product_id);
            }
          );

          const remainingProductsTemp: SelectedProductMerchantPromotion = {};

          Object.keys(products).map((id) => {
            if (availableProductsArray.includes(Number(id))) {
              remainingProductsTemp[Number(id)] = availableProducts[Number(id)];
            }
          });

          if (
            Object.keys(products).length !=
            Object.keys(remainingProductsTemp).length
          ) {
            setRemainingProducts(remainingProductsTemp);
            setStartDateTemp(startDate);
            setEndDateTemp(date);
            setOpenModal({
              ...openModal,
              productWarning: true,
            });
          } else {
            setEndDate(date);
          }
        });
    } else if (content === SellerAccountPromotionFormContent.Edit) {
      setEndDate(date);
    }
  };

  const handleAddProductClick = () => {
    setOpenModal({
      add: true,
      edit: false,
      delete: false,
      productWarning: false,
    });
  };

  const handleEditProductClick = (id: number) => {
    setProductID(id);
    setOpenModal({
      add: false,
      edit: true,
      delete: false,
      productWarning: false,
    });
  };

  const handleDeleteProductClick = (id: number) => {
    setProductID(id);
    setOpenModal({
      add: false,
      edit: false,
      delete: true,
      productWarning: false,
    });
  };

  const handleConfirmDeleteProductClick = () => {
    if (!productID) {
      return;
    }

    delete products?.[productID];

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setProductID(null);
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      productWarning: false,
    });
  };

  const handleConfirmDateChangesClick = () => {
    handleCloseModal();
    setProducts(remainingProducts);
    setStartDate(startDateTemp);
    setEndDate(endDateTemp);
  };

  const handleCancelDateChanges = () => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      productWarning: false,
    });
  };

  const handleConfirmAddProductClick = (
    newProducts: SelectedProductMerchantPromotion
  ) => {
    setProducts(newProducts);
  };

  const handleGoBack = () => {
    navigate('/seller/marketing/promotions/list');
  };

  const handleTermsAndConditionsChange = () => {
    setTermsAndConditionsValue(!termsAndConditionsValue);
  };

  const title =
    content === SellerAccountPromotionFormContent.Add
      ? 'Add Promotion'
      : 'Edit Promotion';

  const filledAll = Object.entries(products).every(
    ([
      ,
      {
        product_id,
        discount_type,
        discount,
        maximum_discount_amount,
        maximum_quota,
        maximum_user_limit,
      },
    ]) => {
      return (
        product_id &&
        discount_type &&
        discount !== undefined &&
        maximum_discount_amount !== undefined &&
        maximum_quota !== undefined &&
        maximum_user_limit !== undefined
      );
    }
  );

  return (
    <div className='p-4 md:p-10'>
      <Breadcrumbs className='mb-4'>
        <Breadcrumbs.Item
          className='text-primary cursor-pointer'
          onClick={handleGoBack}
        >
          Promotion List
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{title}</Breadcrumbs.Item>
      </Breadcrumbs>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>{title}</h5>
      </div>
      <Divider />
      <Form onSubmit={(e) => e.preventDefault()}>
        <div className='flex flex-col gap-2 items-center md:items-start mb-4 md:mb-8'>
          <Badge
            size='lg'
            color='secondary'
            className='text-lg font-medium mb-4'
          >
            Basic Information
          </Badge>
          <div className='grid grid-cols-12 gap-4 w-full'>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='Promotion Name' />
              <Input
                className='w-full'
                name='name'
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name && (
                <label className='label-text-alt text-error'>
                  {formik.errors.name}
                </label>
              )}
            </div>
            <div className='col-span-12 md:col-span-3'>
              <Form.Label title='Start Date' />
              <DatePicker
                showTimeSelect
                selected={startDate}
                onChange={handleStartDateChange}
                filterDate={filterStartDate}
                filterTime={filterStartTime}
                disabled={stringCompare(
                  promotionStatus || '',
                  PROMOTION_STATUS.ONGOING
                )}
                customInput={
                  <Button
                    type='button'
                    startIcon={<HiOutlineCalendar className='text-xl' />}
                    className='normal-case font-medium w-full'
                    color={startDate ? 'info' : undefined}
                    variant={startDate ? undefined : 'outline'}
                    disabled={stringCompare(
                      promotionStatus || '',
                      PROMOTION_STATUS.ONGOING
                    )}
                  >
                    {startDate
                      ? moment(startDate).format('DD MMM YYYY - HH:mm')
                      : 'Choose Date'}
                  </Button>
                }
              />
            </div>
            <div className='col-span-12 md:col-span-3'>
              <Form.Label title='End Date' />
              <DatePicker
                showTimeSelect
                selected={endDate}
                onChange={handleEndDateChange}
                filterDate={filterEndDate}
                filterTime={filterEndTime}
                customInput={
                  <Button
                    type='button'
                    startIcon={<HiOutlineCalendar className='text-xl' />}
                    className='normal-case font-medium w-full'
                    color={endDate ? 'info' : undefined}
                    variant={endDate ? undefined : 'outline'}
                  >
                    {endDate
                      ? moment(endDate).format('DD MMM YYYY - HH:mm')
                      : 'Choose Date'}
                  </Button>
                }
              />
            </div>
          </div>
          <Divider />
          <div className='flex flex-col gap-4 md:flex-row items-center justify-between mb-4 w-full'>
            <Badge size='lg' color='secondary' className='text-lg font-medium '>
              Product List
            </Badge>
            <Button
              type='button'
              color='secondary'
              disabled={
                !startDate ||
                !endDate ||
                content === SellerAccountPromotionFormContent.Edit
              }
              startIcon={<HiPlus className='text-xl' />}
              onClick={handleAddProductClick}
            >
              Product
            </Button>
          </div>
          {Object.keys(products).length > 0 ? (
            <div className='overflow-x-auto w-full'>
              <Table className='w-[100%] z-0'>
                <Table.Head>
                  <span className='w-96'>Product</span>
                  <span>Discount</span>
                  <span>Quota</span>
                  <span>Limit</span>
                  <span></span>
                </Table.Head>
                <Table.Body>
                  {Object.entries(products).map(
                    ([
                      key,
                      {
                        product_id,
                        product_name,
                        product_image,
                        price_min,
                        price_max,
                        discount_type,
                        discount,
                        maximum_discount_amount,
                        current_quota = 0,
                        maximum_quota,
                        maximum_user_limit,
                      },
                    ]) => (
                      <Table.Row key={key}>
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
                                : `${toRupiah(price_min)} - ${toRupiah(
                                    price_max
                                  )}`}
                            </span>
                          </div>
                        </div>
                        <div className='text-sm'>
                          {discount_type &&
                          discount &&
                          maximum_discount_amount !== undefined ? (
                            stringCompare(
                              discount_type,
                              DISCOUNT_TYPE.NOMINAL
                            ) ? (
                              <p>
                                Discount{' '}
                                <span className='font-bold'>
                                  {toRupiah(discount)}
                                </span>
                              </p>
                            ) : (
                              <p>
                                Discount{' '}
                                <span className='font-bold'>
                                  {discount}% till{' '}
                                  {toRupiah(maximum_discount_amount)}
                                </span>
                              </p>
                            )
                          ) : (
                            <span className='font-light italic'>Not set</span>
                          )}
                        </div>
                        <div className='text-sm'>
                          {maximum_quota !== undefined ? (
                            <>
                              Quota Used:{' '}
                              <span className='font-bold'>
                                {current_quota}
                                {maximum_quota >= 0 && '/' + maximum_quota}
                              </span>
                            </>
                          ) : (
                            <span className='font-light italic'>Not set</span>
                          )}
                        </div>
                        <div className='text-sm'>
                          {maximum_user_limit !== undefined ? (
                            maximum_user_limit === -1 ? (
                              <span className='font-bold'>No limit</span>
                            ) : (
                              <>
                                <span className='font-bold'>
                                  {maximum_user_limit}
                                </span>
                                {' per user(s)'}
                              </>
                            )
                          ) : (
                            <span className='font-light italic'>Not set</span>
                          )}
                        </div>
                        <div className='flex justify-center items-center gap-2'>
                          <Tooltip message='Edit' color='warning'>
                            <Button
                              className=''
                              size='sm'
                              shape='square'
                              color='warning'
                              onClick={() => handleEditProductClick(product_id)}
                              disabled={stringCompare(
                                promotionStatus || '',
                                PROMOTION_STATUS.ONGOING
                              )}
                            >
                              <HiOutlinePencil className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Delete' color='error'>
                            <Button
                              className=''
                              size='sm'
                              shape='square'
                              color='error'
                              onClick={() =>
                                handleDeleteProductClick(product_id)
                              }
                              disabled={stringCompare(
                                promotionStatus || '',
                                PROMOTION_STATUS.ONGOING
                              )}
                            >
                              <HiOutlineTrash className='text-lg' />
                            </Button>
                          </Tooltip>
                        </div>
                      </Table.Row>
                    )
                  )}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <div className='flex justify-center w-full'>
              <NoData
                title='No products?'
                message='Add more products to set promotion'
              />
            </div>
          )}
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-3 items-center'>
            <Checkbox
              color='primary'
              onChange={handleTermsAndConditionsChange}
            />
            <div className='text-sm'>
              <span>I agree to the </span>
              <span className='text-primary cursor-pointer font-bold'>
                Terms &amp; Conditions
              </span>
            </div>
          </div>
          <Button
            type='submit'
            color='primary'
            onClick={() => formik.handleSubmit()}
            loading={
              createMerchantPromotionIsLoading ||
              updateMerchantPromotionIsLoading
            }
            disabled={
              !termsAndConditionsValue ||
              Object.keys(products).length <= 0 ||
              !filledAll
            }
          >
            Confirm
          </Button>
        </div>
      </Form>
      <ProductModal
        open={openModal.add}
        products={products}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAddProductClick}
        merchantID={String(profile.id)}
        startDate={startDate}
        endDate={endDate}
      />
      <PromotionModal
        open={openModal.edit}
        products={products}
        productID={productID}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAddProductClick}
      />
      <ConfirmationModal
        open={openModal.delete}
        title='Are you sure?'
        message='This action can not be undone'
        onClose={handleCloseModal}
        onAccepted={handleConfirmDeleteProductClick}
      />
      <ConfirmationModal
        open={openModal.productWarning}
        title='Are you sure?'
        message='Some products will be removed due to conflicting dates'
        onClose={handleCancelDateChanges}
        onAccepted={handleConfirmDateChangesClick}
      />
    </div>
  );
};

export default PromotionFormContent;
