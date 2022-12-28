import { Button, Dropdown } from 'react-daisyui';
import { AiOutlineDown, AiOutlineOrderedList } from 'react-icons/ai';
import { FavoriteProductsSortBy } from '../../../types/sort';

import { SortBarContainer, SortLabel } from './style';

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
      <div className='grid grid-cols-2 gap-2 md:flex md:flex-row md:items-center justify-between w-full'>
        <SortLabel>Sort By</SortLabel>
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
      </div>
    </SortBarContainer>
  );
};

export default FavoriteSortBar;
