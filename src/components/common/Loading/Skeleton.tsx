import React from 'react';
import ClassNames from '../../../utils/classnames';

type SkeletonProps = {
  className: string;
};

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={ClassNames([
        'skeleton min-h-[0.5rem] w-full bg-base-200',
        className,
      ])}
    />
  );
};

export default Skeleton;
