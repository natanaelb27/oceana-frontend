import { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { ProductCard, SortBar } from '../../components/common';
import { FilterSidebar } from '../../components/Search';
import { ProductsSort } from '../../types/sort';

const Search = () => {
  const [sort, setSort] = useState(ProductsSort.Default);
  return (
    <div className='mx-auto container'>
      <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
        <div className='col-span-1'>
          <FilterSidebar />
        </div>
        <div id='product-list-search-page' className='col-span-4 flex flex-col'>
          <div className='product-list-header'>
            <div className='ml-2 mb-6 flex items-center gap-2 text-lg'>
              <AiOutlineInfoCircle />
              <p>{'Search results for  "___"'}</p>
            </div>
            <SortBar sort={sort} onSortChange={setSort} />
          </div>
          <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
            {Array(30)
              .fill(0)
              .map((_, n) => (
                <ProductCard key={n} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
