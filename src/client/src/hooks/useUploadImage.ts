import { ToastOptions } from 'react-toastify';
import { useUploadImageMutation } from '../store/api/main.api';
import { HttpStatus } from '../types/HttpStatus';
import { useErrorToast } from './useErrorToast';
import { RefObject } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { IImage } from '../types/Image';
import { IMutation } from '../types/RTK';
import { IResponse } from '../types/Response';

export const useUploadImage = (): [
  IResponse<IImage> | undefined,
  (
    image: File | string,
    imageRef: RefObject<AvatarEditor>,
  ) => Promise<string | undefined>,
] => {
  const [uploadFile, { data: uploadedImage, error }] = useUploadImageMutation();

  const toastOptions: ToastOptions = {
    position: 'bottom-center',
    type: 'error',
  };

  useErrorToast(
    error,
    [
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage: 'Upload avatar error.',
      },
    ],
    toastOptions,
  );

  const uploadImage = async (
    image: File | string,
    imageRef: RefObject<AvatarEditor>,
  ): Promise<string | undefined> => {
    if (image && image instanceof File && !uploadedImage?.data) {
      const canvas = imageRef.current?.getImage();

      if (canvas) {
        const file = await new Promise<File | null>((resolve) =>
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], image.name, { type: image.type }));
            }
          }, image.type),
        );

        if (file) {
          const formData = new FormData();
          const blob = file?.slice();
          formData.append('file', blob, file?.name);
          const uploadedFile: IMutation<IResponse<IImage>> = await uploadFile(
            formData,
          );

          if (uploadedFile.data) {
            return uploadedFile.data.data?._id;
          }
        }
      }
    }
  };

  return [uploadedImage, uploadImage];
};
