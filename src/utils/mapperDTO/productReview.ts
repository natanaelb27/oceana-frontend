export const toCreateProductReviewRequest = (
  rating: number,
  review: string,
  photo: File[],
  video: File[]
): FormData => {
  const formData = new FormData();

  for (let i = 0; i < photo.length; i++) {
    formData.append('photo_' + (i + 1), photo[i]);
  }

  if (video.length > 0) {
    formData.append('video', video[0]);
  }

  formData.append('rating', String(rating));
  formData.append('review', review);

  return formData;
};
