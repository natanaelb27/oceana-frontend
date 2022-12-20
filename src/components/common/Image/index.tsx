import { ImgHTMLAttributes } from 'react';

const Image = ({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      {...props}
      alt={alt || 'Image'}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = require('./../../../assets/images/no-image.webp');
      }}
    />
  );
};

export default Image;
