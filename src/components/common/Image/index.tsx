import { ImgHTMLAttributes, useState } from 'react';
import ClassNames from '../../../utils/classnames';
import Skeleton from '../Loading/Skeleton';

const Image = ({
  alt,
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <img
        src={require('./../../../assets/images/no-image.webp')}
        alt={'image failed to load'}
        className={className}
      />
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
    </>
  );
};

export default Image;
