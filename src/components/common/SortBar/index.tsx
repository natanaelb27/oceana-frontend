import { Button, Dropdown, Tooltip } from 'react-daisyui';
import {
  AiOutlineDown,
  AiOutlineStock,
  AiOutlineOrderedList,
} from 'react-icons/ai';
import { BsExclamationLg } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';
import { Sort } from '../../../types/sort';

import {
  SortBarContainer,
  SortContainer,
  SortLabel,
  SortBtn,
  SortBtnText,
} from './style';

type SortBarProps = {
  sort: Sort;
  onSortChange: (sort: Sort) => void;
};

const SortBar = ({ sort, onSortChange }: SortBarProps) => {
  const handleSortClick = (newSort: Sort) => {
    onSortChange(newSort === sort ? Sort.Default : newSort);
  };

  return (
    <SortBarContainer>
      <SortContainer>
        <SortLabel>Sort By</SortLabel>
        <div className='flex justify-end gap-2'>
          <Tooltip message='Most Popular'>
            <SortBtn
              color={sort === Sort.MostPopular && 'secondary'}
              onClick={() => handleSortClick(Sort.MostPopular)}
            >
              <FaCrown />
              <SortBtnText>Most Popular</SortBtnText>
            </SortBtn>
          </Tooltip>
          <Tooltip message='Newest'>
            <SortBtn
              color={sort === Sort.Newest && 'secondary'}
              onClick={() => handleSortClick(Sort.Newest)}
            >
              <BsExclamationLg />
              <SortBtnText>Newest</SortBtnText>
            </SortBtn>
          </Tooltip>
          <Tooltip message='Best Seller'>
            <SortBtn
              color={sort === Sort.BestSeller && 'secondary'}
              onClick={() => handleSortClick(Sort.BestSeller)}
            >
              <AiOutlineStock />
              <SortBtnText>Best Seller</SortBtnText>
            </SortBtn>
          </Tooltip>
        </div>
        <Dropdown className='col-span-2'>
          <Button
            endIcon={<AiOutlineDown />}
            tabIndex={0}
            className='btn w-full'
            color={
              sort === Sort.HighestPrice || sort === Sort.LowestPrice
                ? 'secondary'
                : undefined
            }
          >
            <AiOutlineOrderedList />
            {sort !== Sort.HighestPrice &&
              sort !== Sort.LowestPrice &&
              'Order By'}
            {sort === Sort.HighestPrice && 'Highest Price'}
            {sort === Sort.LowestPrice && 'Lowest Price'}
          </Button>
          <Dropdown.Menu className='w-52'>
            <Dropdown.Item onClick={() => handleSortClick(Sort.HighestPrice)}>
              Price highest to lowest
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortClick(Sort.LowestPrice)}>
              Price lowest to highest
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </SortContainer>
    </SortBarContainer>
  );
};

export default SortBar;
