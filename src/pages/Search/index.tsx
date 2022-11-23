import { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoFilter } from 'react-icons/io5';
import { ProductCard, SortBar } from '../../components/common';
import { ProductsSort } from '../../types/sort';

const Search = () => {
  const [sort, setSort] = useState(ProductsSort.Default);
  return (
    <div className='mx-auto my-6 container flex justify-center gap-6'>
      <div className='hidden w-56 h-96 bg-base-200 rounded-full shadow-md md:inline'>
        <div className='w-full my-8 flex justify-center items-center gap-2 text-lg font-bold'>
          <IoFilter />
          <h5>FILTER</h5>
        </div>
      </div>
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
