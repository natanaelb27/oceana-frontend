import { ChangeEvent, useEffect, useState } from 'react';
import { HiOutlineCamera, HiOutlineVideoCamera } from 'react-icons/hi';
import { MEDIA_TYPE } from '../../../constants';
import { notifyErrorToast } from '../../../utils/toast';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiHourglass } from 'react-icons/bi';
import ViewFileCard from '../UploadFileCard/ViewFileCard';

type ContentProps = {
  files: string[];
  setFiles: (newFiles: string[]) => void;
  uploadLimit: number;
  fileType: string;
  upload: (files: FileList) => void;
  multiple?: boolean;
  onDelete: (index: number) => void;
  loading?: boolean;
};

const UploadFileCardPerFile = ({
  files,
  setFiles,
  uploadLimit,
  fileType,
  upload,
  multiple = true,
  onDelete,
  loading = false,
}: ContentProps) => {
  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files || [];
    if (selectedFiles.length + files.length > uploadLimit) {
      notifyErrorToast(
        `Oops, maximum selection limit is ${uploadLimit} ${
          uploadLimit > 1 ? fileType + 's' : fileType
        }`
      );
      return;
    }

    // upload
    if (e.target.files !== null) {
      upload(e.target.files);
    }
  };

  const onClickDeleteFile = (idx: number) => {
    setFiles(files.filter((_, index) => idx !== index));

    if (onDelete !== undefined) {
      onDelete(idx);
    }
  };

  const renderNewReviewFile = () =>
    files?.map((file, index) => (
      <ViewFileCard
        key={file}
        file={file}
        type={fileType}
        idx={index}
        handleClickDelete={onClickDeleteFile}
      />
    ));

  return (
    <div className='relative flex flex-wrap gap-2'>
      {loading && (
        <div className='absolute z-30 bg-primary-content opacity-70 h-full w-full flex items-center justify-center'>
          <BiHourglass className='text-xl animate-spin' />
        </div>
      )}
      {files.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {files && renderNewReviewFile()}
        </div>
      ) : null}
      {files.length < uploadLimit ? (
        <label className='mx-0 my-auto border-2 border-dotted flex flex-col justify-center items-center rounded-lg cursor-pointer text-sm font-bold text-center w-20 h-20'>
          {fileType === MEDIA_TYPE.IMAGE ? (
            <HiOutlineCamera className='w-8 h-8'></HiOutlineCamera>
          ) : null}
          {fileType === MEDIA_TYPE.VIDEO ? (
            <HiOutlineVideoCamera className='w-8 h-8'></HiOutlineVideoCamera>
          ) : null}
          {uploadLimit - files.length}/{uploadLimit}
          <input
            className='hidden'
            type='file'
            name='images'
            onChange={onSelectFile}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = '';
            }}
            multiple={multiple}
            accept={
              fileType === MEDIA_TYPE.IMAGE
                ? 'image/*'
                : fileType === MEDIA_TYPE.VIDEO
                ? 'video/*'
                : ''
            }
          />
        </label>
      ) : null}
    </div>
  );
};

export default UploadFileCardPerFile;
