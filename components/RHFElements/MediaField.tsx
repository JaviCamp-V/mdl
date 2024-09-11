'use client';

import React from 'react';
import Image from 'next/image';
import { getSearchContent } from '@/features/media/service/tmdbAdvancedService';
import { MediaSearchResult, MovieSearchResult, TVSearchResult } from '@/features/media/types/interfaces/SearchResponse';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, Paper, PaperProps, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useDebounce from '@/hooks/useDebounce';
import { Field } from '@/types/common/IForm';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import { blur_url } from '@/libs/common';
import countries from '@/libs/countries';

interface MediaFieldProps extends Field {}

const Wrapper: React.FC<PaperProps> = ({ children, ...rest }) => {
  return (
    <Paper
      {...rest}
      sx={{
        position: 'relative',
        marginTop: 1,
        border: '1px solid #3e4042',
        borderRadius: '4px',
        bgcolor: 'background.paper',
        paddingY: 1
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          left: 40,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: '10px solid #3e4042'
        }}
      />
      {children}
    </Paper>
  );
};

interface MediaItemProps {
  content: MediaSearchResult;
  props: any;
}
const MediaItem: React.FC<MediaItemProps> = ({ props, content }) => {
  const { media_type, poster_path, origin_country } = content;
  const path = poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}` : '/static/images/no_poster.jpg';

  const blurUrl = poster_path ? blur_url : undefined;
  const origin = origin_country?.map((c) => countries.find((co) => co.code === c)?.nationality).join(', ') ?? 'N/A';
  const first_air_date = media_type === MediaType.tv ? content.first_air_date : content.release_date;
  const year = first_air_date ? formatStringDate(first_air_date).getFullYear() : 'TBA';
  const name = media_type === MediaType.tv ? content.name : content.title;

  return (
    <Box
      {...props}
      component="li"
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'flex-start',
        gap: 2,
        paddingX: 2,
        paddingY: 1,
        '&:hover': {
          backgroundColor: '#fff1'
        }
      }}
    >
      <Image
        src={path}
        alt={name}
        width={45}
        height={64}
        style={{ borderRadius: 2 }}
        placeholder="blur"
        blurDataURL={blurUrl}
      />
      <Box>
        <Typography fontSize={14} fontWeight={600} color="primary">
          {name}
        </Typography>
        <Typography sx={{ opacity: 0.6, fontSize: 13 }}>{`${origin} - ${year}`}</Typography>
      </Box>
    </Box>
  );
};

const MediaField: React.FC<MediaFieldProps> = ({ name, label }) => {
  const [value, setValue] = React.useState<MediaSearchResult | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<MediaSearchResult[]>([]);
  const debouncedInputValue = useDebounce(inputValue, 500);

  const methods = useFormContext();
  const rhfValue = methods.watch(name);
  React.useEffect(() => {
    if (debouncedInputValue) {
      const getOptions = async () => {
        const response = await getSearchContent(debouncedInputValue);
        setOptions(response);
      };
      getOptions();
    } else {
      setOptions([]);
    }
  }, [debouncedInputValue]);

  React.useEffect(() => {
    if (rhfValue) {
      const option = options.find(
        (option) => option.id === rhfValue.mediaId && option.media_type === rhfValue.mediaType
      );
      setValue(option ?? null);
    }
  }, [rhfValue]);

  const onChange = (_: any, newValue: MediaSearchResult | null) => {
    const formattedValue = newValue
      ? { mediaId: newValue.id, mediaType: newValue.media_type, poster_path: newValue.poster_path }
      : null;
    methods.setValue(name, formattedValue);
  };

  return (
    <Autocomplete
      autoComplete={false}
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      ListboxProps={{ sx: { scrollbarWidth: 'none' } }}
      PaperComponent={Wrapper}
      getOptionLabel={(option) => {
        if (option.media_type === MediaType.movie) return option.title;
        return option.name;
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id && option.media_type === value.media_type}
      renderOption={(props, option) => <MediaItem key={props.key} props={props} content={option} />}
      sx={{
        '& .MuiAutocomplete-popupIndicator': {
          color: 'info.contrastText'
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'info.main',
              color: 'info.contrastText',
              fontSize: '14px'
            },
            '& input': {
              '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 1000px info.main inset`,
                WebkitTextFillColor: 'info.contrastText'
              }
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: 'info.contrastText'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            },
            '& .MuiSelect-icon': {
              color: 'info.contrastText'
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'background.paper'
              },
              '&:hover fieldset': {
                borderColor: 'background.paper'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'background.paper'
              }
            },
            fontSize: '14px'
          }}
        />
      )}
      fullWidth
    />
  );
};

export default MediaField;
