import {
  useCreateAddressMutation,
  useGetAddressesQuery,
} from '../../../store/services/addressService';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Link,
  Modal,
  Textarea,
} from 'react-daisyui';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useCreateMerchantMutation } from '../../../store/services/merchantService';
import { useFormik } from 'formik';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { BsShop } from 'react-icons/bs';
import { ChangeEvent, useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { toCreateAddress, toSubDistrictQuery } from '../../../utils/mapperDTO';
import {
  CityResponse,
  CreateAddressResponse,
  DistrictResponse,
  ProvinceResponse,
  SubDistrictResponse,
} from '../../../types/response';
import { useLazyGetSubDistrictsQuery } from '../../../store/services/subDistrictService';
import { SubDistrictQuery } from '../../../types/query';
import { Image } from '../../../components/common';

const SellerRegistration = () => {
  const { data: getAddressesData } = useGetAddressesQuery();
  const [registerMerchant] = useCreateMerchantMutation();
  const [createAddress, { isLoading: createAddressIsLoading }] =
    useCreateAddressMutation();
  const [getSubDistrict] = useLazyGetSubDistrictsQuery();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [acceptTermsAndCondition, setAcceptTermsAndCondition] =
    useState<boolean>(false);
  const [subDistrictQuery, setSubDistrictQuery] = useState<SubDistrictQuery>({
    province: '',
    city: '',
    district: '',
  });
  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [districts, setDistricts] = useState<DistrictResponse[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrictResponse[]>([]);

  useEffect(() => {
    getSubDistrict(toSubDistrictQuery(subDistrictQuery))
      .unwrap()
      .then((res) => {
        setProvinces(res.data?.provinces ? res.data.provinces : []);
        setCities(res.data?.cities ? res.data.cities : []);
        setDistricts(res.data?.districts ? res.data.districts : []);
        setSubDistricts(res.data?.sub_districts ? res.data.sub_districts : []);
      });
  }, [subDistrictQuery]);

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSubDistrictQuery({
      province: e.target.value,
      city: '',
      district: '',
    });

    addressFormik.setFieldValue('province', e.target.value);
    addressFormik.setFieldValue('city', '');
    addressFormik.setFieldValue('district', '');
    addressFormik.handleChange(e);
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSubDistrictQuery({
      ...subDistrictQuery,
      city: e.target.value,
      district: '',
    });

    addressFormik.setFieldValue('city', e.target.value);
    addressFormik.setFieldValue('district', '');
    addressFormik.handleChange(e);
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSubDistrictQuery({
      ...subDistrictQuery,
      district: e.target.value,
    });

    addressFormik.setFieldValue('district', e.target.value);
    addressFormik.handleChange(e);
  };

  const handleTermsAndConditionsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAcceptTermsAndCondition(Boolean(e.target.checked));
  };

  const charsRegex = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;

  const shopFormik = useFormik({
    initialValues: {
      shopName: '',
      shopAddressID: '',
    },
    validationSchema: Yup.object({
      shopName: Yup.string()
        .matches(charsRegex, 'Should not contain special characters')
        .required('Please enter your shop name'),
      shopAddressID: Yup.string().required('Please select your shop address'),
    }),
    onSubmit: (values, { setFieldValue }) => {
      const { shopName, shopAddressID } = values;

      registerMerchant({
        name: shopName,
        address_id: shopAddressID,
      })
        .unwrap()
        .then(() => {
          notifySuccessToast('Your shop successfully registered!', true);
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        })
        .catch(() => {
          setFieldValue('name', '');
          setFieldValue('addressID', '');
          notifyErrorToast('Shop registration failed, please try again!');
        });
    },
  });

  const addressFormik = useFormik({
    initialValues: {
      name: '',
      detail: '',
      provinceID: '',
      cityID: '',
      districtID: '',
      subDistrictID: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please enter adress name'),
      detail: Yup.string().required('Please enter address detail'),
      provinceID: Yup.string().required('Please enter address province'),
      cityID: Yup.string().required('Please enter address city'),
      districtID: Yup.string().required('Please enter address district'),
      subDistrictID: Yup.string().required('Please enter address sub-district'),
    }),
    onSubmit: (values) => {
      createAddress(
        toCreateAddress(values.name, values.detail, values.subDistrictID)
      )
        .unwrap()
        .then(() => {
          notifySuccessToast('Address has been created!');
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as CreateAddressResponse;

            notifyErrorToast(response.message);
          }
        })
        .finally(() => handleModalClose());
    },
  });

  const handleAddressClick = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className='container mx-auto max-w-6xl'>
      <div className='px-4 py-10'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 md:col-span-6 flex items-center'>
            <div className='flex justify-center'>
              <Image
                src={require('../../../assets/images/register-shop.gif')}
                alt='Logo'
              />
            </div>
          </div>
          <div className='col-span-12 md:col-span-6'>
            <Card className='shadow'>
              <Card.Body>
                <span className='flex flex-row items-center gap-2 text-xl font-bold justify-center'>
                  <BsShop className='text-xl' />
                  Register your Shop
                </span>
                <Divider />
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    shopFormik.handleSubmit(e);
                  }}
                >
                  <div className='flex flex-col w-full mb-6'>
                    <Form.Label title='Shop Name'></Form.Label>
                    <Input
                      name='shopName'
                      value={shopFormik.values.shopName}
                      onChange={shopFormik.handleChange}
                      placeholder='Shop Name'
                      type='text'
                    />
                    {shopFormik.touched.shopName &&
                      shopFormik.errors.shopName && (
                        <label className='label-text-alt text-error'>
                          {shopFormik.errors.shopName}
                        </label>
                      )}
                  </div>
                  <div className='flex flex-col w-full mb-12'>
                    <Form.Label title='Shop Address'></Form.Label>
                    <select
                      name='shopAddressID'
                      value={shopFormik.values.shopAddressID}
                      onChange={shopFormik.handleChange}
                      className='select select-bordered'
                    >
                      <option value='' disabled>
                        Shop Address
                      </option>
                      {getAddressesData?.data &&
                        getAddressesData.data.map(({ id, name }) => (
                          <option value={id} key={id}>
                            {name}
                          </option>
                        ))}
                    </select>
                    {shopFormik.touched.shopAddressID &&
                      shopFormik.errors.shopAddressID && (
                        <label className='label-text-alt text-error'>
                          {shopFormik.errors.shopAddressID}
                        </label>
                      )}
                    <Link
                      className='mt-2 text-sm hover:no-underline'
                      color='primary'
                      onClick={handleAddressClick}
                    >
                      Don&apos;t see your address?
                    </Link>
                  </div>
                  <div className='flex gap-3 items-center'>
                    <Checkbox
                      color='primary'
                      checked={acceptTermsAndCondition}
                      onChange={handleTermsAndConditionsChange}
                    ></Checkbox>
                    <div className='text-sm'>
                      <span>I agree to the </span>
                      <span className='text-primary cursor-pointer font-bold'>
                        Terms &amp; Conditions
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row gap-1 mt-4 md:mt-6 justify-end'>
                    <Button
                      className='w-full md:w-fit'
                      onClick={handleBackClick}
                    >
                      Back
                    </Button>
                    <Button
                      className='w-full md:w-fit'
                      color='primary'
                      type='submit'
                      disabled={!acceptTermsAndCondition}
                    >
                      Confirm
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        responsive
        className='max-w-sm'
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
          Add Address
        </Modal.Header>
        <Modal.Body>
          <Form
            id='addAddressForm'
            className='grid grid-cols-12 gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              addressFormik.handleSubmit();
            }}
          >
            <div className='col-span-12'>
              <Form.Label title='Name' />
              <Input
                name='name'
                className='w-full'
                required
                value={addressFormik.values.name}
                onChange={addressFormik.handleChange}
              />
              {addressFormik.touched.name && addressFormik.errors.name && (
                <label className='label-text-alt text-error'>
                  {addressFormik.errors.name}
                </label>
              )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='Province' />
              <select
                name='provinceID'
                className='select select-bordered font-normal w-full'
                required
                value={addressFormik.values.provinceID}
                onChange={handleProvinceChange}
              >
                <option value='' disabled>
                  Province
                </option>
                {provinces.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </select>
              {addressFormik.touched.provinceID &&
                addressFormik.errors.provinceID && (
                  <label className='label-text-alt text-error'>
                    {addressFormik.errors.provinceID}
                  </label>
                )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='City' />
              <select
                name='cityID'
                className='select select-bordered font-normal w-full'
                required
                value={addressFormik.values.cityID}
                onChange={handleCityChange}
                disabled={!addressFormik.values.provinceID}
              >
                <option value='' disabled>
                  City
                </option>
                {cities.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </select>
              {addressFormik.touched.cityID && addressFormik.errors.cityID && (
                <label className='label-text-alt text-error'>
                  {addressFormik.errors.cityID}
                </label>
              )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='District' />
              <select
                name='districtID'
                className='select select-bordered font-normal w-full'
                required
                value={addressFormik.values.districtID}
                onChange={handleDistrictChange}
                disabled={!addressFormik.values.cityID}
              >
                <option value='' disabled>
                  District
                </option>
                {districts.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </select>
              {addressFormik.touched.subDistrictID &&
                addressFormik.errors.subDistrictID && (
                  <label className='label-text-alt text-error'>
                    {addressFormik.errors.subDistrictID}
                  </label>
                )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='Sub-District' />
              <select
                name='subDistrictID'
                className='select select-bordered font-normal w-full'
                required
                value={addressFormik.values.subDistrictID}
                onChange={addressFormik.handleChange}
                disabled={!addressFormik.values.districtID}
              >
                <option value='' disabled>
                  Sub-District
                </option>
                {subDistricts.map(({ id, name, zip_code }) => (
                  <option value={id} key={id}>
                    {name} - {zip_code}
                  </option>
                ))}
              </select>
              {addressFormik.touched.subDistrictID &&
                addressFormik.errors.subDistrictID && (
                  <label className='label-text-alt text-error'>
                    {addressFormik.errors.subDistrictID}
                  </label>
                )}
            </div>
            <div className='col-span-12'>
              <Form.Label title='Detail' />
              <Textarea
                name='detail'
                className='w-full'
                required
                value={addressFormik.values.detail}
                onChange={addressFormik.handleChange}
              />
              {addressFormik.touched.detail && addressFormik.errors.detail && (
                <label className='label-text-alt text-error'>
                  {addressFormik.errors.detail}
                </label>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Actions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button
            color='primary'
            type='submit'
            form='addAddressForm'
            loading={createAddressIsLoading}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default SellerRegistration;
