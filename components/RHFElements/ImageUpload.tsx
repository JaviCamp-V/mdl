import React from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Avatar, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { Field } from '@/types/common/IForm';
import { getExpectedFileTypes } from '@/utils/fileUtil';
import { blur_url } from '@/libs/common';
import Iconify from '../Icon/Iconify';

interface ImageUploadProps extends Field {}
const ImageUpload: React.FC<ImageUploadProps> = ({ name }) => {
  const { register, unregister, setValue, watch } = useFormContext();

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      setValue(name, acceptedFiles.length ? acceptedFiles[0] : undefined, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    },
    [name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop,
    accept: getExpectedFileTypes(['image'])
  });
  React.useEffect(() => {
    register(name);
    return () => unregister(name);
  }, [name]);

  const image = watch(name);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
      <Box
        {...getRootProps()}
        sx={{
          width: 90,
          height: 90,
          backgroundColor: 'background.default',
          border: isDragActive ? '1px dashed black' : 'none',
          borderColor: 'primary.main',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
          borderRadius: '50%',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
      >
        {image && (
          <Image src={URL.createObjectURL(image)} fill placeholder="blur" blurDataURL={blur_url} alt="avatar" />
        )}

        <Box
          sx={{
            position: 'absolute', // Position the overlay box absolutely within the parent
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Center the overlay box
            zIndex: 1,
            backgroundColor: '#313347',
            padding: 1,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Iconify icon="mdi:image-add" width={20} sx={{ color: 'white' }} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button
          {...getRootProps()}
          variant="contained"
          color="primary"
          sx={{ textTransform: 'capitalize', width: '100%', whiteSpace: 'nowrap', paddingX: 2, paddingY: 1 }}
        >
          {image ? 'Change Image' : 'Upload Image'}
        </Button>
        {image && (
          <Button
            sx={{
              textTransform: 'capitalize',
              width: '100%',
              borderColor: 'info.main',
              whiteSpace: 'nowrap',
              paddingX: 2,
              paddingY: 1
            }}
            variant="outlined"
            color="secondary"
            startIcon={<Iconify icon="mdi:delete" sx={{ color: '#f56c6c!important' }} />}
            onClick={() => setValue(name, undefined, { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
          >
            Remove Image
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload;