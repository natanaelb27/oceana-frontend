import { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { ProductCard, SortBar } from '../../components/common';
import { FilterSidebar } from '../../components/Search';
import { ProductsSort } from '../../types/sort';

const Search = () => {
  const [sort, setSort] = useState(ProductsSort.Default);
  return (
    <div className='mx-auto my-6 container flex justify-center gap-6'>
      <FilterSidebar />
      <div className='main flex flex-col'>
        <div className='product-list-header'>
          <div className='ml-2 mb-6 flex items-center gap-2 text-lg'>
            <AiOutlineInfoCircle />
            <p>{'Search results for  "___"'}</p>
          </div>
          <SortBar sort={sort} onSortChange={setSort} />
        </div>
        <div className='product-list mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5'>
          {Array(30)
            .fill(0)
            .map((_, n) => (
              <div key={n} className='w-48 aspect-w-1 aspect-h-2'>
                <ProductCard />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
