import { Button, Dropdown, Tooltip } from 'react-daisyui';
import {
  AiOutlineDown,
  AiOutlineStock,
  AiOutlineOrderedList,
} from 'react-icons/ai';
import { BsExclamationLg } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';
import { ProductsSort } from '../../../types/sort';

import {
  SortBarContainer,
  SortContainer,
  SortLabel,
  SortBtn,
  SortBtnText,
  SortBtnContainer,
} from './style';

type SortBarProps = {
  sort: ProductsSort;
  onSortChange: (sort: ProductsSort) => void;
};

const SortBar = ({ sort, onSortChange }: SortBarProps) => {
  const handleSortClick = (newSort: ProductsSort) => {
    onSortChange(newSort === sort ? ProductsSort.Default : newSort);
  };

  return (
    <SortBarContainer>
      <SortContainer>
        <SortLabel>Sort By</SortLabel>
        <SortBtnContainer>
          <Tooltip message='Recommended'>
            <SortBtn
              color={sort === ProductsSort.Recommended && 'secondary'}
              onClick={() => handleSortClick(ProductsSort.Recommended)}
            >
              <FaCrown />
              <SortBtnText>Recommended</SortBtnText>
            </SortBtn>
          </Tooltip>
          <Tooltip message='Newest'>
            <SortBtn
              color={sort === ProductsSort.Newest && 'secondary'}
              onClick={() => handleSortClick(ProductsSort.Newest)}
            >
              <BsExclamationLg />
              <SortBtnText>Newest</SortBtnText>
            </SortBtn>
          </Tooltip>
          <Tooltip message='Best Seller'>
            <SortBtn
              color={sort === ProductsSort.BestSeller && 'secondary'}
              onClick={() => handleSortClick(ProductsSort.BestSeller)}
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
              sort === ProductsSort.HighestPrice ||
              sort === ProductsSort.LowestPrice
                ? 'secondary'
                : undefined
            }
          >
            <AiOutlineOrderedList />
            {sort !== ProductsSort.HighestPrice &&
              sort !== ProductsSort.LowestPrice &&
              'Order By'}
            {sort === ProductsSort.HighestPrice && 'Highest Price'}
            {sort === ProductsSort.LowestPrice && 'Lowest Price'}
          </Button>
          <Dropdown.Menu className='w-52'>
            <Dropdown.Item
              onClick={() => handleSortClick(ProductsSort.HighestPrice)}
            >
              Price highest to lowest
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleSortClick(ProductsSort.LowestPrice)}
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
