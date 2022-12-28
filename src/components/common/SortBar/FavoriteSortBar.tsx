import { Button, Dropdown, Tooltip } from 'react-daisyui';
import {
  AiOutlineDown,
  AiOutlineStock,
  AiOutlineOrderedList,
} from 'react-icons/ai';
import { BsExclamationLg } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';
import { FavoriteProductsSortBy } from '../../../types/sort';

import {
  SortBarContainer,
  SortContainer,
  SortLabel,
  SortBtn,
  SortBtnText,
  SortBtnContainer,
} from './style';

type FavoriteSortBarProps = {
  sort: FavoriteProductsSortBy;
  onSortChange: (sort: FavoriteProductsSortBy) => void;
};

const FavoriteSortBar = ({ sort, onSortChange }: FavoriteSortBarProps) => {
  const handleSortClick = (newSort: FavoriteProductsSortBy) => {
    onSortChange(newSort === sort ? FavoriteProductsSortBy.Default : newSort);
  };

  return (
    <SortBarContainer>
      <SortContainer>
        <SortLabel>Sort By</SortLabel>
        <SortBtnContainer>
          <Tooltip message='Recommended'>
            <SortBtn
              color={sort === FavoriteProductsSortBy.Recommended && 'secondary'}
              onClick={() =>
                handleSortClick(FavoriteProductsSortBy.Recommended)
              }
            >
              <FaCrown />
              <SortBtnText>Recommended</SortBtnText>
            </SortBtn>
          </Tooltip>
          <Tooltip message='Newest'>
            <SortBtn
              color={sort === FavoriteProductsSortBy.Newest && 'secondary'}
              onClick={() => handleSortClick(FavoriteProductsSortBy.Newest)}
            >
              <BsExclamationLg />
              <SortBtnText>Newest</SortBtnText>
            </SortBtn>
          </Tooltip>
          <Tooltip message='Best Seller'>
            <SortBtn
              color={sort === FavoriteProductsSortBy.BestSeller && 'secondary'}
              onClick={() => handleSortClick(FavoriteProductsSortBy.BestSeller)}
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
              sort === FavoriteProductsSortBy.RecentlySaved ||
              sort === FavoriteProductsSortBy.OldestSaved ||
              sort === FavoriteProductsSortBy.HighestPrice ||
              sort === FavoriteProductsSortBy.LowestPrice
                ? 'secondary'
                : undefined
            }
          >
            <AiOutlineOrderedList />
            {sort !== FavoriteProductsSortBy.RecentlySaved &&
              sort !== FavoriteProductsSortBy.OldestSaved &&
              sort !== FavoriteProductsSortBy.HighestPrice &&
              sort !== FavoriteProductsSortBy.LowestPrice &&
              'Order By'}
            {sort === FavoriteProductsSortBy.RecentlySaved && 'Recently Saved'}
            {sort === FavoriteProductsSortBy.OldestSaved && 'Oldest Saved'}
            {sort === FavoriteProductsSortBy.HighestPrice && 'Highest Price'}
            {sort === FavoriteProductsSortBy.LowestPrice && 'Lowest Price'}
          </Button>
          <Dropdown.Menu className='w-52'>
            <Dropdown.Item
              onClick={() =>
                handleSortClick(FavoriteProductsSortBy.RecentlySaved)
              }
            >
              Recently saved
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                handleSortClick(FavoriteProductsSortBy.OldestSaved)
              }
            >
              Oldest saved
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                handleSortClick(FavoriteProductsSortBy.HighestPrice)
              }
            >
              Price highest to lowest
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                handleSortClick(FavoriteProductsSortBy.LowestPrice)
              }
            >
              Price lowest to highest
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </SortContainer>
    </SortBarContainer>
  );
};

export default FavoriteSortBar;
