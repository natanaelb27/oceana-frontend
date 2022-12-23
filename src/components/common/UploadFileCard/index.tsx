import { ChangeEvent, useState } from 'react';
import { HiOutlineCamera, HiOutlineVideoCamera } from 'react-icons/hi';
import { MEDIA_TYPE } from '../../../constants';
import { notifyErrorToast } from '../../../utils/toast';
import ViewFileCard from './ViewFileCard';

type ContentProps = {
  files: File[];
  setFiles: (f: File[]) => void;
  uploadLimit: number;
  fileType: string;
};

const UploadFileCard = ({
  files,
  setFiles,
  uploadLimit,
  fileType,
}: ContentProps) => {
  const [filesView, setFilesView] = useState<string[]>([]);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files || [];
    const selectedFilesViewArray = Array.from(selectedFiles);
    if (selectedFiles.length + filesView.length > uploadLimit) {
      notifyErrorToast(
        `Oops, maximum selection limit is ${uploadLimit} ${
          uploadLimit > 1 ? fileType + 's' : fileType
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

  const onClickDeleteFile = (idx: number) => {
    setFiles(files.filter((_, index) => idx !== index));
    setFilesView(filesView.filter((_, index) => idx !== index));
  };

  const renderNewReviewFile = () =>
    filesView?.map((file, index) => (
      <ViewFileCard
        key={file}
        file={file}
        type={fileType}
        idx={index}
        handleClickDelete={onClickDeleteFile}
      />
    ));

  return (
    <div className='flex flex-wrap gap-2'>
      {files.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {filesView && renderNewReviewFile()}
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
            multiple
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

export default UploadFileCard;
