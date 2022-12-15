import { useFormik } from 'formik';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputGroup,
  Modal,
  Textarea,
  Tooltip,
} from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import {
  HiCheck,
  HiLocationMarker,
  HiPencil,
  HiPlus,
  HiPhone,
  HiSearch,
  HiTrash,
} from 'react-icons/hi';
import * as Yup from 'yup';
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useLazyGetAddressQuery,
  useSetAddressDefaultMutation,
  useSetShopAddressMutation,
  useUpdateAddressMutation,
} from '../../../store/services/addressService';
import {
  CityResponse,
  CreateAddressResponse,
  DistrictResponse,
  ProvinceResponse,
  SubDistrictResponse,
  UpdateAddressResponse,
  UpdateMerchantResponse,
} from '../../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { selectRole } from '../../../store/slices/authSlice';
import { useAppSelector } from '../../../store/store';
import { ConfirmationModal } from '../../common';
import { validateUserRole } from '../../../utils/auth';
import { Role } from '../../../types/role';
import { useLazyGetSubDistrictsQuery } from '../../../store/services/subDistrictService';
import { toCreateAddress, toSubDistrictQuery } from '../../../utils/mapperDTO';
import { SubDistrictQuery } from '../../../types/query';
import NoData from '../../common/NoData';

type OpenAddressModal = {
  add: boolean;
  edit: boolean;
  delete: boolean;
  default: boolean;
  shopAddress: boolean;
};

