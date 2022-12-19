import React from 'react';
import { Checkbox, Collapse, Divider, Form } from 'react-daisyui';
import { AiOutlineComment } from 'react-icons/ai';

type ReviewFilterProps = {
  handleChangeFilterReviewWithMedia?: () => void;
  handleChangeFilterReviewRating?: (e: React.SyntheticEvent) => void;
  handleChangeFilterReviewComments?: () => void;
  isLoading?: boolean;
};

const ReviewFilter = ({
  isLoading,
  handleChangeFilterReviewWithMedia,
  handleChangeFilterReviewRating,
  handleChangeFilterReviewComments,
}: ReviewFilterProps) => {
  if (
    isLoading ||
    !handleChangeFilterReviewComments ||
    !handleChangeFilterReviewRating ||
    !handleChangeFilterReviewWithMedia
  ) {
    return (
      <div className='border border-base-300 bg-base-100 rounded-box p-4 animate-pulse'>
        <div className='h-6 bg-base-200 w-3/5 mx-auto rounded-full'></div>
        <Divider />
        <div className='h-4 bg-base-200 w-2/5 rounded-full mb-4'></div>
        <div className='border-b-2 border-base-200 mb-4'></div>
        <div className='h-4 bg-base-200 w-3/5 rounded-full mb-4'></div>
        <div className='border-b-2 border-base-200 mb-4'></div>
        <div className='h-4 bg-base-200 w-4/5 rounded-full mb-4'></div>
      </div>
    );
  }

  return (
    <div className='border border-base-300 bg-base-100 rounded-box p-4'>
      <h5 className='uppercase font-medium text-center mt-1'>Filter Reviews</h5>
      <Divider />
      <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
        <Collapse.Title className='font-medium'>Media</Collapse.Title>
        <Collapse.Content>
          <Form>
            <Form.Label title='With Photo & Video'>
              <Checkbox onClick={handleChangeFilterReviewWithMedia} />
            </Form.Label>
          </Form>
        </Collapse.Content>
      </Collapse>
      <Collapse checkbox icon='arrow' className='border-b-2 border-base-200'>
        <Collapse.Title className='font-medium'>Rating</Collapse.Title>
        <Collapse.Content>
          <Form>
            <Form.Label title='⭐ 5'>
              <Checkbox value={5} onClick={handleChangeFilterReviewRating} />
            </Form.Label>
            <Form.Label title='⭐ 4'>
              <Checkbox value={4} onClick={handleChangeFilterReviewRating} />
            </Form.Label>
            <Form.Label title='⭐ 3'>
              <Checkbox value={3} onClick={handleChangeFilterReviewRating} />
            </Form.Label>
            <Form.Label title='⭐ 2'>
              <Checkbox value={2} onClick={handleChangeFilterReviewRating} />
            </Form.Label>
            <Form.Label title='⭐ 1'>
              <Checkbox value={1} onClick={handleChangeFilterReviewRating} />
            </Form.Label>
          </Form>
        </Collapse.Content>
      </Collapse>
      <Collapse checkbox icon='arrow'>
        <Collapse.Title className='font-medium truncate'>
          Comments
        </Collapse.Title>
        <Collapse.Content>
          <Form>
            <div className='flex justify-between'>
              <div className='truncate text-sm ml-1.5'>With Comments</div>
              <Checkbox onClick={handleChangeFilterReviewComments} />
            </div>
          </Form>
        </Collapse.Content>
      </Collapse>
    </div>
  );
};

export default ReviewFilter;
