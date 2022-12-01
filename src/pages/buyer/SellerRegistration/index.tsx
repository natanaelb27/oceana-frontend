import { FormContainer, GlassContainer } from '../../../components/common/Container';
import { FormTitle, InputGroup } from '../../../components/common/Form';
import {
  useGetAddressesQuery,
} from '../../../store/services/addressService';
import { Button, Form, Input, Link } from 'react-daisyui';

const SellerRegistration = () => {
  const {data: getAddressesData, isLoading: getAddressessIsLoading} = useGetAddressesQuery();
  
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <GlassContainer className="bg-primary">
        <div className="text-white text-2xl text-center mb-3 font-bold">Register Your Shop</div>
        <Form>
          <InputGroup className="md:inline">
            <div className="flex flex-col mb-2">
              <label className='text-white mb-1'>Shop Name</label>
              <Input className='input-sm md:input-md' placeholder='Enter your shop name here' type="text"/>
            </div>
            <div className="flex flex-col mb-2">
              <label className='text-white mb-1'>Shop Default Address</label>
              <select className="select w-full">
                <option disabled selected>Select your address</option>
                {getAddressesData?.data?.map((data) => {
                  return <option key={data.id} value={data.id}>{data.name} - {data.detail}</option>;
                })}
              </select>
            </div>
          </InputGroup>
          <Button className='mt-2' type='submit' color='secondary'>Register My Shop</Button>
        </Form>
      </GlassContainer>
    </div>
  );
};

export default SellerRegistration;
