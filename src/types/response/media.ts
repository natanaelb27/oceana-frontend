import { Metadata, UploadMedia } from '../component';

export type UploadMediaResponse = {
  data: UploadMedia | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
