import { IKCore } from 'imagekitio-react';

import { IKPublicContext } from 'constants/imagekit.constant';

interface HandleUpload {
  folderName: string;
  onUploadStart?: () => void;
  onUploadSuccess?: (results: any, context?: Record<string, any>) => void;
  onUploadError?: (error: any) => void;
  context?: Record<string, any>;
}

export const handleUpload = async (
  {
    onUploadError,
    onUploadStart,
    onUploadSuccess,
    folderName,
    context,
  }: HandleUpload,
  files: File[],
) => {
  onUploadStart?.();
  const imagekit = new IKCore(IKPublicContext);

  const uploadPromises = [] as any[];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const uploadPromise = imagekit.upload({
      file,
      fileName: file.name,
      folder: folderName,
      responseFields: ['url'],
      // useUniqueFileName: false,
    });

    uploadPromises.push(uploadPromise);
  }

  try {
    const results = await Promise.all(uploadPromises);
    onUploadSuccess?.(results, context);
  } catch (error) {
    onUploadError?.(error);
  }
};