const AddressContent = () => {
  const roleCode = useAppSelector(selectRole);
  const role = validateUserRole(roleCode);

  const { data: getAddressesData, isLoading: getAddressesIsLoading } =
    useGetAddressesQuery();
  const [getAddress] = useLazyGetAddressQuery();
  const [createAddress, { isLoading: createAddressIsLoading }] =
    useCreateAddressMutation();
  const [updateAddress, { isLoading: updateAddressIsLoading }] =
    useUpdateAddressMutation();
  const [
    deleteAddress,
    { isLoading: deleteAddressIsLoading, error: deleteAddressError },
  ] = useDeleteAddressMutation();
  const [
    setAddressDefault,
    { isLoading: setAddressDefaultIsLoading, error: setAddressDefaultError },
  ] = useSetAddressDefaultMutation();
  const [
    setShopAddress,
    { isLoading: setShopAddressIsLoading, error: setShopAddressError },
  ] = useSetShopAddressMutation();
  const [getSubDistrict] = useLazyGetSubDistrictsQuery();
  const [addressID, setAddressID] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<OpenAddressModal>({
    add: false,
    edit: false,
    delete: false,
    default: false,
    shopAddress: false,
  });
  const [search, setSearch] = useState<string>('');
  const [subDistrictQuery, setSubDistrictQuery] = useState<SubDistrictQuery>({
    province: '',
    city: '',
    district: '',
  });
  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [districts, setDistricts] = useState<DistrictResponse[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrictResponse[]>([]);

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
      if (openModal.add) {
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
      } else if (openModal.edit) {
        if (!addressID) {
          return;
        }

        updateAddress({
          id: addressID,
          request: toCreateAddress(
            values.name,
            values.detail,
            values.subDistrictID
          ),
        })
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
      }
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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearch(search);
  };

  const handleSearchClick = () => {
    setSearch(search);
  };

  const handleAddAddressClick = () => {
    setOpenModal({
      add: true,
      edit: false,
      delete: false,
      default: false,
      shopAddress: false,
    });
    setAddressID(null);
  };

  const handleEditAddressClick = (id: string) => {
    getAddress(id)
      .unwrap()
      .then((res) => {
        if (!res.data) {
          return;
        }
        setSubDistrictQuery({
          province: String(res.data.province_id),
          city: String(res.data.city_id),
          district: String(res.data.district_id),
        });
        addressFormik.setValues({
          name: res.data.name,
          detail: res.data.detail,
          provinceID: String(res.data.province_id),
          cityID: String(res.data.city_id),
          districtID: String(res.data.district_id),
          subDistrictID: String(res.data.sub_district_id),
        });
        setOpenModal({
          add: false,
          edit: true,
          delete: false,
          default: false,
          shopAddress: false,
        });
        setAddressID(id);
      });
  };

  const handleDeleteAddressClick = (id: string) => {
    setOpenModal({
      add: false,
      edit: false,
      delete: true,
      default: false,
      shopAddress: false,
    });
    setAddressID(id);
  };

  const handleSetAddressAsDefaultClick = (id: string) => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: true,
      shopAddress: false,
    });
    setAddressID(id);
  };

  const handleSetShopAddressClick = (id: string) => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: false,
      shopAddress: true,
    });
    setAddressID(id);
  };

  const handleModalClose = () => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: false,
      shopAddress: false,
    });
    setAddressID(null);
    setSubDistrictQuery({
      province: '',
      city: '',
      district: '',
    });
    addressFormik.setValues({
      name: '',
      detail: '',
      provinceID: '',
      cityID: '',
      districtID: '',
      subDistrictID: '',
    });
    addressFormik.setTouched({
      name: false,
      detail: false,
      provinceID: false,
      cityID: false,
      districtID: false,
      subDistrictID: false,
    });
  };

  const handleDeleteAddress = () => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: false,
      shopAddress: false,
    });
    if (!addressID) {
      return;
    }
    deleteAddress(addressID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Address has been deleted!');
      })
      .finally(() => {
        setAddressID(null);
        if (deleteAddressError && 'data' in deleteAddressError) {
          const response = deleteAddressError.data as UpdateAddressResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  const handleSetAddressDefault = () => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: false,
      shopAddress: false,
    });

    if (!addressID) {
      return;
    }

    setAddressDefault(addressID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Default address has been changed!');
      })
      .finally(() => {
        setAddressID(null);

        if (setAddressDefaultError && 'data' in setAddressDefaultError) {
          const response = setAddressDefaultError.data as UpdateAddressResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  const handleSetShopAddress = () => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: false,
      shopAddress: false,
    });

    if (!addressID) {
      return;
    }

    setShopAddress(addressID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Shop address has been changed!');
      })
      .finally(() => {
        setAddressID(null);

        if (setShopAddressError && 'data' in setShopAddressError) {
          const response = setShopAddressError.data as UpdateMerchantResponse;

          notifyErrorToast(response.message);
        }
      });
  };

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

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Address</h5>
      <Divider />
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
        <Button
          className='w-full md:w-auto'
          startIcon={<HiPlus className='text-xl' />}
          color='primary'
          onClick={handleAddAddressClick}
        >
          Address
        </Button>
      </div>
      <div className='grid grid-cols-12 gap-4'>
        {getAddressesIsLoading && (
          <Card className='col-span-12 shadow animate-pulse'>
            <div className='p-4'>
              <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
              <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
              <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
              <Divider />
              <div className='h-4 bg-base-200 w-1/5 rounded-full'></div>
            </div>
          </Card>
        )}
        {getAddressesData?.data && getAddressesData.data.length > 0 ? (
          getAddressesData.data
            .filter(({ name }) =>
              name.toLowerCase().includes(search.toLowerCase())
            )
            .map(
              ({
                id,
                phone_number,
                name,
                detail,
                is_default,
                is_shop_address,
              }) =>
                is_default ? (
                  <Card
                    className='col-span-12 shadow border-r-0 border-b-4 md:border-r-8 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                    key={id}
                  >
                    <div className='p-4'>
                      <div className='flex items-center mb-2.5'>
                        <h5 className='text-xl font-medium'>
                          {name}
                          <Badge color='secondary' className='ml-2.5'>
                            Default
                          </Badge>
                          {is_shop_address ? (
                            <Badge color='accent' className='ml-2.5'>
                              Pickup Address
                            </Badge>
                          ) : null}
                        </h5>
                      </div>
                      <div className='flex items-center mb-2.5'>
                        <Tooltip message='Phone Number' color='info'>
                          <HiPhone className='text-info text-xl mr-2.5' />
                        </Tooltip>
                        <span>{phone_number}</span>
                      </div>
                      <div className='flex items-center mb-4'>
                        <Tooltip message='Location' color='accent'>
                          <HiLocationMarker className='text-accent text-xl mr-2.5' />
                        </Tooltip>
                        <span className='line-clamp-3 md:line-clamp-1'>
                          {detail}
                        </span>
                      </div>
                      <Divider />
                      <Card.Actions>
                        <Button
                          variant='outline'
                          size='sm'
                          color='ghost'
                          className='normal-case font-medium w-full md:w-auto'
                          startIcon={<HiPencil />}
                          onClick={() => handleEditAddressClick(id)}
                        >
                          Edit
                        </Button>
                        {role === Role.Seller && !is_shop_address ? (
                          <Button
                            size='sm'
                            color='accent'
                            className='normal-case font-medium w-full md:w-auto'
                            startIcon={<HiCheck />}
                            onClick={() => handleSetShopAddressClick(id)}
                          >
                            Set as Shop Pickup Address
                          </Button>
                        ) : null}
                      </Card.Actions>
                    </div>
                  </Card>
                ) : (
                  <Card
                    className='col-span-12 border-r-0 border-b-4 md:border-r-8 md:border-b-0 border-r-primary border-b-primary shadow transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                    key={id}
                  >
                    <div className='p-4'>
                      <div className='flex items-center mb-2.5'>
                        <h5 className='text-xl font-medium'>{name}</h5>
                        {is_shop_address ? (
                          <Badge color='accent' className='ml-2.5'>
                            Pickup Address
                          </Badge>
                        ) : null}
                      </div>
                      <div className='flex items-center mb-2.5'>
                        <Tooltip message='Phone Number' color='info'>
                          <HiPhone className='text-info text-xl mr-2.5' />
                        </Tooltip>
                        <span>{phone_number}</span>
                      </div>
                      <div className='flex items-center mb-4'>
                        <Tooltip message='Location' color='accent'>
                          <HiLocationMarker className='text-accent text-xl mr-2.5' />
                        </Tooltip>
                        <span className='line-clamp-3 md:line-clamp-1'>
                          {detail}
                        </span>
                      </div>
                      <Divider />
                      <Card.Actions>
                        <Button
                          variant='outline'
                          size='sm'
                          color='ghost'
                          className='normal-case font-medium w-full md:w-auto'
                          startIcon={<HiPencil />}
                          onClick={() => handleEditAddressClick(id)}
                        >
                          Edit
                        </Button>
                        {!is_shop_address ? (
                          <Button
                            variant='outline'
                            size='sm'
                            color='ghost'
                            className='normal-case font-medium w-full md:w-auto'
                            startIcon={<HiTrash />}
                            onClick={() => handleDeleteAddressClick(id)}
                          >
                            Delete
                          </Button>
                        ) : null}
                        <Button
                          size='sm'
                          color='secondary'
                          className='normal-case font-medium w-full md:w-auto'
                          startIcon={<HiCheck />}
                          onClick={() => handleSetAddressAsDefaultClick(id)}
                        >
                          Set as Default
                        </Button>
                        {role === Role.Seller && !is_shop_address ? (
                          <Button
                            size='sm'
                            color='accent'
                            className='normal-case font-medium w-full md:w-auto'
                            startIcon={<HiCheck />}
                            onClick={() => handleSetShopAddressClick(id)}
                          >
                            Set as Shop Pickup Address
                          </Button>
                        ) : null}
                      </Card.Actions>
                    </div>
                  </Card>
                )
            )
        ) : (
          <div className='col-span-12'>
            <NoData
              title='No address?'
              message='Oh no, the couriers would not know where to send your package'
            />
          </div>
        )}
      </div>
      <Modal
        open={openModal.add || openModal.edit}
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
            loading={createAddressIsLoading || updateAddressIsLoading}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
      <ConfirmationModal
        open={openModal.delete}
        title='Are you sure?'
        message='This action cannot be undone.'
        loading={deleteAddressIsLoading}
        onClose={handleModalClose}
        onAccepted={handleDeleteAddress}
      />
      <ConfirmationModal
        open={openModal.default}
        title='Are you sure?'
        message='Your default address will be changed.'
        loading={setAddressDefaultIsLoading}
        onClose={handleModalClose}
        onAccepted={handleSetAddressDefault}
      />
      <ConfirmationModal
        open={openModal.shopAddress}
        title='Are you sure?'
        message='Your shop address will be changed.'
        loading={setShopAddressIsLoading}
        onClose={handleModalClose}
        onAccepted={handleSetShopAddress}
      />
    </div>
  );
};

export default AddressContent;
