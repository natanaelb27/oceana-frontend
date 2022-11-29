import { FormContainer } from '../../../components/common/Container';
import { FormTitle, InputGroup } from '../../../components/common/Form';
import { Button, Form, Input, Link } from 'react-daisyui';

const SellerRegistration = () => {
  return (
    <div>
      <FormTitle className="text-black">Register Your Shop</FormTitle>
      <Form>
        <InputGroup className="md:inline">
          <Input className='input-sm md:input-md' placeholder="Shop Name" type="text"/>
        </InputGroup>
      </Form>
    </div>
  )
};

export default SellerRegistration;
