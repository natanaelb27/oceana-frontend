import { ImgHTMLAttributes, useState } from 'react';
import ClassNames from '../../../utils/classnames';
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
      <LazyLoad threshold={0.99}>
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
        <div
          className={ClassNames([
            'bg-base-200 rounded-box animate-pulse',
            className !== undefined ? className : '',
          ])}
        />
      )}
      <LazyLoad threshold={0.99}>
        <img
          {...props}
          alt={alt ? 'Image' : ''}
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
