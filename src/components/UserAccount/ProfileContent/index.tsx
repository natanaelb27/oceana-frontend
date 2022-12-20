import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import { Button, Card, Divider, Form, Input, Modal } from 'react-daisyui';
import * as Yup from 'yup';
import { HiOutlinePhotograph, HiOutlineMail } from 'react-icons/hi';
import { CgClose, CgPassword, CgProfile } from 'react-icons/cg';

import {
  useRequestVerificationCodeMutation,
  useUpdateProfileEmailMutation,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
  useUpdateProfileUsernameMutation,
} from '../../../store/services/profileService';
import { Profile } from '../../../types/component';
import {
  toUpdateProfileImageRequest,
  toUpdateProfileRequest,
} from '../../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import {
  RequestPasswordVerificationCodeResponse,
  UpdateProfileResponse,
} from '../../../types/response';
import ChangePasswordModal from './ChangePasswordModal';

type ProfileContentProps = {
  profile: Profile | null | undefined;
};

type OpenProfileModal = {
  editProfile: boolean;
  editUsername: boolean;
  editEmail: boolean;
  editPassword: boolean;
};

const ProfileContent = ({ profile }: ProfileContentProps) => {
  const [openModal, setOpenModal] = useState<OpenProfileModal>({
    editProfile: false,
    editUsername: false,
    editEmail: false,
    editPassword: false,
  });
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const [updateProfile, { isLoading: updateProfileIsLoading }] =
    useUpdateProfileMutation();
  const [updateProfileEmail, { isLoading: updateProfileEmailIsLoading }] =
    useUpdateProfileEmailMutation();
  const [updateProfileUsername, { isLoading: updateProfileUsernameIsLoading }] =
    useUpdateProfileUsernameMutation();
  const [updateProfileImage, { isLoading: updateProfileImageIsLoading }] =
    useUpdateProfileImageMutation();
  const [
    requestVerificationCode,
    { isLoading: requestVerificationCodeIsLoading },
  ] = useRequestVerificationCodeMutation();

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
          setOpenModal({
            editProfile: false,
            editUsername: false,
            editEmail: false,
            editPassword: false,
          });
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as UpdateProfileResponse;

            notifyErrorToast(response.message);
          }
        });
    },
  });

  const editUsernameFormik = useFormik({
    initialValues: {
      username: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please enter your full name'),
    }),
    onSubmit: (values) => {
      const { username } = values;

      updateProfileUsername({ username })
        .unwrap()
        .then(() => {
          notifySuccessToast('Profile updated!');
          setOpenModal({
            editProfile: false,
            editUsername: false,
            editEmail: false,
            editPassword: false,
          });
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as UpdateProfileResponse;

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
      email: Yup.string()
        .email('Invalid email address')
        .required('Please enter your email'),
    }),
    onSubmit: (values) => {
      const { email } = values;

      updateProfileEmail({ email })
        .unwrap()
        .then(() => {
          notifySuccessToast('Profile updated!');
          setOpenModal({
            editProfile: false,
            editUsername: false,
            editEmail: false,
            editPassword: false,
          });
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as UpdateProfileResponse;

            notifyErrorToast(response.message);
          }
        });
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
        setOpenModal({
          editProfile: false,
          editUsername: false,
          editEmail: false,
          editPassword: false,
        });
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as UpdateProfileResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  const handleEditProfileClick = () => {
    setOpenModal({
      editProfile: true,
      editUsername: false,
      editEmail: false,
      editPassword: false,
    });
  };

  const handleEditUsernameClick = () => {
    setOpenModal({
      editProfile: false,
      editUsername: true,
      editEmail: false,
      editPassword: false,
    });
  };

  const handleEditEmailClick = () => {
    setOpenModal({
      editProfile: false,
      editUsername: false,
      editEmail: true,
      editPassword: false,
    });
  };

  const handlePasswordClick = () => {
    requestVerificationCode()
      .unwrap()
      .then(() => {
        notifySuccessToast('Verification code has been sent to your email');
        setOpenModal({
          editProfile: false,
          editUsername: false,
          editEmail: false,
          editPassword: true,
        });
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as RequestPasswordVerificationCodeResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  const handleModalClose = () => {
    setOpenModal({
      editProfile: false,
      editUsername: false,
      editEmail: false,
      editPassword: false,
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
              src={
                photo
                  ? photo
                  : 'https://i.pinimg.com/736x/2a/4d/11/2a4d11d5d32c83812d2e07742578835c.jpg'
              }
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = require('../../../assets/images/no-image.webp');
              }}
              className='object-cover w-full'
            />
            <div className='p-4'>
              <Button
                className='w-full normal-case font-medium mb-2.5'
                color='primary'
                loading={updateProfileImageIsLoading}
                onClick={handleUploadImageClick}
                startIcon={<HiOutlinePhotograph className='text-xl' />}
              >
                Choose Image
              </Button>
              <Button
                className='w-full normal-case font-medium'
                onClick={handlePasswordClick}
                loading={requestVerificationCodeIsLoading}
                startIcon={<CgPassword className='text-xl' />}
              >
                Change Password
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
                onClick={handleEditUsernameClick}
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
        <Modal.Header className='text-center font-bold mb-4'>
          Edit Profile
        </Modal.Header>
        <div className='mb-8 flex justify-center flex-col gap-2'>
          <CgProfile className='mx-auto text-9xl text-secondary hover:animate-pulse' />
          <span className='text-center mx-auto'>
            Your profile data will not be shown to other users.
          </span>
        </div>
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
        open={openModal.editUsername}
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
        <Modal.Header className='text-center font-bold mb-4'>
          Change Username
        </Modal.Header>
        <Modal.Body>
          <Form
            id='editUsernameForm'
            onSubmit={(e) => {
              e.preventDefault();
              editUsernameFormik.handleSubmit();
            }}
          >
            <CgProfile className='mx-auto text-9xl text-secondary hover:animate-pulse' />
            <span className='text-center mb-8'>
              Your username will represent you in Oceana
            </span>
            <Form.Label title='Username' />
            <Input
              name='username'
              className='w-full'
              required
              value={editUsernameFormik.values.username}
              onChange={editUsernameFormik.handleChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Actions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button
            color='primary'
            type='submit'
            loading={updateProfileUsernameIsLoading}
            form='editUsernameForm'
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
        <Modal.Header className='text-center font-bold mb-4'>
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
            <HiOutlineMail className='mx-auto text-9xl text-secondary hover:animate-pulse' />
            <span className='text-center mb-8'>
              Make sure your email is active for safe and seamless transaction.
            </span>
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
            loading={updateProfileEmailIsLoading}
            form='editEmailForm'
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
      <ChangePasswordModal
        open={openModal.editPassword}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default ProfileContent;
