import { Button, Card, Divider, Input, Textarea } from 'react-daisyui';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { Image } from '../../common';

const RefundCreate = () => {
  const { orderID } = useParams();

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Create Refund</h5>
      <Divider />
      <Card className='shadow-lg'>
        <Card.Body>
          <div className='font-bold text-xl'>Which Items Are Missing?</div>
          <div className='flex items-center mt-3'>
            <input
              type='checkbox'
              className='checkbox checkbox-success'
              checked={true}
            />
            <div className=' h-14 w-14 md:h-16 md:w-16 ml-2 mr-2 h-'>
              <Image
                src='https://images.tokopedia.net/img/cache/100-square/product-1/2020/8/25/49295037/49295037_d63120b6-8ab4-4084-9765-a3b679ab18df_1000_1000.webp?ect=4g'
                className='rounded-lg h-full w-full'
              />
            </div>
            <div className='h-16 flex flex-col'>
              <div className='justify-start mt-2 md:mt-0'>
                Sample Product in Order
              </div>
              <div className='text-sm mt-0.5'>
                Sample Product Variation in Order
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end mt-8 md:mt-4'>
            <div className='flex items-center justify-end gap-1'>
              <Button className='btn-ghost' shape='circle' size='sm'>
                <AiOutlineMinusCircle
                  size={'2em'}
                  className='text-primary pointer-events-none'
                  pointerEvents={'none'}
                />
              </Button>
              <Input
                size='sm'
                className='w-14 text-center border-2 border-primary'
                value={0}
              />
              <Button className='btn-ghost' shape='circle' size='sm'>
                <AiOutlinePlusCircle
                  size='2em'
                  className='text-primary pointer-events-none'
                  pointerEvents={'none'}
                />
              </Button>
            </div>
            <div className='mt-2 mr-7 text-sm'>1/2 items</div>
          </div>
          <Divider />
          <div className='flex justify-between'>
            <div>Total Refund</div>
            <div className='font-bold'>Rp. 80.000</div>
          </div>
        </Card.Body>
      </Card>
      <Card className='mt-2 shadow-lg'>
        <Card.Body>
          <div className='font-bold text-xl'>Reason for Refund</div>
          <Textarea />
        </Card.Body>
      </Card>
      <Card className='mt-2 shadow-lg '>
        <Card.Body>
          <div className='font-bold text-xl'>Photo & Video Proof</div>
          <div>
            Max. of 5 pictures and 1 video (Format .jpg, .jpeg, .png, .mp4,
            .mkv, .mov){' '}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RefundCreate;
