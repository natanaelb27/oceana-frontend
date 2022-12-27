import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Input,
  InputGroup,
  Modal,
  Radio,
  Toggle,
} from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import * as Yup from 'yup';
import Zoom from 'react-medium-image-zoom';
import { DISCOUNT_TYPE } from '../../../constants';
import { SelectedProductMerchantPromotion } from '../../../types/component';
import { toRupiah } from '../../../utils/convert';
import { Image } from '../../common';
import {
  handleNumberInvalidKey,
  stringCompare,
} from '../../../utils/validation';

type PromotionModalProps = {
  open: boolean;
  products: SelectedProductMerchantPromotion;
  productID: number | null;
  onClose: () => void;
  onConfirm: (newProducts: SelectedProductMerchantPromotion) => void;
};

const PromotionModal = ({
  open,
  products,
  productID,
  onClose,
  onConfirm,
}: PromotionModalProps) => {
  if (!productID) {
    return null;
  }

  const [
    selectedProductMerchantPromotion,
    setSelectedProductMerchantPromotion,
  ] = useState<SelectedProductMerchantPromotion>({});
  const [minimumMaximumQuota, setMinimumMaximumQuota] = useState<number>(0);

  useEffect(() => {
    setSelectedProductMerchantPromotion(products);
  }, [productID, products]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirmClick = () => {
    setPromotionFormik.handleSubmit();
  };

  const product = products?.[productID];

  if (!product) {
    return null;
  }

  const setPromotionFormik = useFormik({
    initialValues: {
      discountType: DISCOUNT_TYPE.NOMINAL,
      discountNominal: 0,
      discountPercentage: 0,
      maximumDiscountAmount: 0,
      maximumQuotaUnlimited: false,
      maximumQuota: 0,
      maximumUserLimitUnlimited: false,
      maximumUserLimit: 0,
    },
    validationSchema: Yup.object({
      discountType: Yup.string().required('Please enter discount type'),
      discountNominal: Yup.number().when(['discountType'], {
        is: (discountType: string) => discountType === DISCOUNT_TYPE.NOMINAL,
        then: Yup.number()
          .required('Please enter discount nominal')
          .min(1, 'Discount nominal should be more than 0'),
      }),
      discountPercentage: Yup.number().when(['discountType'], {
        is: (discountType: string) => discountType === DISCOUNT_TYPE.PERCENTAGE,
        then: Yup.number()
          .required('Please enter discount percentage')
          .min(1, 'Discount percentage should be more than 0')
          .max(100, 'Discount percentage should not be more than 100'),
      }),
      maximumDiscountAmount: Yup.number().when(['discountType'], {
        is: (discountType: string) => discountType === DISCOUNT_TYPE.PERCENTAGE,
        then: Yup.number()
          .required('Please enter maximum discount amount')
          .min(1, 'Maximum discount amount should be more than 0'),
      }),
      maximumQuotaUnlimited: Yup.boolean().required(
        'Please enter maximum quota limit'
      ),
      maximumQuota: Yup.number()
        .required('Please enter promotion quota')
        .when(['maximumQuotaUnlimited'], {
          is: (maximumQuotaUnlimited: boolean) => !maximumQuotaUnlimited,
          then: Yup.number().min(
            minimumMaximumQuota > 0 ? minimumMaximumQuota : 1,
            minimumMaximumQuota > 0
              ? 'Maximum quota should be more than currently used quota'
              : 'Maximum quota should be more than 0'
          ),
        }),
      maximumUserLimitUnlimited: Yup.boolean().required(
        'Please enter maximum user limit'
      ),
      maximumUserLimit: Yup.number()
        .required('Please enter maximum user limit')
        .when(['maximumUserLimitUnlimited'], {
          is: (maximumUserLimitUnlimited: boolean) =>
            !maximumUserLimitUnlimited,
          then: Yup.number().min(1, 'Maximum quota should be more than 0'),
        }),
    }),
    onSubmit: ({
      discountType,
      discountNominal,
      discountPercentage,
      maximumDiscountAmount,
      maximumQuota,
      maximumUserLimit,
    }) => {
      try {
        const newSelectedProductMerchantPromotion = {
          ...selectedProductMerchantPromotion,
          [productID]: {
            ...selectedProductMerchantPromotion[productID],
            discount_type: discountType,
            discount: stringCompare(DISCOUNT_TYPE.NOMINAL, discountType)
              ? discountNominal
              : discountPercentage,
            maximum_discount_amount: maximumDiscountAmount,
            maximum_quota: maximumQuota,
            maximum_user_limit: maximumUserLimit,
          },
        };

        onConfirm(newSelectedProductMerchantPromotion);
        handleClose();
      } catch (e) {
        return;
      }
    },
  });

  const handleInputDiscountPercentageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      setPromotionFormik.handleChange(e);
    }
  };

  const handleInputDiscountNominalChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      setPromotionFormik.handleChange(e);
    }
  };

  const handleInputMaximumDiscountChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      setPromotionFormik.handleChange(e);
    }
  };

  const handleInputMaximumQuotaUnlimitedChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      setMinimumMaximumQuota(-1);
      setPromotionFormik.setFieldValue('maximumQuota', -1);
    } else {
      setMinimumMaximumQuota(0);
      setPromotionFormik.setFieldValue('maximumQuota', 0);
    }
    setPromotionFormik.handleChange(e);
  };

  const handleInputMaximumQuotaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      setPromotionFormik.handleChange(e);
    }
  };

  const handleInputMaximumUserLimitChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      setPromotionFormik.handleChange(e);
    }
  };

  const handleInputMaximumUserLimitUnlimitedChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      setPromotionFormik.setFieldValue('maximumUserLimit', -1);
    } else {
      setPromotionFormik.setFieldValue('maximumUserLimit', 0);
    }
    setPromotionFormik.handleChange(e);
  };

  const handleRadioDiscountTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromotionFormik.handleChange(e);
    setPromotionFormik.setFieldValue('discountNominal', 0);
    setPromotionFormik.setFieldValue('discountPercentage', 0);
    setPromotionFormik.setFieldValue('maximumQuotaUnlimited', false);
    setPromotionFormik.setFieldValue('maximumQuota', 0);
    setPromotionFormik.setFieldValue('maximumUserLimitUnlimited', false);
    setPromotionFormik.setFieldValue('maximumUserLimit', 0);
  };

  return (
    <Modal open={open} onClickBackdrop={handleClose} className='max-w-2xl'>
      <Button
        size='sm'
        shape='circle'
        color='ghost'
        className='absolute right-2 top-2'
        onClick={handleClose}
      >
        <CgClose className='text-lg' />
      </Button>
      <Modal.Header className='text-center font-bold text-primary'>
        Set Promotion
      </Modal.Header>
      <Modal.Body>
        <div className='flex flex-row items-center md:gap-2'>
          <Zoom>
            <Image
              className='w-16 rounded-lg hidden md:block'
              src={product.product_image}
              alt={product.product_name}
            />
          </Zoom>
          <div className='flex flex-col'>
            <span className='font-bold w-48 md:w-96 truncate'>
              {product.product_name}
            </span>
            <span className='font-bold text-sm text-secondary w-48 md:w-96 truncate'>
              {product.price_min === product.price_max
                ? toRupiah(product.price_max)
                : `${toRupiah(product.price_min)} - ${toRupiah(
                    product.price_max
                  )}`}
            </span>
          </div>
        </div>
        <Divider />
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setPromotionFormik.handleSubmit(e);
          }}
        >
          <div className='flex flex-col gap-7'>
            <h5 className='font-bold text-xl'>Promotion Settings</h5>
            <div className='flex flex-col gap-8 overflow-y-auto md:max-h-96'>
              <div className='grid grid-cols-7 items-start gap-4'>
                <Form.Label title='Discount Type' className='col-span-1 p-0' />
                <div className='flex flex-col gap-1 col-span-6'>
                  <div className='flex gap-5'>
                    <label className='flex flex-row gap-2 items-center cursor-pointer'>
                      <Radio
                        size='sm'
                        color='primary'
                        name='discountType'
                        value={DISCOUNT_TYPE.NOMINAL}
                        checked={
                          setPromotionFormik.values.discountType ===
                          DISCOUNT_TYPE.NOMINAL
                        }
                        onChange={handleRadioDiscountTypeChange}
                      />
                      <span className='text-sm'>{DISCOUNT_TYPE.NOMINAL}</span>
                    </label>
                    <label className='flex flex-row gap-2 items-center cursor-pointer'>
                      <Radio
                        size='sm'
                        color='primary'
                        name='discountType'
                        value={DISCOUNT_TYPE.PERCENTAGE}
                        checked={
                          setPromotionFormik.values.discountType ===
                          DISCOUNT_TYPE.PERCENTAGE
                        }
                        onChange={handleRadioDiscountTypeChange}
                      />
                      <span className='text-sm'>
                        {DISCOUNT_TYPE.PERCENTAGE}
                      </span>
                    </label>
                  </div>
                  {setPromotionFormik.touched.discountType &&
                    setPromotionFormik.errors.discountType && (
                      <label className='label-text-alt text-error'>
                        {setPromotionFormik.errors.discountType}
                      </label>
                    )}
                </div>
              </div>
              {setPromotionFormik.values.discountType ===
              DISCOUNT_TYPE.NOMINAL ? (
                <div className='flex flex-col gap-8'>
                  <div className='grid grid-cols-7 items-center gap-4'>
                    <Form.Label
                      title='Discount Nominal'
                      className='col-span-1 p-0'
                    />
                    <div className='flex flex-col gap-1 col-span-6'>
                      <InputGroup>
                        <span className='text-sm font-bold'>Rp</span>
                        <Input
                          type='number'
                          name='discountNominal'
                          placeholder='Discount nominal'
                          className='w-full'
                          value={setPromotionFormik.values.discountNominal}
                          onChange={handleInputDiscountNominalChange}
                          onKeyDown={handleNumberInvalidKey}
                        />
                      </InputGroup>
                      {setPromotionFormik.touched.discountNominal &&
                        setPromotionFormik.errors.discountNominal && (
                          <label className='label-text-alt text-error'>
                            {setPromotionFormik.errors.discountNominal}
                          </label>
                        )}
                    </div>
                  </div>
                  <div className='grid grid-cols-7 items-center gap-4'>
                    <Form.Label
                      title='Unlimited Quota'
                      className='col-span-1 p-0'
                    />
                    <div className='flex flex-col gap-1 col-span-6'>
                      <Toggle
                        name='maximumQuotaUnlimited'
                        checked={
                          setPromotionFormik.values.maximumQuotaUnlimited
                        }
                        onChange={handleInputMaximumQuotaUnlimitedChange}
                      />
                      {setPromotionFormik.touched.maximumQuota &&
                        setPromotionFormik.errors.maximumQuota && (
                          <label className='label-text-alt text-error'>
                            {setPromotionFormik.errors.maximumQuota}
                          </label>
                        )}
                    </div>
                  </div>
                  {!setPromotionFormik.values.maximumQuotaUnlimited && (
                    <div className='grid grid-cols-7 items-center gap-4'>
                      <Form.Label title='Quota' className='col-span-1 p-0' />
                      <div className='flex flex-col gap-1 col-span-6'>
                        <Input
                          type='number'
                          name='maximumQuota'
                          placeholder='Quota'
                          className='w-full'
                          value={
                            setPromotionFormik.values.maximumQuotaUnlimited
                              ? ''
                              : setPromotionFormik.values.maximumQuota
                          }
                          onChange={handleInputMaximumQuotaChange}
                          onKeyDown={handleNumberInvalidKey}
                        />
                        {setPromotionFormik.touched.maximumQuota &&
                          setPromotionFormik.errors.maximumQuota && (
                            <label className='label-text-alt text-error'>
                              {setPromotionFormik.errors.maximumQuota}
                            </label>
                          )}
                      </div>
                    </div>
                  )}
                  <div className='grid grid-cols-7 items-center gap-4'>
                    <Form.Label
                      title='Unlimited User Limit'
                      className='col-span-1 p-0'
                    />
                    <div className='flex flex-col gap-1 col-span-6'>
                      <Toggle
                        name='maximumUserLimitUnlimited'
                        checked={
                          setPromotionFormik.values.maximumUserLimitUnlimited
                        }
                        onChange={handleInputMaximumUserLimitUnlimitedChange}
                      />
                      {setPromotionFormik.touched.maximumQuota &&
                        setPromotionFormik.errors.maximumQuota && (
                          <label className='label-text-alt text-error'>
                            {setPromotionFormik.errors.maximumQuota}
                          </label>
                        )}
                    </div>
                  </div>
                  {!setPromotionFormik.values.maximumUserLimitUnlimited && (
                    <div className='grid grid-cols-7 items-center gap-4'>
                      <Form.Label
                        title='User Limit'
                        className='col-span-1 p-0'
                      />
                      <div className='flex flex-col gap-1 col-span-6'>
                        <Input
                          type='number'
                          name='maximumUserLimit'
                          placeholder='User Limit'
                          className='w-full'
                          value={
                            setPromotionFormik.values.maximumUserLimitUnlimited
                              ? ''
                              : setPromotionFormik.values.maximumUserLimit
                          }
                          onChange={handleInputMaximumUserLimitChange}
                          onKeyDown={handleNumberInvalidKey}
                        />
                        {setPromotionFormik.touched.maximumUserLimit &&
                          setPromotionFormik.errors.maximumUserLimit && (
                            <label className='label-text-alt text-error'>
                              {setPromotionFormik.errors.maximumUserLimit}
                            </label>
                          )}
                      </div>
                    </div>
                  )}
                  {!setPromotionFormik.values.maximumQuotaUnlimited && (
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
                        {toRupiah(
                          setPromotionFormik.values.discountNominal *
                            setPromotionFormik.values.maximumQuota
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex flex-col gap-8'>
                  <div className='grid grid-cols-7 items-center gap-4'>
                    <Form.Label
                      title='Discount Percentage'
                      className='col-span-1 p-0'
                    />
                    <div className='flex flex-col gap-1 col-span-6'>
                      <InputGroup>
                        <Input
                          type='number'
                          name='discountPercentage'
                          placeholder='Discount percentage'
                          className='w-full'
                          value={setPromotionFormik.values.discountPercentage}
                          onChange={handleInputDiscountPercentageChange}
                          onKeyDown={handleNumberInvalidKey}
                        />
                        <span className='text-sm font-bold'>%</span>
                      </InputGroup>
                      {setPromotionFormik.touched.discountPercentage &&
                        setPromotionFormik.errors.discountPercentage && (
                          <label className='label-text-alt text-error'>
                            {setPromotionFormik.errors.discountPercentage}
                          </label>
                        )}
                    </div>
                  </div>
                  <div className='grid grid-cols-7 items-center gap-4'>
                    <Form.Label
                      title='Maximum Discount'
                      className='col-span-1 p-0'
                    />
                    <div className='flex flex-col gap-1 col-span-6'>
                      <InputGroup>
                        <span className='text-sm font-bold'>Rp</span>
                        <Input
                          type='number'
                          name='maximumDiscountAmount'
                          placeholder='Maximum discount'
                          className='w-full'
                          value={
                            setPromotionFormik.values.maximumDiscountAmount
                          }
                          onChange={handleInputMaximumDiscountChange}
                          onKeyDown={handleNumberInvalidKey}
                        />
                      </InputGroup>
                      {setPromotionFormik.touched.maximumDiscountAmount &&
                        setPromotionFormik.errors.maximumDiscountAmount && (
                          <label className='label-text-alt text-error'>
                            {setPromotionFormik.errors.maximumDiscountAmount}
                          </label>
                        )}
                    </div>
                  </div>
                  <div className='grid grid-cols-7 items-center gap-4'>
                    <Form.Label
                      title='Unlimited Quota'
                      className='col-span-1 p-0'
                    />
                    <div className='flex flex-col gap-1 col-span-6'>
                      <Toggle
                        name='maximumQuotaUnlimited'
                        checked={
                          setPromotionFormik.values.maximumQuotaUnlimited
                        }
                        onChange={handleInputMaximumQuotaUnlimitedChange}
                      />
                      {setPromotionFormik.touched.maximumQuota &&
                        setPromotionFormik.errors.maximumQuota && (
                          <label className='label-text-alt text-error'>
                            {setPromotionFormik.errors.maximumQuota}
                          </label>
                        )}
                    </div>
                  </div>
                  {!setPromotionFormik.values.maximumQuotaUnlimited && (
                    <div className='grid grid-cols-7 items-center gap-4'>
                      <Form.Label title='Quota' className='col-span-1 p-0' />
                      <div className='flex flex-col gap-1 col-span-6'>
                        <Input
                          type='number'
                          name='maximumQuota'
                          placeholder='Quota'
                          className='w-full'
                          value={
                            setPromotionFormik.values.maximumQuotaUnlimited
                              ? ''
                              : setPromotionFormik.values.maximumQuota
                          }
                          onChange={handleInputMaximumQuotaChange}
                          onKeyDown={handleNumberInvalidKey}
                        />
                        {setPromotionFormik.touched.maximumQuota &&
                          setPromotionFormik.errors.maximumQuota && (
                            <label className='label-text-alt text-error'>
                              {setPromotionFormik.errors.maximumQuota}
                            </label>
                          )}
                      </div>
                    </div>
                  )}
                  <div className='grid grid-cols-7 items-center gap-4'>
                    <Form.Label
                      title='Unlimited User Limit'
                      className='col-span-1 p-0'
                    />
                    <div className='flex flex-col gap-1 col-span-6'>
                      <Toggle
                        name='maximumUserLimitUnlimited'
                        checked={
                          setPromotionFormik.values.maximumUserLimitUnlimited
                        }
                        onChange={handleInputMaximumUserLimitUnlimitedChange}
                      />
                      {setPromotionFormik.touched.maximumQuota &&
                        setPromotionFormik.errors.maximumQuota && (
                          <label className='label-text-alt text-error'>
                            {setPromotionFormik.errors.maximumQuota}
                          </label>
                        )}
                    </div>
                  </div>
                  {!setPromotionFormik.values.maximumUserLimitUnlimited && (
                    <div className='grid grid-cols-7 items-center gap-4'>
                      <Form.Label
                        title='User Limit'
                        className='col-span-1 p-0'
                      />
                      <div className='flex flex-col gap-1 col-span-6'>
                        <Input
                          type='number'
                          name='maximumUserLimit'
                          placeholder='User Limit'
                          className='w-full'
                          value={
                            setPromotionFormik.values.maximumUserLimitUnlimited
                              ? ''
                              : setPromotionFormik.values.maximumUserLimit
                          }
                          onChange={handleInputMaximumUserLimitChange}
                          onKeyDown={handleNumberInvalidKey}
                        />
                        {setPromotionFormik.touched.maximumUserLimit &&
                          setPromotionFormik.errors.maximumUserLimit && (
                            <label className='label-text-alt text-error'>
                              {setPromotionFormik.errors.maximumUserLimit}
                            </label>
                          )}
                      </div>
                    </div>
                  )}
                  {!setPromotionFormik.values.maximumQuotaUnlimited && (
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
                        {toRupiah(
                          setPromotionFormik.values.maximumDiscountAmount *
                            setPromotionFormik.values.maximumQuota
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Actions>
        <Button type='button' onClick={handleClose}>
          Cancel
        </Button>
        <Button
          form='setPromotionForm'
          type='button'
          color='primary'
          onClick={handleConfirmClick}
        >
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PromotionModal;
