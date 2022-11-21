import { Checkbox, Collapse, Divider, Form } from 'react-daisyui';

type ReviewFilterProps = {
  isLoading?: boolean;
};

const ReviewFilter = ({ isLoading }: ReviewFilterProps) => {
  if (isLoading) {
    return (
      <div className='border border-base-300 bg-base-100 rounded-box p-4 animate-pulse'>
        <div className='h-6 bg-base-200 w-3/5 mx-auto rounded-full'></div>
        <Divider />
        <div className='h-4 bg-base-200 w-2/5 rounded-full mb-4'></div>
        <div className='border-b-2 border-base-200 mb-4'></div>
        <div className='h-4 bg-base-200 w-3/5 rounded-full mb-4'></div>
        <div className='border-b-2 border-base-200 mb-4'></div>
        <div className='h-4 bg-base-200 w-4/5 rounded-full mb-4'></div>
      </div>
    );
  }

  return (
    <div className='border border-base-300 bg-base-100 rounded-box p-4'>
      <h5 className='uppercase font-medium text-center mt-1'>Filter Reviews</h5>
      <Divider />
      <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
        <Collapse.Title className='font-medium'>Media</Collapse.Title>
        <Collapse.Content>
          <Form>
            <Form.Label title='With Photo & Video'>
              <Checkbox />
            </Form.Label>
          </Form>
        </Collapse.Content>
      </Collapse>
      <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
        <Collapse.Title className='font-medium'>Rating</Collapse.Title>
        <Collapse.Content>
          <Form>
            <Form.Label title='⭐ 5'>
              <Checkbox />
            </Form.Label>
            <Form.Label title='⭐ 4'>
              <Checkbox />
            </Form.Label>
            <Form.Label title='⭐ 3'>
              <Checkbox />
            </Form.Label>
            <Form.Label title='⭐ 2'>
              <Checkbox />
            </Form.Label>
            <Form.Label title='⭐ 2'>
              <Checkbox />
            </Form.Label>
          </Form>
        </Collapse.Content>
      </Collapse>
      <Collapse checkbox icon='arrow'>
        <Collapse.Title className='font-medium'>Review Topic</Collapse.Title>
        <Collapse.Content>
          <Form>
            <Form.Label title='Quality'>
              <Checkbox />
            </Form.Label>
            <Form.Label title='Service'>
              <Checkbox />
            </Form.Label>
            <Form.Label title='Accuracy'>
              <Checkbox />
            </Form.Label>
            <Form.Label title='Delivery'>
              <Checkbox />
            </Form.Label>
          </Form>
        </Collapse.Content>
      </Collapse>
    </div>
  );
};

export default ReviewFilter;
