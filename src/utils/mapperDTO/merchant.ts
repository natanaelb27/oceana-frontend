export const toUpdateMerchantImageRequest = (photo: File) => {
  const formData = new FormData();

  formData.append('photo', photo);

  return formData;
};
