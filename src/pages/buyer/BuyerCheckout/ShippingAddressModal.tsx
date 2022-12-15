import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Divider, Form, Input, Modal, Textarea } from 'react-daisyui';
import { useCreateAddressMutation } from '../../../store/services/addressService';
import { toCreateAddress, toSubDistrictQuery } from '../../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import {
  CityResponse,
  CreateAddressResponse,
  DistrictResponse,
  ProvinceResponse,
  SubDistrictResponse,
} from '../../../types/response';
import { useLazyGetSubDistrictsQuery } from '../../../store/services/subDistrictService';
import { SubDistrictQuery } from '../../../types/query';
import { ChangeEvent, useEffect, useState } from 'react';
import { Address } from '../../../types/component';
import { toPhoneNumber } from '../../../utils/convert';
import { ConfirmationModal } from '../../../components/common';

type ShippingAddressModalProps = {
  addresses: Address[];
  currentShippingAddress: Address;
  open: {
    add: boolean;
    change: boolean;
  };
  onClose: () => void;
  setShippingAddress: (address: Address) => void;
};

const ShippingAddressModal = ({
  addresses,
  currentShippingAddress,
  open,
  onClose,
  setShippingAddress: onChangeShippingAddress,
}: ShippingAddressModalProps) => {
  const [getSubDistrict] = useLazyGetSubDistrictsQuery();
  const [createAddress, { isLoading: createAddressIsLoading }] =
    useCreateAddressMutation();
  const [subDistrictQuery, setSubDistrictQuery] = useState<SubDistrictQuery>({
    province: '',
    city: '',
    district: '',
  });
  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [districts, setDistricts] = useState<DistrictResponse[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrictResponse[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

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

  const handleChangeShippingAddress = () => {
    if (!selectedAddress) return;
    onChangeShippingAddress(selectedAddress);
    setOpenConfirmationModal(false);
    onClose();
  };

  const handleCloseConfirmationModal = () => {
    setOpenConfirmationModal(false);
  };

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
    onSubmit: (values, { setValues, setTouched }) => {
      if (open.add) {
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
          .finally(() => {
            onClose();
            setValues({
              name: '',
              detail: '',
              provinceID: '',
              cityID: '',
              districtID: '',
              subDistrictID: '',
            });
            setTouched({
              name: false,
              detail: false,
              provinceID: false,
              cityID: false,
              districtID: false,
              subDistrictID: false,
            });
          });
      }
      //  else if (open.change) {
      // }
    },
  });

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

  return (
    <>
      <Modal
        open={open.add}
        responsive
        className='max-w-sm'
        onClickBackdrop={onClose}
      >
        <Modal.Header className='mb-4 text-xl text-primary font-bold'>
          Add Address
        </Modal.Header>
        <Modal.Body className='h-96 overflow-y-auto'>
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
          <Button onClick={onClose}>Cancel</Button>
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

      <Modal
        open={open.change}
        responsive
        className='max-w-sm'
        onClickBackdrop={onClose}
      >
        <Modal.Header className='mb-4 text-xl text-primary font-bold'>
          Change Address
        </Modal.Header>
        <Modal.Body>
          {addresses.map((address, index) => (
            <>
              {index > 0 && <Divider />}
              <div
                key={address.id}
                className={`p-4 rounded-3xl cursor-pointer ${
                  currentShippingAddress.id === address.id
                    ? 'bg-primary/10 border border-primary active:bg-primary/20'
                    : 'hover:bg-primary/20 active:bg-primary/10'
                }`}
                onClick={
                  currentShippingAddress.id === address.id
                    ? onClose
                    : () => {
                        setSelectedAddress(address);
                        setOpenConfirmationModal(true);
                      }
                }
              >
                <h3 className='font-bold'>{address.name}</h3>
                <div>
                  <p>{toPhoneNumber(address.phone_number as string)}</p>
                  <p>{`${address.sub_district}, ${address.district}, ${address.city}, ${address.province} ${address.zip_code}`}</p>
                </div>
              </div>
            </>
          ))}
        </Modal.Body>
        <ConfirmationModal
          open={openConfirmationModal}
          title='Change shipping address?'
          message=''
          onClose={handleCloseConfirmationModal}
          onAccepted={handleChangeShippingAddress}
        />
      </Modal>
    </>
  );
};

export default ShippingAddressModal;
