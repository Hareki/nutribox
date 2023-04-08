import { IKCore } from 'imagekitio-react';
import type { ChangeEvent, Ref } from 'react';
import { forwardRef } from 'react';
import React from 'react';

import { IKPublicContext } from 'utils/constants';

interface CustomFileInputProps {
  onFilesSelected: (files: File[]) => void;
}

const CustomFileInput = forwardRef(
  ({ onFilesSelected }: CustomFileInputProps, ref: Ref<HTMLInputElement>) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const imageFiles = Array.from(event.target.files).filter((file) => {
          return file.type.startsWith('image/');
        });

        if (imageFiles.length > 0) {
          onFilesSelected(imageFiles);
        } else {
          console.log('No image files selected.');
        }
      }
    };

    return (
      <input
        type='file'
        multiple
        accept='image/*'
        onChange={handleChange}
        ref={ref}
      />
    );
  },
);
CustomFileInput.displayName = 'CustomFileInput';

const imagekit = new IKCore(IKPublicContext);

interface UploadMultipleFilesInputProps {
  folderName: string;
  onStart?: () => void;
  onSuccess?: (results: any) => void;
  onError?: (error: any) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const UploadMultipleFilesInput = ({
  folderName,
  onStart,
  onSuccess,
  onError,
  inputRef,
}: UploadMultipleFilesInputProps) => {
  const handleFilesSelected = async (files: File[]) => {
    console.log(
      'file: UploadMultipleFilesInput.tsx:96 - handleFilesSelected - files:',
      files,
    );
    onStart?.();

    const uploadPromises = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(
        'file: UploadMultipleFilesInput.tsx:105 - handleFilesSelected - file:',
        file,
      );

      const uploadPromise = imagekit.upload({
        file: file,
        fileName: file.name,
        folder: folderName,
        responseFields: ['url'],
        // useUniqueFileName: false,
      });

      uploadPromises.push(uploadPromise);
    }

    try {
      const results = await Promise.all(uploadPromises);
      onSuccess?.(results);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <div>
      <CustomFileInput ref={inputRef} onFilesSelected={handleFilesSelected} />
    </div>
  );
};

export default UploadMultipleFilesInput;
