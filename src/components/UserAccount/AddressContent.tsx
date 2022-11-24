import { useFormik } from 'formik';
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
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useSetAddressDefaultMutation,
} from '../../store/services/addressService';
import { UpdateAddressResponse } from '../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import { ConfirmationModal } from '../common';

type OpenAddressModal = {
  add: boolean;
  edit: boolean;
  delete: boolean;
  default: boolean;
};

const AddressContent = () => {
  const { data: getAddressesData, isLoading: getAddressesIsLoading } =
    useGetAddressesQuery();
  const [
    deleteAddress,
    { isLoading: deleteAddressIsLoading, error: deleteAddressError },
  ] = useDeleteAddressMutation();
  const [
    setAddressDefault,
    { isLoading: setAddressDefaultIsLoading, error: setAddressDefaultError },
  ] = useSetAddressDefaultMutation();
  const [addressID, setAddressID] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<OpenAddressModal>({
    add: false,
    edit: false,
    delete: false,
    default: false,
  });
  const [search, setSearch] = useState<string>('');

  const addAddressFormik = useFormik({
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
      console.log({ values });
    },
  });

  const editAddressFormik = useFormik({
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
      console.log({ values });
    },
  });

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
    });
    setAddressID(null);
  };

  const handleEditAddressClick = (id: string) => {
    setOpenModal({
      add: false,
      edit: true,
      delete: false,
      default: false,
    });
    setAddressID(id);
  };

  const handleDeleteAddressClick = (id: string) => {
    setOpenModal({
      add: false,
      edit: false,
      delete: true,
      default: false,
    });
    setAddressID(id);
  };

  const handleSetAddressAsDefaultClick = (id: string) => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: true,
    });
    setAddressID(id);
  };

  const handleModalClose = () => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: false,
    });
    setAddressID(null);
  };

  const handleDeleteAddress = () => {
    setOpenModal({
      add: false,
      edit: false,
      delete: false,
      default: false,
    });

    if (!addressID) {
      return;
    }

    deleteAddress(addressID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Address has been deleted!');
      })
      .catch((err) => {
        console.error(err);
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
    });

    if (!addressID) {
      return;
    }

    setAddressDefault(addressID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Default address has been changed!');
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setAddressID(null);

        if (setAddressDefaultError && 'data' in setAddressDefaultError) {
          const response = setAddressDefaultError.data as UpdateAddressResponse;

          notifyErrorToast(response.message);
        }
      });
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
        {getAddressesData?.data &&
          getAddressesData.data
            .filter(({ name }) =>
              name.toLowerCase().includes(search.toLowerCase())
            )
            .map(({ id, user, name, detail, is_default }) =>
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
                      </h5>
                    </div>
                    <div className='flex items-center mb-2.5'>
                      <Tooltip message='Phone Number' color='info'>
                        <HiPhone className='text-info text-xl mr-2.5' />
                      </Tooltip>
                      <span>{user.phone_number}</span>
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
                    </div>
                    <div className='flex items-center mb-2.5'>
                      <Tooltip message='Phone Number' color='info'>
                        <HiPhone className='text-info text-xl mr-2.5' />
                      </Tooltip>
                      <span>{user.phone_number}</span>
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
                      <Button
                        size='sm'
                        color='secondary'
                        className='normal-case font-medium w-full md:w-auto'
                        startIcon={<HiCheck />}
                        onClick={() => handleSetAddressAsDefaultClick(id)}
                      >
                        Set as Default
                      </Button>
                    </Card.Actions>
                  </div>
                </Card>
              )
            )}
      </div>
      <Modal
        open={openModal.add}
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
              addAddressFormik.handleSubmit();
            }}
          >
            <div className='col-span-12'>
              <Form.Label title='Name' />
              <Input
                name='name'
                className='w-full'
                required
                value={addAddressFormik.values.name}
                onChange={addAddressFormik.handleChange}
              />
              {addAddressFormik.touched.name &&
                addAddressFormik.errors.name && (
                  <label className='label-text-alt text-error'>
                    {addAddressFormik.errors.name}
                  </label>
                )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='Province' />
              <select
                name='provinceID'
                className='select select-bordered font-normal w-full'
                required
                value={addAddressFormik.values.provinceID}
                onChange={addAddressFormik.handleChange}
              >
                <option value='' disabled>
                  Province
                </option>
                <option value='TBA'>TBA</option>
              </select>
              {addAddressFormik.touched.provinceID &&
                addAddressFormik.errors.provinceID && (
                  <label className='label-text-alt text-error'>
                    {addAddressFormik.errors.provinceID}
                  </label>
                )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='City' />
              <select
                name='cityID'
                className='select select-bordered font-normal w-full'
                required
                value={addAddressFormik.values.cityID}
                onChange={addAddressFormik.handleChange}
              >
                <option value='' disabled>
                  City
                </option>
                <option value='TBA'>TBA</option>
              </select>
              {addAddressFormik.touched.cityID &&
                addAddressFormik.errors.cityID && (
                  <label className='label-text-alt text-error'>
                    {addAddressFormik.errors.cityID}
                  </label>
                )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='District' />
              <select
                name='districtID'
                className='select select-bordered font-normal w-full'
                required
                value={addAddressFormik.values.districtID}
                onChange={addAddressFormik.handleChange}
              >
                <option value='' disabled>
                  District
                </option>
                <option value='TBA'>TBA</option>
              </select>
              {addAddressFormik.touched.subDistrictID &&
                addAddressFormik.errors.subDistrictID && (
                  <label className='label-text-alt text-error'>
                    {addAddressFormik.errors.subDistrictID}
                  </label>
                )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='Sub-District' />
              <select
                name='subDistrictID'
                className='select select-bordered font-normal w-full'
                required
                value={addAddressFormik.values.subDistrictID}
                onChange={addAddressFormik.handleChange}
              >
                <option value='' disabled>
                  Sub-District
                </option>
                <option value='TBA'>TBA</option>
              </select>
              {addAddressFormik.touched.subDistrictID &&
                addAddressFormik.errors.subDistrictID && (
                  <label className='label-text-alt text-error'>
                    {addAddressFormik.errors.subDistrictID}
                  </label>
                )}
            </div>
            <div className='col-span-12'>
              <Form.Label title='Detail' />
              <Textarea
                name='detail'
                className='w-full'
                required
                value={addAddressFormik.values.detail}
                onChange={addAddressFormik.handleChange}
              />
              {addAddressFormik.touched.detail &&
                addAddressFormik.errors.detail && (
                  <label className='label-text-alt text-error'>
                    {addAddressFormik.errors.detail}
                  </label>
                )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Actions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button color='primary' type='submit' form='addAddressForm'>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
      <ConfirmationModal
        open={openModal.delete}
        title='Are you sure?'
        message='This action cannot be undone.'
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
    </div>
  );
};

export default AddressContent;
