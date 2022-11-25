import { Button, Dropdown, Tooltip } from 'react-daisyui';
import {
  AiOutlineDown,
  AiOutlineStock,
  AiOutlineOrderedList,
} from 'react-icons/ai';
import { BsExclamationLg } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';
import { ProductsSortBy } from '../../../types/sort';

import {
  SortBarContainer,
  SortContainer,
  SortLabel,
  SortBtn,
  SortBtnText,
  SortBtnContainer,
} from './style';

type SortBarProps = {
  sort: ProductsSortBy;
  onSortChange: (sort: ProductsSortBy) => void;
};

const SortBar = ({ sort, onSortChange }: SortBarProps) => {
  const handleSortClick = (newSort: ProductsSortBy) => {
    onSortChange(newSort === sort ? ProductsSortBy.Default : newSort);
  };

  return (
    <SortBarContainer>
      <SortContainer>
        <SortLabel>Sort By</SortLabel>
        <SortBtnContainer>
          <Tooltip message='Recommended'>
            <SortBtn
              color={sort === ProductsSortBy.Recommended && 'secondary'}
              onClick={() => handleSortClick(ProductsSortBy.Recommended)}
            >
              <FaCrown />
              <SortBtnText>Recommended</SortBtnText>
            </SortBtn>
          </Tooltip>
          <Tooltip message='Newest'>
            <SortBtn
              color={sort === ProductsSortBy.Newest && 'secondary'}
              onClick={() => handleSortClick(ProductsSortBy.Newest)}
            >
              <BsExclamationLg />
              <SortBtnText>Newest</SortBtnText>
            </SortBtn>
          </Tooltip>
          <Tooltip message='Best Seller'>
            <SortBtn
              color={sort === ProductsSortBy.BestSeller && 'secondary'}
              onClick={() => handleSortClick(ProductsSortBy.BestSeller)}
            >
              <AiOutlineStock />
              <SortBtnText>Best Seller</SortBtnText>
            </SortBtn>
          </Tooltip>
        </SortBtnContainer>
        <Dropdown className='col-span-2'>
          <Button
            endIcon={<AiOutlineDown />}
            tabIndex={0}
            className='btn w-full rounded-full'
            color={
              sort === ProductsSortBy.HighestPrice ||
              sort === ProductsSortBy.LowestPrice
                ? 'secondary'
                : undefined
            }
          >
            <AiOutlineOrderedList />
            {sort !== ProductsSortBy.HighestPrice &&
              sort !== ProductsSortBy.LowestPrice &&
              'Order By'}
            {sort === ProductsSortBy.HighestPrice && 'Highest Price'}
            {sort === ProductsSortBy.LowestPrice && 'Lowest Price'}
          </Button>
          <Dropdown.Menu className='w-52'>
            <Dropdown.Item
              onClick={() => handleSortClick(ProductsSortBy.HighestPrice)}
            >
              Price highest to lowest
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleSortClick(ProductsSortBy.LowestPrice)}
            >
              Price lowest to highest
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </SortContainer>
    </SortBarContainer>
  );
};

export default SortBar;
