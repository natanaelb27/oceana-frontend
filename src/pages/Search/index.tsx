import { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useSearchParams } from 'react-router-dom';
import { Pager, ProductCard, SortBar } from '../../components/common';
import { FilterSidebar } from '../../components/Search';
import { ProductsSort } from '../../types/sort';

const Search = () => {
  const [sort, setSort] = useState(ProductsSort.Default);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();

  return (
    <div className='mx-auto container'>
      <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
        <div className='col-span-1'>
          <FilterSidebar />
        </div>
        <div id='product-list-search-page' className='col-span-4 flex flex-col'>
          <div className='product-list-header'>
            <div className='ml-2 flex items-center gap-2 text-lg'>
              <AiOutlineInfoCircle />
              <p>
                Search results for &quot;
                <strong>{searchParams.get('q')}</strong>&quot;
              </p>
            </div>
            <div className='mt-6'>
              <SortBar sort={sort} onSortChange={setSort} />
            </div>
            <div className='mt-6 flex justify-center'>
              <Pager
                page={currentPage}
                totalPage={7}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
          <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
            {Array(30)
              .fill(0)
              .map((_, n) => (
                <ProductCard key={n} />
              ))}
          </div>
          <div className='mt-6 flex justify-center'>
            <Pager
              page={currentPage}
              totalPage={7}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
