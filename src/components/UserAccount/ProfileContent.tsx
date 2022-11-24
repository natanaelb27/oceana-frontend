import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import { Button, Card, Divider, Form, Input, Modal } from 'react-daisyui';
import * as Yup from 'yup';
import { CgClose } from 'react-icons/cg';

import {
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from '../../store/services/profileService';
import { Profile } from '../../types/component';
import {
  toUpdateProfileImageRequest,
  toUpdateProfileRequest,
} from '../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import { UpdateProfileResponse } from '../../types/response';

type ProfileContentProps = {
  profile: Profile | null | undefined;
};

type OpenProfileModal = {
  editProfile: boolean;
  editEmail: boolean;
};

const ProfileContent = ({ profile }: ProfileContentProps) => {
  const [openModal, setOpenModal] = useState<OpenProfileModal>({
    editProfile: false,
    editEmail: false,
  });
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const [
    updateProfile,
    { isLoading: updateProfileIsLoading, error: updateProfileError },
  ] = useUpdateProfileMutation();
  const [
    updateProfileImage,
    { isLoading: updateProfileImageIsLoading, error: updateProfileImageError },
  ] = useUpdateProfileImageMutation();

  const editProfileFormik = useFormik({
    initialValues: {
      fullName: '',
      birthdate: '',
      gender: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Please enter your full name'),
      birthdate: Yup.string().required('Please enter your birthdate'),
      gender: Yup.string().required('Please enter your gender'),
    }),
    onSubmit: (values) => {
      const { fullName, birthdate, gender } = values;

      updateProfile(toUpdateProfileRequest(fullName, birthdate, gender))
        .unwrap()
        .then(() => {
          notifySuccessToast('Profile updated!');
          setOpenModal({ editProfile: false, editEmail: false });
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          if (updateProfileError && 'data' in updateProfileError) {
            const response = updateProfileError.data as UpdateProfileResponse;

            notifyErrorToast(response.message);
          }
        });
    },
  });

  const editEmailFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please enter your email'),
    }),
    onSubmit: (values) => {
      const { email } = values;

      console.log({ email });
    },
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    editProfileFormik.setFieldValue('fullName', profile.full_name);
    editProfileFormik.setFieldValue(
      'birthdate',
      profile.birthdate ? profile.birthdate : ''
    );
    editProfileFormik.setFieldValue(
      'gender',
      profile.gender ? profile.gender : ''
    );
    editEmailFormik.setFieldValue('email', profile.email);
  }, [profile]);

  const handleUploadImageClick = () => {
    photoFileInputRef.current?.click();
  };

  const handleUploadImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files?.[0]) {
      return;
    }

    if (!e.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/)) {
      return;
    }

    updateProfileImage(toUpdateProfileImageRequest(e.target.files[0]))
      .unwrap()
      .then(() => {
        notifySuccessToast('Profile updated!');
        setOpenModal({ editProfile: false, editEmail: false });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (updateProfileImageError && 'data' in updateProfileImageError) {
          const response =
            updateProfileImageError.data as UpdateProfileResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  const handleEditProfileClick = () => {
    setOpenModal({
      editProfile: true,
      editEmail: false,
    });
  };

  const handleEditEmailClick = () => {
    setOpenModal({
      editProfile: false,
      editEmail: true,
    });
  };

  const handleModalClose = () => {
    setOpenModal({
      editProfile: false,
      editEmail: false,
    });
  };

  if (!profile) {
    return (
      <div className='p-4 md:p-10 animate-pulse'>
        <div className='h-6 bg-base-200 rounded-full w-48 max-w-3/5'></div>
        <Divider />
        <div className='grid grid-cols-12 gap-4 md:gap-10'>
          <div className='col-span-12 md:col-span-4'>
            <Card className='shadow max-w-xs'>
              <div className='h-64 w-full bg-base-200 rounded'></div>
              <div className='p-4'>
                <div className='h-12 w-full bg-base-200 rounded-full'></div>
              </div>
            </Card>
          </div>
          <div className='col-span-12 md:col-span-8'>
            <div className='grid grid-col-12 gap-4 mb-10'>
              <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
            </div>
            <div className='grid grid-col-12 gap-4 mb-10'>
              <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { full_name, username, email, phone_number, gender, birthdate, photo } =
    profile;

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Profile</h5>
      <Divider />
      <div className='grid grid-cols-12 gap-4 md:gap-10'>
        <div className='col-span-12 md:col-span-4'>
          <Card className='shadow max-w-xs'>
            <Card.Image
              src={photo ? photo : 'https://picsum.photos/300/300'}
              className='object-cover w-full'
            />
            <div className='p-4'>
              <Button
                className='w-full normal-case font-medium'
                loading={updateProfileImageIsLoading}
                onClick={handleUploadImageClick}
              >
                Choose Image
              </Button>
              <input
                type='file'
                ref={photoFileInputRef}
                onChange={handleUploadImageChange}
                className='hidden'
              />
            </div>
          </Card>
        </div>
        <div className='col-span-12 md:col-span-8'>
          <div className='grid grid-col-12 gap-4 mb-10'>
            <span className='col-span-12 font-medium mb-1'>
              General Information
              <Button
                variant='outline'
                color='secondary'
                size='xs'
                className='ml-2.5 normal-case font-normal'
                onClick={handleEditProfileClick}
              >
                Edit
              </Button>
            </span>
            <span className='col-span-3 text-sm font-light'>Name</span>
            <span className='col-span-9 text-sm'>{full_name}</span>
            <span className='col-span-3 text-sm font-light'>Birthdate</span>
            <span className='col-span-9 text-sm'>
              {birthdate ? moment(birthdate).format('YYYY-MM-DD') : '-'}
            </span>
            <span className='col-span-3 text-sm font-light'>Gender</span>
            <span className='col-span-9 text-sm'>{gender ? gender : '-'}</span>
          </div>
          <div className='grid grid-col-12 gap-4'>
            <span className='col-span-12 font-medium mb-1'>
              Personal Information
            </span>
            <span className='col-span-3 text-sm font-light'>Username</span>
            <span className='col-span-9 text-sm'>
              {username}
              <Button
                variant='outline'
                color='secondary'
                size='xs'
                className='ml-2.5 normal-case font-normal'
              >
                Edit
              </Button>
            </span>
            <span className='col-span-3 text-sm font-light'>Email</span>
            <span className='col-span-9 text-sm'>
              {email}
              <Button
                variant='outline'
                color='secondary'
                size='xs'
                className='ml-2.5 normal-case font-normal'
                onClick={handleEditEmailClick}
              >
                Edit
              </Button>
            </span>
            <span className='col-span-3 text-sm font-light'>Phone No.</span>
            <span className='col-span-9 text-sm'>
              {phone_number}
              <Button
                variant='outline'
                color='secondary'
                size='xs'
                className='ml-2.5 normal-case font-normal'
                disabled
              >
                Edit
              </Button>
            </span>
          </div>
        </div>
      </div>
      <Modal
        open={openModal.editProfile}
        onClickBackdrop={handleModalClose}
        responsive
        className='max-w-sm'
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
          Edit Profile
        </Modal.Header>
        <Modal.Body>
          <Form
            id='editProfileForm'
            className='grid grid-cols-12 gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              editProfileFormik.handleSubmit();
            }}
          >
            <div className='col-span-12'>
              <Form.Label title='Full Name' />
              <Input
                name='fullName'
                className='w-full'
                required
                value={editProfileFormik.values.fullName}
                onChange={editProfileFormik.handleChange}
              />
              {editProfileFormik.touched.fullName &&
                editProfileFormik.errors.fullName && (
                  <label className='label-text-alt text-error'>
                    {editProfileFormik.errors.fullName}
                  </label>
                )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='Birth Date' />
              <Input
                name='birthdate'
                type='date'
                className='w-full'
                required
                value={
                  editProfileFormik.values.birthdate != ''
                    ? moment(editProfileFormik.values.birthdate).format(
                        'YYYY-MM-DD'
                      )
                    : ''
                }
                onChange={editProfileFormik.handleChange}
              />
              {editProfileFormik.touched.birthdate &&
                editProfileFormik.errors.birthdate && (
                  <label className='label-text-alt text-error'>
                    {editProfileFormik.errors.birthdate}
                  </label>
                )}
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='Gender' />
              <select
                name='gender'
                className='select select-bordered font-normal w-full'
                required
                value={editProfileFormik.values.gender}
                onChange={editProfileFormik.handleChange}
              >
                <option value='' disabled>
                  Gender
                </option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
              {editProfileFormik.touched.gender &&
                editProfileFormik.errors.gender && (
                  <label className='label-text-alt text-error'>
                    {editProfileFormik.errors.gender}
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
            loading={updateProfileIsLoading}
            form='editProfileForm'
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal
        open={openModal.editEmail}
        onClickBackdrop={handleModalClose}
        responsive
        className='max-w-sm'
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
          Change Email
        </Modal.Header>
        <Modal.Body>
          <Form
            id='editEmailForm'
            onSubmit={(e) => {
              e.preventDefault();
              editEmailFormik.handleSubmit();
            }}
          >
            <Form.Label title='Email' />
            <Input
              name='email'
              className='w-full'
              type='email'
              required
              value={editEmailFormik.values.email}
              onChange={editEmailFormik.handleChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Actions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button
            color='primary'
            type='submit'
            loading={updateProfileIsLoading}
            form='editEmailForm'
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default ProfileContent;
