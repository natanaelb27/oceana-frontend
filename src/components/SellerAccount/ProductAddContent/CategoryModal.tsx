import { useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import CategoryCollapse from '../../common/CategoryCollapse';
import { useGetAllCategoryQuery } from '../../../store/services/categoryService';
import { Skeleton } from '../../common';

type CategoryModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCategoryOnClick: (id: number, name: string) => void;
};

const CategoryModal = ({
  open,
  setOpen,
  handleCategoryOnClick,
}: CategoryModalProps) => {
  const { data: getAllCategory, isLoading: getAllCategoryIsLoading } =
    useGetAllCategoryQuery('');

  const handleCategoryModalClose = () => {
    setOpen(false);
  };

  const handleCancelClick = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      responsive
      className='max-w-sm'
      onClickBackdrop={handleCategoryModalClose}
    >
      <Button
        size='sm'
        shape='circle'
        color='ghost'
        className='absolute right-2 top-2'
        onClick={handleCategoryModalClose}
      >
        <CgClose className='text-lg' />
      </Button>
      <Modal.Header className='text-center font-bold'>Category</Modal.Header>
      <Modal.Body>
        {getAllCategoryIsLoading && (
          <>
            {new Array(9).fill(undefined).map((_, index) => (
              <Skeleton key={'skeleton-category-' + index} className='h-10' />
            ))}
          </>
        )}
        {!getAllCategoryIsLoading && getAllCategory !== undefined && (
          <div className='overflow-y-auto max-h-[40vh]'>
            {open && (
              <CategoryCollapse
                category={
                  getAllCategory?.data ? getAllCategory.data : undefined
                }
                marginLeft={0}
                handleCategoryClick={handleCategoryOnClick}
              />
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Actions>
        <Button onClick={handleCancelClick}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CategoryModal;
