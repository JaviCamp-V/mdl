import React from 'react';
import Image from 'next/image';
import { Accept, DropzoneOptions, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Box, FormControl, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Field } from '@/types/common/IForm';
import { blur_url } from '@/libs/common';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

type AcceptTypes = 'image' | 'video' | 'audio' | 'document';

interface FileUploadProps extends Field {
  maxFiles?: number;
  acceptTypes?: [];
}

const acceptTypesMap = {
  image: ['image/png', 'image/jpeg', 'image/jpg'],
  video: ['video/mp4', 'video/mkv', 'video/avi'],
  audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  document: ['application/pdf', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint']
};

const mimeTypesExtMap = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/jpg': ['.jpeg', '.jpg'],
  'video/mp4': ['.mp4'],
  'video/mkv': ['.mkv'],
  'video/avi': ['.avi'],
  'audio/mp3': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc', '.docx'],
  'application/vnd.ms-excel': ['.xls', '.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt', '.pptx']
};

const getExpectedFileTypes = (acceptTypes: AcceptTypes[]): Accept =>
  acceptTypes.reduce((acc, type) => {
    const mimeType = acceptTypesMap[type];
    const mapping = mimeType.reduce((mimeTypes, mimeType) => {
      return { ...mimeTypes, [mimeType]: (mimeTypesExtMap as any)[mimeType] };
    }, {});

    return { ...acc, ...mapping };
  }, {} as Accept);

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  maxFiles = 1,
  acceptTypes = ['image'] as AcceptTypes[]
}) => {
  const { register, unregister, setValue, watch } = useFormContext();

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      setValue(name, acceptedFiles, { shouldValidate: true });
    },
    [name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles,
    onDrop,
    accept: getExpectedFileTypes(acceptTypes)
  });
  React.useEffect(() => {
    register(name);
    return () => unregister(name);
  }, [name]);

  const files = watch(name);
  return (
    <Box>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Box {...getRootProps()}>
          <VisuallyHiddenInput name={name} {...getInputProps()} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              border: '1px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ fontSize: '14px', color: 'grey.500' }}>Drag and drop your files here</Box>
              <Box sx={{ fontSize: '14px', color: 'grey.500' }}>or</Box>
              <Box sx={{ fontSize: '14px', color: 'grey.500' }}>Click to browse</Box>
            </Box>
          </Box>
          {files && files.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {files.map((file: File) => (
                <Image
                  key={file.name}
                  src={URL.createObjectURL(file)}
                  width={60}
                  height={60}
                  placeholder="blur"
                  blurDataURL={blur_url}
                  alt={file.name}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </FormControl>
    </Box>
  );
};

export default FileUpload;
