import React, { useState } from 'react';
import ClassNames from '../../../utils/classnames';
import Skeleton from '../Loading/Skeleton';

type ImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

export default function Img({ src, alt, className }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    console.log('test');
    return (
      <img
        src={require('./../../../assets/images/no-data.gif')}
        alt={'image failed to load'}
        className={ClassNames([className !== undefined ? className : ''])}
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
        src={src}
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
}
