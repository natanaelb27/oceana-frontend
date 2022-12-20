import { ImgHTMLAttributes, useState } from 'react';
import ClassNames from '../../../utils/classnames';
import Skeleton from '../Loading/Skeleton';
import LazyLoad from 'react-lazy-load';

const Image = ({
  alt,
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <LazyLoad threshold={0.99} className='h-fit'>
        <img
          src={require('./../../../assets/images/no-image.webp')}
          alt={'image failed to load'}
          className={className}
        />
      </LazyLoad>
    );
  }

  return (
    <>
      {isLoading && (
        <Skeleton
          className={ClassNames([
            'skeleton',
            className !== undefined ? className : '',
          ])}
        />
      )}
      <LazyLoad threshold={0.99} className='h-fit'>
        <img
          {...props}
          alt={alt}
          className={ClassNames([
            isLoading ? 'hidden' : 'block',
            className !== undefined ? className : '',
          ])}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
        />
      </LazyLoad>
    </>
  );
};

export default Image;
