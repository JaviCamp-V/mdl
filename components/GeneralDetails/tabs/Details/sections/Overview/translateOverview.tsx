'use client';
import { color } from '@/libs/common';
import { Translation } from '@/types/tmdb/ITranslation';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';

interface TranslateOverviewProps {
  translations: Translation[];
}

const TranslateOverview: React.FC<TranslateOverviewProps> = ({translations}) => {
  const [currentTranslation, setCurrentTranslation] = React.useState<Translation>(
    translations.find((translation) => translation.iso_639_1 === 'en') || translations[0]
  );
  return (
    <Box>
      <Box sx={{ width: { xs: '90%', sm: '80%' } }}>
        <Typography
          fontSize={14}
          whiteSpace="pre-line"
          fontFamily="lato,Helvetica,Arial,sans-serif"
          lineHeight={1.5}
          sx={{ WebkitFontSmoothing: 'antialiased' }}
        >
          {currentTranslation.data.overview}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 1,
          marginTop: 1,
          width: { xs: '100%', sm: '90%' }
        }}
      >
        {translations.map((translation) => (
          <Button
            key={translation.iso_639_1}
            variant="outlined"
            onClick={() => setCurrentTranslation(translation)}
            sx={{
              color: color,
              borderColor: '#606266',
              textTransform: 'capitalize',
              backgroundColor: translation.iso_639_1 === currentTranslation.iso_639_1 ? '#1c1c1d' : '#3a3b3c'
            }}
          >
            {translation.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default TranslateOverview;
