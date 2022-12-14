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
import { setCredentials } from '../../../store/slices/authSlice';
import { useLazyGetProfileQuery } from '../../../store/services/profileService';
import { useAppDispatch } from '../../../store/store';

const Illustration = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    data-name='Layer 1'
    width='928.52587'
    height='635.2126'
    viewBox='0 0 928.52587 635.2126'
  >
    <circle cx='546.40861' cy='233' r='233' fill='#f2f2f2' />
    <path
      d='M267.14836,695.73927a39.063,39.063,0,0,0,37.72112-6.64475c13.212-11.08918,17.35435-29.35853,20.72485-46.275l9.96924-50.03559-20.87165,14.37143c-15.00965,10.33508-30.35744,21.00127-40.75007,35.97113s-14.929,35.40506-6.57885,51.60315'
      transform='translate(-135.73706 -132.3937)'
      fill='#e6e6e6'
    />
    <path
      d='M268.93246,756.31777c-2.11249-15.38745-4.28468-30.97255-2.80288-46.52494,1.316-13.81219,5.52988-27.30282,14.10882-38.36422a63.8196,63.8196,0,0,1,16.37384-14.83745c1.63739-1.03352,3.14442,1.5614,1.51416,2.59041a60.67183,60.67183,0,0,0-23.99889,28.9564c-5.22489,13.28948-6.06393,27.77612-5.16355,41.89338.54449,8.53722,1.69847,17.01851,2.86134,25.48891a1.55428,1.55428,0,0,1-1.04766,1.84517,1.50915,1.50915,0,0,1-1.84518-1.04766Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#f2f2f2'
    />
    <path
      d='M408.73336,735.12443a22.26366,22.26366,0,0,0,20.4619,7.60621c9.69252-1.64386,16.99541-9.4324,23.52884-16.77825l19.32458-21.72757L457.644,705.27456c-10.359.75491-20.97969,1.57515-30.4046,5.93973s-17.54587,13.10443-18.10946,23.4756'
      transform='translate(-135.73706 -132.3937)'
      fill='#e6e6e6'
    />
    <path
      d='M392.14858,765.42363c3.39683-8.17455,6.82128-16.46349,12.03288-23.68308,4.62846-6.41176,10.589-11.8301,17.99559-14.7958a36.37365,36.37365,0,0,1,12.32755-2.57538c1.103-.03617,1.096,1.67409-.00222,1.7101a34.57944,34.57944,0,0,0-20.14644,7.31937c-6.39969,5.028-10.988,11.90886-14.61472,19.1095-2.19317,4.35449-4.07055,8.85716-5.94042,13.35705a.88586.88586,0,0,1-1.047.60523.86012.86012,0,0,1-.60523-1.047Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#f2f2f2'
    />
    <path
      d='M289.27958,729.08926a28.75529,28.75529,0,0,0,25.05474,12.93133c12.68315-.60208,23.25684-9.45412,32.77516-17.85807l28.15329-24.85722L356.63,698.41361c-13.39961-.64126-27.14492-1.23941-39.90759,2.89278s-24.53307,14.0769-26.8668,27.28729'
      transform='translate(-135.73706 -132.3937)'
      fill='#e6e6e6'
    />
    <path
      d='M262.96242,765.16329c10.16773-17.99115,21.9614-37.98626,43.03473-44.377a48.022,48.022,0,0,1,18.10109-1.869c1.9218.16571,1.44191,3.1281-.4764,2.9627a44.61381,44.61381,0,0,0-28.88649,7.64231c-8.1449,5.544-14.48659,13.25165-19.85414,21.42525-3.28779,5.00658-6.23278,10.22556-9.17833,15.43754-.94134,1.66563-3.69279.46328-2.74046-1.22182Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#f2f2f2'
    />
    <path
      d='M702.07,458.07511c20.21713-11.11154,45.37875-8.88155,67.16141-1.28454s41.52211,20.04317,62.67523,29.24883c64.64,28.1308,142.54824,23.5948,203.48691-11.84751,5.76335,13.406-.41945,28.74022-7.21108,41.65571s-14.53209,26.914-11.7363,41.236c3.57763,18.32718,22.793,29.31536,30.57874,46.28791,7.39086,16.11167,3.42387,35.0325-2.24615,51.82719s-13.028,33.7152-12.06453,51.415,13.82268,36.416,31.54867,36.43c-26.26936,4.08171-53.0555,8.16626-79.3089,3.9832s-52.36859-18.06777-64.55825-41.693c-6.09277-11.80863-8.44148-25.38593-15.43872-36.68213-11.91826-19.2406-34.79115-28.28862-56.37224-35.1079s-44.6762-13.38826-59.871-30.16213c-14.47787-15.98239-19.06353-38.24611-26.73413-58.4007a186.53661,186.53661,0,0,0-64.58839-84.22984'
      transform='translate(-135.73706 -132.3937)'
      fill='#6c63ff'
    />
    <path
      d='M725.49486,374.3382c-7.097-3.30155-15.81044-4.38389-23.03182-1.316s-12.14452,10.93154-9.80947,17.89083c1.05869,3.15524,3.46989,6.25835,2.53051,9.445-.72307,2.45285-3.24546,4.07226-5.72259,5.22372s-5.18694,2.11952-6.97842,4.06155-2.16509,5.28533.07286,6.79139c.73731.49618,1.65885.7315,2.37375,1.25437a3.772,3.772,0,0,1,1.16432,4.22219,8.89329,8.89329,0,0,1-2.85084,3.75066c-2.54053,2.19094-5.89807,4.69849-5.10925,7.80873a5.47831,5.47831,0,0,0,3.697,3.45788,18.36721,18.36721,0,0,0,5.42688.71626l74.96621,2.36156a28.422,28.422,0,0,0,7.40167-.41344,8.76185,8.76185,0,0,0,5.81294-3.905c1.43559-2.65728.4931-5.93057-1.2798-8.41186s-4.282-4.43862-6.35525-6.71709-3.76948-5.1227-3.404-8.06747c.29256-2.35733,1.84718-4.39471,2.96321-6.53661s1.76427-4.81847.31886-6.78893c-2.03678-2.77665-6.92687-2.5255-9.24284-5.11283-1.74777-1.95256-1.41027-4.76346-1.58405-7.28135-.418-6.05656-4.61117-11.77645-10.58027-14.43257a20.83058,20.83058,0,0,0-18.95323,1.29081Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#2f2e41'
    />
    <polygon
      points='542.385 622.099 530.644 618.571 538.663 571.604 555.992 576.811 542.385 622.099'
      fill='#a0616a'
    />
    <path
      d='M677.69743,766.77357l-37.85868-11.37465.14386-.47886a15.386,15.386,0,0,1,19.16265-10.30886l.00093.00028,23.12268,6.9473Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#2f2e41'
    />
    <polygon
      points='653.182 622.496 640.922 622.495 635.09 575.207 653.184 575.208 653.182 622.496'
      fill='#a0616a'
    />
    <path
      d='M792.04534,766.77357l-39.53051-.00147v-.5a15.38605,15.38605,0,0,1,15.38647-15.38623h.001l24.1438.001Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#2f2e41'
    />
    <path
      d='M771.90046,719.12347a4.50048,4.50048,0,0,1-4.4414-3.78808L749.25569,601.7807a3.50022,3.50022,0,0,0-6.68824-.78906L695.40608,714.52777a4.51622,4.51622,0,0,1-5.57862,2.54394L672.79328,711.393a4.48511,4.48511,0,0,1-2.9663-5.26074L708.4759,535.11078a4.52538,4.52538,0,0,1,3.37183-3.3916L763.68025,519.687a4.5623,4.5623,0,0,1,3.70752.76953c34.13037,24.79883,31.24707,105.82129,24.88623,193.79785a4.50192,4.50192,0,0,1-4.29444,4.17383l-15.88183.69141C772.03181,719.12152,771.96589,719.12347,771.90046,719.12347Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#2f2e41'
    />
    <circle cx='592.53158' cy='282.47071' r='24.56103' fill='#a0616a' />
    <path
      d='M729.32893,542.16156a39.89858,39.89858,0,0,1-17.02368-3.93457l-.18262-.085-.07251-.18848-22.02954-57.07617-.41895-9.917A23.7725,23.7725,0,0,1,714.692,446.22015l23.38769,1.31739a23.787,23.787,0,0,1,22.43677,23.61035c.60742,1.167,4.92139,10.292-3.533,18.86523-.31592,1.95215-3.27319,22.24707,7.88672,33.40723l.31372.31347-.27417.34864C764.732,524.309,750.39949,542.15863,729.32893,542.16156Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#3f3d56'
    />
    <path
      d='M762.17091,546.46725a10.05576,10.05576,0,0,0,5.277-14.48823l23.35887-27.04334-18.41436-2.39689-19.35886,26.04828a10.11028,10.11028,0,0,0,9.13733,17.88018Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#a0616a'
    />
    <path
      d='M776.77546,525.59418a4.48916,4.48916,0,0,1-2.46875-.74024l-11.553-7.57715a4.49134,4.49134,0,0,1-1.39892-6.06445l8.36377-14.05176a6.27236,6.27236,0,0,0-2.824-8.93164l-24.02783-10.77246a14.32392,14.32392,0,0,1-8.11206-15.915h0a14.24089,14.24089,0,0,1,20.43237-9.7539l36.45215,18.67871a19.17711,19.17711,0,0,1,6.80493,28.28906L780.4239,523.725A4.48892,4.48892,0,0,1,776.77546,525.59418Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#3f3d56'
    />
    <path
      d='M703.142,411.37254c7.75642-.62285,14.19623-8.3714,13.38973-16.11089a13.00909,13.00909,0,0,0,11.14121,13.24574c3.55787.392,7.4584-.68444,10.55524,1.11047,3.43,1.988,4.52758,6.81578,8.10091,8.53283,3.45255,1.659,7.83771-.60362,9.54346-4.03331s1.28713-7.5502.15669-11.21005a31.65248,31.65248,0,0,0-52.68951-12.97513c-3.26143,3.28049-5.851,7.46146-6.271,12.06821s1.717,9.60535,5.85416,11.67486Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#2f2e41'
    />
    <path
      d='M646.00131,343.3379a10.05578,10.05578,0,0,1,3.10451,15.10357l19.15887,30.16483-18.567-.31813-15.34707-28.59626a10.11027,10.11027,0,0,1,11.65066-16.354Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#a0616a'
    />
    <path
      d='M661.44385,364.81768l24.67358,58.30169,25.86871,43.86419a14.18889,14.18889,0,0,1-8.12022,20.7901h0a14.26532,14.26532,0,0,1-16.95083-7.56917L637.0578,373.67221a4.49993,4.49993,0,0,1,2.69943-6.19151l16.16594-5.193a4.60035,4.60035,0,0,1,.94246-.19733A4.47425,4.47425,0,0,1,661.44385,364.81768Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#3f3d56'
    />
    <path
      d='M892.73706,767.6063h-756a1,1,0,0,1,0-2h756a1,1,0,0,1,0,2Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#ccc'
    />
    <path
      d='M733.59533,240.6063v82a1,1,0,1,1-2,0v-82a1,1,0,0,1,2,0Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#ccc'
    />
    <path
      d='M820.42095,310.17127l-28.28427,28.28427a1,1,0,0,1-1.41421-1.41421l28.28427-28.28427a1,1,0,1,1,1.41421,1.41421Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#ccc'
    />
    <path
      d='M644.76971,310.17127,673.054,338.45554a1,1,0,0,0,1.41422-1.41421l-28.28428-28.28427a1,1,0,1,0-1.41421,1.41421Z'
      transform='translate(-135.73706 -132.3937)'
      fill='#ccc'
    />
  </svg>
);

const SellerRegistration = () => {
  const { data: getAddressesData } = useGetAddressesQuery();
  const [registerMerchant] = useCreateMerchantMutation();
  const [createAddress, { isLoading: createAddressIsLoading }] =
    useCreateAddressMutation();
  const [getSubDistrict] = useLazyGetSubDistrictsQuery();
  const [getProfile, { isLoading: getProfileIsLoading }] =
    useLazyGetProfileQuery();
  const dispatch = useAppDispatch();
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
          notifySuccessToast('Your shop successfully registered!');
          getProfile()
            .unwrap()
            .then((res) => {
              dispatch(
                setCredentials({ role: res.data?.role ? res.data.role : null })
              );
              navigate('/');
            });
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
              <img src='https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/kratos/8d9aee94.png' />
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
            loading={createAddressIsLoading || getProfileIsLoading}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default SellerRegistration;
