import { ImgHTMLAttributes } from 'react';

const Image = ({ ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      {...props}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = require('./../../../assets/images/no-image.webp');
      }}
    />
  );
};

export default Image;
