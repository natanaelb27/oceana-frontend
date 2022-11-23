import { IoFilter } from 'react-icons/io5';

const FilterSidebar = () => {
  return (
    <div className='hidden w-56 h-96 bg-base-200 rounded-full shadow-md md:inline'>
      <div className='w-full my-8 flex justify-center items-center gap-2 text-lg font-bold'>
        <IoFilter />
        <h5>FILTER</h5>
      </div>
    </div>
  );
};

export default FilterSidebar;
