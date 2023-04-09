import type { ChangeEvent, Ref } from 'react';
import { forwardRef } from 'react';
import React from 'react';

interface CustomFileInputProps {
  multiple: boolean;
  onFilesSelected: (files: File[]) => void;
}

const CustomFileInput = forwardRef(
  (
    { onFilesSelected, multiple }: CustomFileInputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const imageFiles = Array.from(event.target.files).filter((file) => {
          // FIXME: shouldn't hardcode the accept type
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
        multiple={multiple}
        // FIXME: shouldn't hardcode the accept type
        accept='image/*'
        onChange={handleChange}
        ref={ref}
      />
    );
  },
);
CustomFileInput.displayName = 'CustomFileInput';

interface UploadMultipleFilesInputProps {
  multiple?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onFilesSelected: (files: File[]) => void;
}

const UploadFileInput = ({
  multiple = false,
  inputRef,
  onFilesSelected,
}: UploadMultipleFilesInputProps) => {
  const handleFilesSelected = async (files: File[]) => {
    onFilesSelected(files);
  };

  return (
    <div>
      <CustomFileInput
        ref={inputRef}
        multiple={multiple}
        onFilesSelected={handleFilesSelected}
      />
    </div>
  );
};

export default UploadFileInput;
