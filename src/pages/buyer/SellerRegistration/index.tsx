import { FormContainer, GlassContainer } from '../../../components/common/Container';
import { FormErrorText, FormTitle, InputGroup } from '../../../components/common/Form';
import {
  useGetAddressesQuery,
} from '../../../store/services/addressService';
import { Button, Form, Input, Link } from 'react-daisyui';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useCreateMerchantMutation } from '../../../store/services/merchantService';
import { useFormik } from 'formik';
import { toRegisterMerchantRequest } from '../../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';

const SellerRegistration = () => {
  const {data: getAddressesData, isLoading: getAddressessIsLoading} = useGetAddressesQuery();

  const navigate = useNavigate();
  const [registerMerchant] = useCreateMerchantMutation();

  const notifyRegisterMerchantSuccess = () => {
    notifySuccessToast('Your shop successfully registered!', true);
  };

  const notifyRegisterMerchantFailed = (message: string | null) => {
    notifyErrorToast(message || 'Shop registration failed, please try again!');
  };

  const handleRegisterMerchantSuccess = () => {
    notifyRegisterMerchantSuccess();

    navigate('/');
  };

  const handleRegisterMerchantFailed = (
    message: string,
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    setFieldValue('name', '');
    setFieldValue('addressID', '');
    notifyRegisterMerchantFailed(message);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      addressID: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please enter your shop name'),
      addressID: Yup.string().required('Please select your shop address')
    }),
    onSubmit: (values, { setFieldValue }) => {
      const { name, addressID } = values;

      registerMerchant(toRegisterMerchantRequest(name, addressID))
      .unwrap()
      .then(() => handleRegisterMerchantSuccess())
      .catch((err) => {
        const { data: errorResponse } = err;
        const { message } = errorResponse;
        handleRegisterMerchantFailed(message, setFieldValue);
      });
    }
  });
  
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <GlassContainer className="bg-primary">
        <div className="text-white text-2xl text-center mb-3 font-bold">Register Your Shop</div>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup className="md:inline">
            <div className="flex flex-col mb-2">
              <label className='text-white mb-1'>Shop Name</label>
              <Input className='input-sm md:input-md' placeholder='Enter your shop name here' name="name" onChange={formik.handleChange} value={formik.values.name} type="text"/>

              {formik.touched.name && formik.errors.name ? (<FormErrorText>{formik.errors.name}</FormErrorText>) :  null}
            </div>
            <div className="flex flex-col mb-2">
              <label className='text-white mb-1'>Shop Default Address</label>
              <select name="addressID" value={formik.values.addressID} onChange={formik.handleChange} className="select w-full">
                <option selected>Select your address</option>
                {getAddressesData?.data?.map((data) => {
                  return <option key={data.id} value={data.id}>{data.name} - {data.detail}</option>;
                })}
              </select>
              {formik.touched.addressID && formik.errors.addressID ? (<FormErrorText>{formik.errors.addressID}</FormErrorText>) :  null}
            </div>
          </InputGroup>
          <Button className='mt-2' type='submit' color='secondary'>Register My Shop</Button>
        </Form>
      </GlassContainer>
    </div>
  );
};

export default SellerRegistration;
