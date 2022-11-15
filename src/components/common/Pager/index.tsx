import { Button, Pagination } from 'react-daisyui';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

type Pager = {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
};

const Pager = ({ page, totalPage, onPageChange }: Pager) => {
  const handlePageClick = (n: number) => {
    onPageChange(n);
  };

  if (totalPage <= 5) {
    const pages = Array.from({ length: totalPage }, (_, index) => index + 1);

    return (
      <Pagination>
        {pages.map((index: number) => (
          <Button
            key={index}
            active={page === index}
            onClick={() => handlePageClick(index)}
          >
            {index}
          </Button>
        ))}
      </Pagination>
    );
  }

  if (page === 1 || page === totalPage) {
    return (
      <Pagination>
        <Button disabled={page === 1} onClick={() => handlePageClick(page - 1)}>
          <MdNavigateBefore className='text-xl' />
        </Button>
        <Button active={page === 1} onClick={() => handlePageClick(1)}>
          1
        </Button>
        <Button active={page === 2} onClick={() => handlePageClick(2)}>
          2
        </Button>
        <Button disabled>...</Button>
        <Button
          active={page === totalPage - 1}
          onClick={() => handlePageClick(totalPage - 1)}
        >
          {totalPage - 1}
        </Button>
        <Button
          active={page === totalPage}
          onClick={() => handlePageClick(totalPage)}
        >
          {totalPage}
        </Button>
        <Button
          disabled={page === totalPage}
          onClick={() => handlePageClick(page + 1)}
        >
          <MdNavigateNext className='text-xl' />
        </Button>
      </Pagination>
    );
  }

  if (page === 2) {
    return (
      <Pagination>
        <Button onClick={() => handlePageClick(page - 1)}>
          <MdNavigateBefore className='text-xl' />
        </Button>
        <Button onClick={() => handlePageClick(1)}>1</Button>
        <Button active onClick={() => handlePageClick(2)}>
          2
        </Button>
        <Button onClick={() => handlePageClick(3)}>3</Button>
        <Button disabled>...</Button>
        <Button
          active={page === totalPage}
          onClick={() => handlePageClick(totalPage)}
        >
          {totalPage}
        </Button>
        <Button
          disabled={page === totalPage}
          onClick={() => handlePageClick(page + 1)}
        >
          <MdNavigateNext className='text-xl' />
        </Button>
      </Pagination>
    );
  }

  if (page === totalPage - 1) {
    return (
      <Pagination>
        <Button onClick={() => handlePageClick(page - 1)}>
          <MdNavigateBefore className='text-xl' />
        </Button>
        <Button onClick={() => handlePageClick(1)}>1</Button>
        <Button disabled>...</Button>
        <Button onClick={() => handlePageClick(totalPage - 2)}>
          {totalPage - 2}
        </Button>
        <Button active onClick={() => handlePageClick(totalPage - 1)}>
          {totalPage - 1}
        </Button>
        <Button
          active={page === totalPage}
          onClick={() => handlePageClick(totalPage)}
        >
          {totalPage}
        </Button>
        <Button
          disabled={page === totalPage}
          onClick={() => handlePageClick(page + 1)}
        >
          <MdNavigateNext className='text-xl' />
        </Button>
      </Pagination>
    );
  }

  return (
    <Pagination>
      <Button disabled={page === 1} onClick={() => handlePageClick(page - 1)}>
        <MdNavigateBefore className='text-xl' />
      </Button>
      <Button onClick={() => handlePageClick(1)}>1</Button>
      <Button disabled>...</Button>
      <Button active onClick={() => handlePageClick(page)}>
        {page}
      </Button>
      <Button disabled>...</Button>
      <Button onClick={() => handlePageClick(totalPage)}>{totalPage}</Button>
      <Button
        disabled={page === totalPage}
        onClick={() => handlePageClick(page + 1)}
      >
        <MdNavigateNext className='text-xl' />
      </Button>
    </Pagination>
  );
};

export default Pager;
