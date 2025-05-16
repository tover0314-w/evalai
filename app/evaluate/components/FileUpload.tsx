import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept?: Record<string, string[]>;
}

export default function FileUpload({ onFileUpload, accept }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        transition-colors duration-200 ease-in-out
        flex flex-col items-center justify-center
        cursor-pointer
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400'
        }
      `}
    >
      <input {...getInputProps()} />
      {/* @ts-ignore */}
      <FiUploadCloud className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-600 text-center">
        {isDragActive ? (
          '将文件拖放到这里'
        ) : (
          <>
            将文件拖放到这里，或者
            <span className="text-blue-500 hover:text-blue-600 mx-1">
              点击选择文件
            </span>
          </>
        )}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        支持的文件格式：Excel, CSV
      </p>
    </div>
  );
} 