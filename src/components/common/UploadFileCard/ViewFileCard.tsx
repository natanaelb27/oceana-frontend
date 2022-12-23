import React, { MouseEventHandler, useState } from 'react';
import { Tooltip } from 'react-daisyui';
import {
  HiOutlineX,
  HiOutlineXCircle,
  HiTrash,
  HiXCircle,
} from 'react-icons/hi';
import Zoom from 'react-medium-image-zoom';
import { MEDIA_TYPE } from '../../../constants';

type ContentProps = {
  file: string;
  type: string;
  idx: number;
  handleClickDelete: (idx: number) => void;
};

function ViewFileCard({ file, idx, type, handleClickDelete }: ContentProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const onDeleteFile = () => {
    handleClickDelete(idx);
  };

  if (type === MEDIA_TYPE.IMAGE) {
    return (
      <div
        className='relative'
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <Zoom>
          <img src={file} className='border rounded-lg w-20 h-20'></img>
        </Zoom>
        <div
          className={`bg-base-300/75 flex justify-center items-center w-full h-[30%] absolute rounded-b-lg transition-all ease-in-out duration-200 bottom-0 ${
            isHovering ? 'md:opacity-100' : 'md:opacity-0'
          }`}
        >
          <Tooltip message='Delete Image' className='cursor-pointer'>
            <HiXCircle className='' onClick={onDeleteFile}></HiXCircle>
          </Tooltip>
        </div>
      </div>
    );
  } else if (type === MEDIA_TYPE.VIDEO) {
    return (
      <div
        className='relative'
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <video src={file} className='border rounded-lg w-20 h-20'></video>
        <div
          className={`bg-base-300/75 flex justify-center items-center w-full h-[30%] absolute rounded-b-lg transition-all ease-in-out duration-200 bottom-0 ${
            isHovering ? 'md:opacity-100' : 'md:opacity-0'
          }`}
        >
          <Tooltip message='Delete Video' className='cursor-pointer'>
            <HiXCircle className='' onClick={onDeleteFile}></HiXCircle>
          </Tooltip>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default ViewFileCard;
