import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Form,
  Input,
} from 'react-daisyui';
import { IoFilter } from 'react-icons/io5';
import { FilterSidebarContainer } from './style';

const FilterSidebar = () => {
  const handleClickFilterToggle = () => {
    const filterSidebarEl = document.getElementById('filter-sidebar');
    filterSidebarEl?.classList.toggle('-left-full');
    filterSidebarEl?.classList.toggle('left-0');
    const productListSearchPageEl = document.getElementById(
      'product-list-search-page'
    );
    productListSearchPageEl?.classList.toggle('hidden');
  };

  return (
    <>
      <FilterSidebarContainer id='filter-sidebar'>
        <div className='w-full py-4 flex justify-center items-center gap-2 text-lg font-bold'>
          <IoFilter />
          <h5>FILTER</h5>
        </div>
        <Divider className='m-0' />

        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Location</Collapse.Title>
          <Collapse.Content>
            <Form>
              <Form.Label title='Nothing to see here...'>
                <Checkbox />
              </Form.Label>
            </Form>
          </Collapse.Content>
        </Collapse>
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Price</Collapse.Title>
          <Collapse.Content>
            <Form>
              <Form.Label title='Min'>
                <Input className='w-full ml-2 focus:border-primary' />
              </Form.Label>
              <Form.Label title='Max'>
                <Input className='w-full ml-2 focus:border-primary' />
              </Form.Label>
            </Form>
          </Collapse.Content>
        </Collapse>
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Category</Collapse.Title>
          <Collapse.Content>
            <Form>
              <Form.Label title='Nothing to see here...'>
                <Checkbox />
              </Form.Label>
            </Form>
          </Collapse.Content>
        </Collapse>
        <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
          <Collapse.Title className='font-bold'>Rating</Collapse.Title>
          <Collapse.Content>
            <Form>
              <Form.Label title='⭐ 4 and above'>
                <Checkbox />
              </Form.Label>
              <Form.Label title='⭐ 3 and above'>
                <Checkbox />
              </Form.Label>
              <Form.Label title='⭐ 2 and above'>
                <Checkbox />
              </Form.Label>
            </Form>
          </Collapse.Content>
        </Collapse>
      </FilterSidebarContainer>
      <Button
        className='fixed bottom-10 right-10 btn-circle text-xl drop-shadow-xl z-40 md:hidden'
        color='primary'
        onClick={handleClickFilterToggle}
      >
        <IoFilter />
      </Button>
    </>
  );
};

export default FilterSidebar;
