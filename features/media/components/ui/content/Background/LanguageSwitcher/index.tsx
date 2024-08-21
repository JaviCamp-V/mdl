'use client';

import React from 'react';
import { Translation } from '@/features/media/types/interfaces/Translation';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { color } from '@/libs/common';

interface TranslationSwitcherProps {
  translations: Translation[];
}

const TranslationSwitcher: React.FC<TranslationSwitcherProps> = ({ translations }) => {
  const [currentTranslation, setCurrentTranslation] = React.useState<Translation>(
    translations.find((translation) => translation?.iso_639_1 === 'en') || translations[0]
  );
  return (
    <Box sx={{ marginBottom: 1 }}>
      <Box>
        <Typography
          fontSize={14}
          whiteSpace="pre-line"
          lineHeight={1.5}
          sx={{ WebkitFontSmoothing: 'antialiased', whiteSpace: 'pre-line' }}
        >
          {currentTranslation?.data?.overview}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 1,
          marginTop: 1
        }}
      >
        {translations.slice(0, 6).map((translation) => (
          <Button
            key={translation.iso_639_1}
            variant="outlined"
            onClick={() => setCurrentTranslation(translation)}
            sx={{
              color: color,
              borderColor: '#606266',
              textTransform: 'capitalize',
              backgroundColor: translation?.iso_639_1 === currentTranslation?.iso_639_1 ? '#1c1c1d' : '#3a3b3c',
              pointerEvents: translation?.iso_639_1 === currentTranslation?.iso_639_1 ? 'none' : 'auto',
              cursor: translation?.iso_639_1 === currentTranslation?.iso_639_1 ? 'default' : 'pointer'
            }}
          >
            {translation.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default TranslationSwitcher;