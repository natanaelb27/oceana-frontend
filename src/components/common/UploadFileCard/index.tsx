import { ChangeEvent, useState } from 'react';
import { HiOutlineCamera, HiOutlineVideoCamera } from 'react-icons/hi';
import { MEDIA_TYPE } from '../../../constants';
import { notifyErrorToast } from '../../../utils/toast';
import ViewFileCard from './ViewFileCard';

type ContentProps = {
  upload_limit: number;
  file_type: string;
};

const UploadFileCard = ({ upload_limit, file_type }: ContentProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [filesView, setFilesView] = useState<string[]>([]);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files || [];
    const selectedFilesViewArray = Array.from(selectedFiles);

    if (selectedFiles.length + filesView.length > upload_limit) {
      notifyErrorToast(
        `Oops, maximum selection limit is ${upload_limit} ${
          upload_limit > 1 ? file_type + 's' : file_type
        }`
      );
      return;
    }

    const filesViewArray = selectedFilesViewArray.map((file) =>
      URL.createObjectURL(file)
    );
    setFilesView([...filesView, ...filesViewArray]);

    const selectedFilesArray = [];
    for (let i = 0; i < selectedFiles.length; i += 1) {
      selectedFilesArray.push(selectedFiles[i]);
    }
    setFiles([...files, ...selectedFilesArray]);
  };

  const onClickDeleteNewPhoto = (idx: number) => {
    setFiles(files.filter((_, index) => idx !== index));
    setFilesView(filesView.filter((_, index) => idx !== index));
  };

  const renderNewReviewFile = () =>
    filesView?.map((file, index) => (
      <ViewFileCard
        key={file}
        file={file}
        type={file_type}
        idx={index}
        handleClick={onClickDeleteNewPhoto}
      />
    ));
  return (
    <div className='flex flex-wrap gap-2'>
      {files.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {filesView && renderNewReviewFile()}
        </div>
      ) : null}
      {files.length < upload_limit ? (
        <label className='mx-0 my-auto border-2 border-dotted flex flex-col justify-center items-center rounded-lg cursor-pointer text-sm font-bold text-center w-20 h-20'>
          {file_type === MEDIA_TYPE.IMAGE ? (
            <HiOutlineCamera className='w-8 h-8'></HiOutlineCamera>
          ) : null}
          {file_type === MEDIA_TYPE.VIDEO ? (
            <HiOutlineVideoCamera className='w-8 h-8'></HiOutlineVideoCamera>
          ) : null}
          {upload_limit - files.length}/{upload_limit}
          <input
            className='hidden'
            type='file'
            name='images'
            onChange={onSelectFile}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = '';
            }}
            multiple
            accept={
              file_type === MEDIA_TYPE.IMAGE
                ? 'image/*'
                : file_type === MEDIA_TYPE.VIDEO
                ? 'video/*'
                : ''
            }
          />
        </label>
      ) : null}
    </div>
  );
};

export default UploadFileCard;
