export const toUploadMediaRequest = (media: File): FormData => {
  const formData = new FormData();
  formData.append('media', media);
  return formData;
};
