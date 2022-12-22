export type CreateProductReviewRequest = {
  rating: number;
  review?: string;
  // photo_1?: FormDataEntryValue | null;
  // photo_2?: FormDataEntryValue | null;
  // photo_3?: FormDataEntryValue | null;
  // photo_4?: FormDataEntryValue | null;
  // photo_5?: FormDataEntryValue | null;
  // video?: FormDataEntryValue | null;

  photo_1?: FormData | null;
  photo_2?: FormData | null;
  photo_3?: FormData | null;
  photo_4?: FormData | null;
  photo_5?: FormData | null;
  video?: FormData | null;
};
